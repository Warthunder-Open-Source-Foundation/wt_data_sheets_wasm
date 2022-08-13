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
		let row = document.create_element("tr").unwrap();

		let name = document.create_element("td").unwrap();
		name.set_inner_html(&bomb.name);
		row.append_child(&name);

		let explosive = document.create_element("td").unwrap();
		explosive.set_inner_html(&bomb.explosive_type);
		row.append_child(&explosive);

		let explosive_mass = document.create_element("td").unwrap();
		explosive_mass.set_inner_html(&bomb.explosive_mass.to_string());
		row.append_child(&explosive_mass);

		let tnt_explosive_mass = document.create_element("td").unwrap();
		tnt_explosive_mass.set_inner_html(&bomb.explosive_equiv.to_string());
		row.append_child(&tnt_explosive_mass);

		let mass = document.create_element("td").unwrap();
		mass.set_inner_html(&bomb.weight.to_string());
		row.append_child(&mass);

		table.append_child(&row);
	}
}