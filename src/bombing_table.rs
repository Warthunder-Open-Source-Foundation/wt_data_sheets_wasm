use wasm_bindgen::prelude::*;
use crate::get_document;
use crate::BOMBS;
use crate::console_log;

#[wasm_bindgen]
pub fn render_bombs() {
	let document = get_document();
	let table = document.get_element_by_id("tbody").unwrap();

	for bomb in BOMBS.iter() {
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


		table.append_child(&row);
	}
}