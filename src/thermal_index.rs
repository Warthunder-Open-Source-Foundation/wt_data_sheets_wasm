use crate::util::{console_log, get_document};
use wasm_bindgen::prelude::*;
use web_sys::{Document, Element};
use crate::make_missile_option_inputs;

#[wasm_bindgen]
pub fn generate_thermal_options() -> Result<(), JsValue> {
	let document = get_document();

	let ul = document.get_element_by_id("ul_input").unwrap();

	let elem = document.create_element("li")?;
	elem.set_attribute("class", "selecto_0");
	elem.set_attribute("value", "0");
	elem.set_inner_html("Tank");
	ul.append_child(&elem);

	let elem = document.create_element("li")?;
	elem.set_attribute("class", "selecto_0");
	elem.set_attribute("value", "1");
	elem.set_inner_html("Helicopter");
	ul.append_child(&elem);

	let elem = document.create_element("li")?;
	elem.set_attribute("class", "selecto_0");
	elem.set_attribute("value", "2");
	elem.set_inner_html("Aircraft");
	ul.append_child(&elem);

	Ok(())
}