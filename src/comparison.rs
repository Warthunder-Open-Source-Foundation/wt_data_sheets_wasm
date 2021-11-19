use web_sys::{Document, Window};
use crate::{make_option_inputs, MISSILES};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn make_comparison() {
	make_option_inputs("ul_input", "li", Some("select_0"));
}