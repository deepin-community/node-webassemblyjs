(module
  (func (result i32)
    (loop (result f32)
      (f32.const 0)
    )
    (i32.eqz)
    (i32.const 0)
  )
  (func (result i32)
    (block (result f32)
      (f32.const 0)
    )
    (i32.eqz)
    (i32.const 0)
  )
  (global i32 (i32.const 17))
  (func (result f64)
    (get_global 0)
  )
  (func $type-local-num-vs-num (result i64)
    (local i32)
    (get_local 0)
  )
  (func (result i32)
    (return)
    (i32.const 0)
  )
)
