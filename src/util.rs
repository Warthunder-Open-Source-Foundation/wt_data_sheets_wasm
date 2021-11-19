use wasm_bindgen::JsValue;
use web_sys::{console, Document, Window};
use wasm_bindgen::prelude::*;
use crate::MISSILES;

#[wasm_bindgen]
pub fn console_log(message: &str) {
	console::log_1(&JsValue::from_str(message));
}

pub fn make_option_inputs(selector: &str, item: &str, class: Option<&str>) {
	let document = get_document();

	let select;
	if let Some(value) = document.get_element_by_id(selector) {
		select = value;
	} else {
		return;
	};

	for (i, missile) in MISSILES.iter().enumerate() {
		let element = document.create_element(item).unwrap();
		element.set_attribute("value", &i.to_string());
		if let Some(value) = class {
			element.set_attribute("class", value);
		}
		element.set_text_content(Some(&missile.name));
		select.append_child(&element);
	}
}

pub fn get_document() -> Document {
	let window: Window = web_sys::window().expect("no global `window` exists");
	let document: Document = window.document().expect("should have a document on window");
	document
}