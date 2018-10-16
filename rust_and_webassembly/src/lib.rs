extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(nth_term: u32) -> u32 {
  
  if nth_term == 1 {
    return 1;
  }
  if nth_term == 2 {
    return 2;
  }
  
  return fibonacci(nth_term - 1) + fibonacci(nth_term - 2);
}

