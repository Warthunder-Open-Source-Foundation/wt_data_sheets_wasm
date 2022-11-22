use lazy_static::lazy_static;
use wasm_bindgen::prelude::*;
use wt_datamine_extractor_lib::shell::shells::ShellType;
use wt_datamine_extractor_lib::shell::shells::Shell;
use strum::IntoEnumIterator;
use wt_datamine_extractor_lib::shell::explosive::ExplosiveType;

use crate::util::get_document;

lazy_static! {
	pub static ref SHELLS: Vec<Shell> = {
		let json = include_str!("../wt_datamine_extractor/shell_index/all.json");
		let mut shells: Vec<Shell> = serde_json::from_str(json).unwrap();
		shells.sort_by_key(|d| d.name.clone());

		shells
	};
}

#[wasm_bindgen]
pub fn make_shell_options() -> Result<(), JsValue> {
	let document = get_document();
	for y in ShellType::iter() {
		let elem = document.create_element("option").unwrap();
		elem.set_inner_html(&y.to_string());
		document.get_element_by_id("select_ammo_type").unwrap().append_child(&elem).unwrap();
	}
	Ok(())
}

#[wasm_bindgen]
pub fn make_rows_from_shell(selected: &str) -> Result<(), JsValue> {
	let document = get_document();
	let table_body = document.get_element_by_id("tbody").unwrap();
	for shell in SHELLS.iter() {
		if selected == shell.shell_type.to_string() {
			let row = document.create_element("tr").unwrap();

			let name_cell = document.create_element("td").unwrap();
			let _name_cell_filled = name_cell.set_inner_html(&format!("{}", &shell.localized));

			let caliber_cell = document.create_element("td").unwrap();
			if &shell.caliber != &shell.true_caliber {
				let _caliber_cell_filled = caliber_cell.set_inner_html(&format!("{} ({})", &shell.caliber, &shell.true_caliber));
			} else {
				let _caliber_cell_filled = caliber_cell.set_inner_html(&shell.caliber.to_string());
			}

			let velocity_cell = document.create_element("td").unwrap();
			let _velocity_cell_filled = velocity_cell.set_inner_html(&shell.velocity.to_string());

			let penetration_cell = document.create_element("td").unwrap();
			let _penetration_cell_filled = penetration_cell.set_inner_html(&shell.penetration.first().unwrap_or(&(0, 0)).1.to_string());

			let explosive_cell = document.create_element("td").unwrap();
			let _explosive_cell_filled = explosive_cell.set_inner_html(&(match &shell.explosive {
				ExplosiveType::Inert => {
					0
				}
				ExplosiveType::Energetic(explosive) => {
					explosive.equiv_mass
				}
			}).to_string());

			row.append_child(&name_cell).unwrap();
			row.append_child(&caliber_cell).unwrap();
			row.append_child(&velocity_cell).unwrap();
			row.append_child(&penetration_cell).unwrap();
			row.append_child(&explosive_cell).unwrap();
			table_body.append_child(&row).unwrap();
		}
	}
	Ok(())
}