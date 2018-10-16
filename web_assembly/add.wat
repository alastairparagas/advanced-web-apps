(module
  (func $additionOperation 
    (param $firstOperand i32) 
    (param $secondOperand i32) 
    (result i32)
    get_local $firstOperand
    get_local $secondOperand
    i32.add)
  (export "add" (func $additionOperation))
)
