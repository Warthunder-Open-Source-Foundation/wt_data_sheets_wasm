use wasm_bindgen::prelude::*;
use crate::get_document;
use crate::BOMBS;
use crate::console_log;

#[wasm_bindgen]
pub fn render_bombs() {
	let document = get_document();
	let table = document.get_element_by_id("tbody").unwrap();

	let mut local_sorted = BOMBS.clone();
	local_sorted.sort_by_key(|bomb|bomb.explosive_mass.round() as u32);
	local_sorted.reverse();

	for bomb in local_sorted.iter() {
		// Filters out nukes and other outliers
		if bomb.explosive_equiv <= 1.0 {
			continue
		}

		let row = document.create_element("tr").unwrap();

		let new_field = |content: String| {
			let item = document.create_element("td").unwrap();
			item.set_inner_html(&content);
			row.append_child(&item);
		};

		new_field(bomb.name.clone());
		new_field(bomb.explosive_type.clone());
		new_field(bomb.explosive_mass.to_string());
		new_field(bomb.explosive_equiv.to_string());
		new_field(bomb.weight.to_string());
		new_field(format!("{:.2}", &bomb.explosive_equiv / &bomb.weight));

		table.append_child(&row);
	}
}