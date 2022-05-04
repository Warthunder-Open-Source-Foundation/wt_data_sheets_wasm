use lazy_static::lazy_static;
use wasm_bindgen::prelude::*;
use web_sys::{Document, Element};
use wt_datamine_extractor_lib::custom_loadouts::custom_loadouts::{CustomLoadout};
use wt_datamine_extractor_lib::custom_loadouts::loadout_compose::CLComposition;
use crate::{console_log, get_document};

lazy_static! {
    static ref LOADOUTS: Vec<CustomLoadout> = {
       let json = include_str!("../wt_datamine_extractor/custom_loadouts/all.json");
		let mut shells: Vec<CustomLoadout> = serde_json::from_str(json).unwrap();
		shells.sort_by_key(|d| d.aircraft.clone());

		shells
    };
}

#[wasm_bindgen]
pub fn create_aircraft_dropdown() {
	let document: Document = get_document();

	let aircraft_select: Element = document.get_element_by_id("aircraft").unwrap();

	for (i, loadout) in LOADOUTS.iter().enumerate() {
		let option = document.create_element("option").unwrap();
		option.set_inner_html(&loadout.localized);
		option.set_attribute("name", &loadout.aircraft).unwrap();
		option.set_attribute("index", &i.to_string()).unwrap();
		aircraft_select.append_child(&option).unwrap();
	}
}

#[wasm_bindgen]
pub fn output_selection(mut selection: Vec<usize>, index: usize) {
	let aircraft: &CustomLoadout = &LOADOUTS[index];
	let document = get_document();

	while selection.len() <= aircraft.pylons.len() {
		selection.push(0);
	}

	let div = document.get_element_by_id("cl_result").unwrap();
	match aircraft.compose_loadout(&selection) {
		Ok(cl) => {
			div.set_inner_html(&format!("<pre>Result checks out! \nExtra data: {:#?}</pre>", cl));
		},
		Err(err) => {
			div.set_inner_html(&format!("<pre>Bad result \nError (s): {:#?}</pre>", err));
		}
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

	// let compose = aircraft.compose_loadout(&[0]).unwrap();

	for i in &aircraft.pylons {
		let len = i.weapons.len();
		if y_len < len {
			y_len = len;
		}
	}
	y_len += 1;

	document.get_element_by_id("fm_max_load").unwrap().set_inner_html(&aircraft.max_load.to_string());
	document.get_element_by_id("fm_max_imbalance").unwrap().set_inner_html(&aircraft.max_imbalance.to_string());
	document.get_element_by_id("fm_max_wing_load").unwrap().set_inner_html(&format!("{}|{}", &aircraft.max_wing_load.0, &aircraft.max_wing_load.1));


	for (i, pylon) in aircraft.pylons.iter().enumerate() {
		let tc = document.create_element("tr").unwrap();

		let index = document.create_element("td").unwrap();
		let header = if pylon.exempt_from_imbalance {
			format!("E: {i}")
		} else {
			format!("I: {i}")
		};
		index.set_attribute("class", "weapon_header").unwrap();
		index.set_inner_html(&header);
		tc.append_child(&index).unwrap();
		for j in 0..y_len {

			// Abort loop early as gun slot should not have an empty option
			if j == 0 && pylon.order.is_none() {
				continue
			}

			let make_doc = || {
				let td = document.create_element("td").unwrap();

				if let Some(weapon) = pylon.weapons.get(j - 1 as usize) {
					td.set_attribute("id", &format!("{i}_{j}")).unwrap();
					td.set_attribute("class", "weapon_container selectable").unwrap();

					let img: Element = document.create_element("img").unwrap();
					if !weapon.icon_type.is_empty() {
						let url = format!("{}{}.png", &BASE_URL, weapon.icon_type);
						img.set_attribute("src", &url).unwrap();
					}
					img.set_attribute("class", "icon_type").unwrap();
					img.set_attribute("title", &format!("{}x {}\n Weight: {:.1}kg", weapon.count, weapon.localized, weapon.total_mass)).unwrap();
					td.append_child(&img).unwrap();
				} else {
					let img: Element = document.create_element("div").unwrap();
					if j == 0 {
						img.set_inner_html("EMPTY");
						td.set_attribute("id", &format!("{i}_0")).unwrap();
						td.set_attribute("class", "weapon_container selectable selected").unwrap();
					} else {
						td.set_attribute("class", "weapon_container").unwrap();
					}
					img.set_attribute("class", "icon_type empty_choice").unwrap();
					img.set_attribute("title", "Empty slot").unwrap();
					td.append_child(&img).unwrap();
				}
				tc.append_child(&td).unwrap();

				if let Some(elem) = document.get_element_by_id("0_1") {
					elem.set_attribute("class", "weapon_container selectable selected").unwrap();
				};
			};

			if j == y_len - 1 && pylon.order.is_none() {
				make_doc();
			}

			make_doc();
		}
		loadouts.append_child(&tc).unwrap();
	}
}