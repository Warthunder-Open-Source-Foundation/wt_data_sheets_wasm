use std::cell::Cell;

use js_sys::Map;
use wasm_bindgen::prelude::*;
use web_sys::{Document, Element};
use wt_datamine_extractor_lib::thermal::thermals::VehicleType;

use crate::{make_missile_option_inputs, THERMALS};
use crate::util::{console_log, get_document};

#[wasm_bindgen]
pub fn generate_tank_list(raw: bool) -> Result<(), JsValue> {
	let document = get_document();

	let table = document.get_element_by_id("table_contents").unwrap();
	document.get_element_by_id("column_1").unwrap().set_inner_html("Gunner");
	document.get_element_by_id("column_2").unwrap().set_inner_html("Commander");
	for THERMAL in THERMALS.iter().enumerate() {
		if THERMAL.1.vehicle_type == VehicleType::Tank {
			let row = document.create_element("tr").unwrap();
			let name = document.create_element("td").unwrap();
			name.set_inner_html(&THERMAL.1.name);
			row.append_child(&name)?;

			for sight in &THERMAL.1.sights {
				let generation = match sight.x {
					500.0 => {
						"one"
					}
					800.0 => {
						"two"
					}
					1200.0 => {
						"three"
					}
					_ => {
						"unknown"
					}
				};

				let cell: Element = document.create_element("td").unwrap();

				cell.set_inner_html(&format!("{}x{}", sight.x, sight.y));
				cell.set_attribute("class", &generation.to_string());
				row.append_child(&cell)?;
			}
			table.append_child(&row);
		}
	}
	Ok(())
}

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