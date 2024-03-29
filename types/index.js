// @flow
/* eslint no-unused-vars: off */

type Bytes = number;

type Functype = [Array<Valtype>, Array<Valtype>];

type Hostfunc = any;

type Addr = {
  index: Bytes,
  size: Bytes,
};

type FuncAddr = Addr;
type TableAddr = Addr;
type MemAddr = Addr;
type GlobalAddr = Addr;

interface ExternalVal {
  type: string;
  addr: Addr;
}

type FuncExternalVal = ExternalVal & {
  type: "Func",
};

type ExportInstance = {
  name: string,
  value: ExternalVal,
};

type FuncInstance = {
  type: Functype,
  module: ?ModuleInstance, // its originating module

  // TODO(sven): according to the spec the code property is a string
  // see https://webassembly.github.io/spec/core/exec/runtime.html#function-instances
  // but in the context of an interpreter it make no sense to me.
  // I'll store the instructions from the function body here.
  code: Array<Instruction> | Function,

  isExternal: boolean,
};

type GlobalInstance = {
  type: Valtype,
  mutability: Mutability,
  value: ?NumericOperations<*>,
};

type ModuleInstance = {
  types: any,

  funcaddrs: Array<FuncAddr>,
  tableaddrs: Array<TableAddr>,
  memaddrs: Array<MemAddr>,
  globaladdrs: Array<GlobalAddr>,

  exports: Array<ExportInstance>,
};

/**
 * Stack
 */
// https://webassembly.github.io/spec/core/exec/runtime.html#syntax-frame
type StackFrame = {
  values: Array<any>,

  globals: Array<any>,
  locals: Array<StackLocal>,
  labels: Array<Label>,

  originatingModule: ModuleInstance,
  allocator: Allocator,

  trace?: (number, number, Instruction, StackFrame) => void,

  returnAddress: number,
};

type StackLocal = {
  type: Valtype,
  value: any,
};

type i32 = any;

interface IntegerValue<T> extends NumericOperations<T> {
  div_s(operand: T): T;
  div_u(operand: T): T;
  rem_s(operand: T): T;
  rem_u(operand: T): T;
  shl(operand: T): T;
  shr_s(operand: T): T;
  shr_u(operand: T): T;
  rotl(operand: T): T;
  rotr(operand: T): T;
  and(operand: T): T;
  or(operand: T): T;
  xor(operand: T): T;
  eq(operand: T): i32;
  ne(operand: T): i32;
  lt_s(operand: T): i32;
  lt_u(operand: T): i32;
  le_s(operand: T): i32;
  le_u(operand: T): i32;
  gt_s(operand: T): i32;
  gt_u(operand: T): i32;
  ge_s(operand: T): i32;
  ge_u(operand: T): i32;
  clz(): T;
  popcnt(): T;
  eqz(): i32;
}

interface FloatingPointValue<T, U> extends NumericOperations<T> {
  min(operand: T): T;
  max(operand: T): T;
  copysign(operand: T): T;
  neg(): T;
  abs(): T;
  reinterpret(): U;
  eq(operand: T): i32;
}

interface NumericOperations<T> {
  add(operand: T): T;
  sub(operand: T): T;
  mul(operand: T): T;
  div(operand: T): T;
  equals(operand: T): boolean;
  toNumber(): number;
  toString(): string;
  isTrue(): boolean;
  toString(): string;

  // converts the number into an array of bytes - for integers
  // this is in little-endian order
  toByteArray(): Array<number>;
}

type Label = {
  arity: number,
  value: any,
  id: ?Identifier,
};

interface Allocator {
  malloc(Bytes): Addr;
  get(Addr): any;
  set(Addr, any): void;
  free(Addr): void;
}

interface TableInstance {
  get(number): ?Hostfunc;
  push(Hostfunc): void;
}

type SignatureMap = { [string]: string } | [string, string];

type IRFuncTable = {
  name: string,
  startAt: number,
};

type IR = {
  funcTable: Array<IRFuncTable>,
  program: {
    [number]: Instruction,
  },
};
