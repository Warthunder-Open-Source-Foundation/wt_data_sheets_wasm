


use wasm_bindgen::prelude::*;
use web_sys::{Element};


use crate::{THERMALS};
use crate::util::{get_document};

#[wasm_bindgen]
pub fn generate_tank_list() -> Result<(), JsValue> {
	let document = get_document();

	let table = document.get_element_by_id("table_contents").unwrap();
	document.get_element_by_id("column_1").unwrap().set_inner_html("Gunner/Scope");
	document.get_element_by_id("column_2").unwrap().set_inner_html("Commander");

	let mut i = 0;
	for thermal in THERMALS.iter().enumerate() {
		let row = document.create_element("tr").unwrap();
		row.set_attribute("id", &thermal.1.name).unwrap();
		row.set_attribute("class", &format!("{} {:?}", &i, &thermal.1.vehicle_type)).unwrap();

		let name = document.create_element("td").unwrap();

		// Amends pre-name national tags
		name.set_inner_html(&thermal.1.localized);

		row.append_child(&name)?;

		for sight in &thermal.1.sights {
			let generation = match sight.x.round() as u32 {
				500 => {
					"one"
				}
				800 => {
					"two"
				}
				1200 => {
					"three"
				}
				1024 => {
					"heli"
				}
				_ => {
					"unknown"
				}
			};

			let cell: Element = document.create_element("td").unwrap();

			cell.set_inner_html(&format!("{}x{}", sight.x, sight.y));
			cell.set_attribute("class", &generation.to_string())?;
			row.append_child(&cell)?;
		}
		table.append_child(&row)?;
		i += 1;
	}
	Ok(())
}

#[wasm_bindgen]
pub fn generate_thermal_options() -> Result<(), JsValue> {
	let document = get_document();

	let ul = document.get_element_by_id("ul_input").unwrap();

	let elem = document.create_element("li")?;
	elem.set_attribute("class", "selecto_0")?;
	elem.set_attribute("value", "0")?;
	elem.set_attribute("id", "Tank")?;
	elem.set_inner_html("Tank");
	ul.append_child(&elem)?;

	let elem = document.create_element("li")?;
	elem.set_attribute("class", "selecto_0")?;
	elem.set_attribute("value", "1")?;
	elem.set_attribute("id", "Helicopter")?;
	elem.set_inner_html("Helicopter");
	ul.append_child(&elem).unwrap();

	let elem = document.create_element("li")?;
	elem.set_attribute("class", "selecto_0")?;
	elem.set_attribute("value", "2")?;
	elem.set_attribute("id", "Aircraft")?;
	elem.set_inner_html("Aircraft");
	ul.append_child(&elem)?;

	Ok(())
}