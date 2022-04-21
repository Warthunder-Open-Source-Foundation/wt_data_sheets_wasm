use wasm_bindgen::prelude::*;
use web_sys::{Document, Element};
use wt_datamine_extractor_lib::custom_loadouts::custom_loadouts::CustomLoadout;
use crate::get_document;
use crate::LOADOUTS;

#[wasm_bindgen]
pub fn create_aircraft_dropdown() {
	let document: Document = get_document();

	let aircraft_select: Element = document.get_element_by_id("aircraft").unwrap();

	for (i, loadout) in LOADOUTS.iter().enumerate() {
		let option = document.create_element("option").unwrap();
		option.set_inner_html(loadout.localized);
		option.set_attribute("name", loadout.aircraft);
		option.set_attribute("index", &i.to_string());
		aircraft_select.append_child(&option).unwrap();
	}
}

#[wasm_bindgen]
pub fn show_aircraft_loadout(index: usize) {
	let document: Document = get_document();


	let loadouts: Element = document.get_element_by_id("loadout_screen").unwrap();
	loadouts.set_inner_html("");


	for (i, pylon) in LOADOUTS[index].pylons.iter().enumerate() {
		let tr = document.create_element("tr").unwrap();

		let index = document.create_element("td").unwrap();
		index.set_inner_html(&format!("pylon index: {i}"));
		tr.append_child(&index).unwrap();
		for weapon in pylon.weapons {
			let td = document.create_element("td").unwrap();
			td.set_inner_html(&format!("{}x {:?}", weapon.count, weapon.localized));
			tr.append_child(&td).unwrap();
		}
		loadouts.append_child(&tr).unwrap();
	}
}