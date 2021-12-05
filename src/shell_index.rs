use wasm_bindgen::prelude::*;
use web_sys::{Document, Element, Node};
use crate::SHELLS;
use crate::util::{console_log, get_document};
use strum::IntoEnumIterator;

use wt_datamine_extractor_lib::shell::shells::ShellType;

#[wasm_bindgen]
pub fn make_shell_options() -> Result<(), JsValue> {
	let document = get_document();
	for y in ShellType::iter() {
		let elem = document.create_element("option").unwrap();
		elem.set_inner_html(&y.to_string());
		document.get_element_by_id("select_ammo_type").unwrap().append_child(&elem);
	}
	Ok(())
}

#[wasm_bindgen]
pub fn make_rows_from_shell(selected: &str) -> Result<(), JsValue> {
	let document = get_document();
	let table_body = document.get_element_by_id("tbody").unwrap();
	for SHELL in SHELLS.iter() {
		if selected == SHELL.shell_type.to_string() {
			let row = document.create_element("tr").unwrap();

			let name_cell = document.create_element("td").unwrap();
			let name_cell_filled = name_cell.set_inner_html(&format!("{} ({})", &SHELL.localized, &SHELL.parent_gun_localized));

			let caliber_cell = document.create_element("td").unwrap();
			let caliber_cell_filled = caliber_cell.set_inner_html(&SHELL.caliber.to_string());

			let penetration_cell = document.create_element("td").unwrap();
			let penetration_cell_filled = penetration_cell.set_inner_html(&SHELL.penetration.first().unwrap_or(&(0,0)).1.to_string());

			let explosive_cell = document.create_element("td").unwrap();
			let explosive_cell_filled = explosive_cell.set_inner_html(&SHELL.explosive.1.to_string());

			row.append_child(&name_cell);
			row.append_child(&caliber_cell);
			row.append_child(&penetration_cell);
			row.append_child(&explosive_cell);
			table_body.append_child(&row);
		}

	}
	Ok(())
}