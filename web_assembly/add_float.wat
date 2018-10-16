(module
  (func $additionOperation 
    (param $firstOperand f32) 
    (param $secondOperand f32) 
    (result f32)
    get_local $firstOperand
    get_local $secondOperand
    f32.add)
  (export "add" (func $additionOperation))
)

