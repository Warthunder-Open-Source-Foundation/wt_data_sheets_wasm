use wasm_bindgen::prelude::*;
use web_sys::{Document, Element};
use wt_datamine_extractor_lib::custom_loadouts::custom_loadouts::{CustomLoadout, Pylon};
use crate::get_document;
use crate::LOADOUTS;

#[wasm_bindgen]
pub fn create_aircraft_dropdown() {
	let document: Document = get_document();

	let aircraft_select: Element = document.get_element_by_id("aircraft").unwrap();

	for (i, loadout) in LOADOUTS.iter().enumerate() {
		let option = document.create_element("option").unwrap();
		option.set_inner_html(loadout.localized);
		option.set_attribute("name", loadout.aircraft).unwrap();
		option.set_attribute("index", &i.to_string()).unwrap();
		aircraft_select.append_child(&option).unwrap();
	}
}

#[wasm_bindgen]
pub fn show_aircraft_loadout(index: usize) {
	let document: Document = get_document();
	static BASE_URL: &str = "https://raw.githubusercontent.com/gszabi99/War-Thunder-Datamine/master/atlases.vromfs.bin_u/gameuiskin/";


	let loadouts: Element = document.get_element_by_id("loadout_screen").unwrap();
	loadouts.set_inner_html("");

	let mut y_len = 0;

	let aircraft = &LOADOUTS[index];

	for i in aircraft.pylons {
		let len = i.weapons.len();
		if y_len < len {
			y_len = len;
		}
	}

	document.get_element_by_id("fm_max_load").unwrap().set_inner_html(&aircraft.max_load.to_string());
	document.get_element_by_id("fm_max_imbalance").unwrap().set_inner_html(&aircraft.max_imbalance.to_string());
	document.get_element_by_id("fm_max_wing_load").unwrap().set_inner_html(&format!("{}|{}", &aircraft.max_wing_load.0,  &aircraft.max_wing_load.1));


	for (i, pylon) in aircraft.pylons.iter().enumerate() {
		let tc = document.create_element("tr").unwrap();

		let index = document.create_element("td").unwrap();
		let header = if pylon.exempt_from_imbalance {
			format!("Index: {i} (E)")
		} else {
			format!("Index: {i}")
		};
		index.set_inner_html(&header);
		tc.append_child(&index).unwrap();
		for j in 0..y_len {
			let td = document.create_element("td").unwrap();
			td.set_attribute("class", "weapon_container").unwrap();

			if let Some(weapon) = pylon.weapons.get(j as usize) {
				td.set_attribute("id", &format!("{i}_{j}")).unwrap();

				let img: Element = document.create_element("img").unwrap();
				let final_url = if !weapon.icon_type.is_empty() {
					format!("{}{}.png",&BASE_URL, weapon.icon_type)
				} else {
					"/img/empty_loadout.png".to_owned()
				};
				img.set_attribute("src", &final_url).unwrap();
				img.set_attribute("class", "icon_type").unwrap();
				img.set_attribute("title",&format!("{}x {}\n Weight: {:.1}kg", weapon.count, weapon.localized, weapon.total_mass)).unwrap();
				td.append_child(&img).unwrap();


				// td.set_inner_html(&format!("{}x {}", weapon.count, weapon.localized));
			} else {
				let img: Element = document.create_element("img").unwrap();
				img.set_attribute("src", "/img/empty_loadout.png").unwrap();
				img.set_attribute("class", "icon_type").unwrap();
				img.set_attribute("title", "Empty slot").unwrap();
				td.append_child(&img).unwrap();
			}
			tc.append_child(&td).unwrap();
		}
		loadouts.append_child(&tc).unwrap();
	}
}