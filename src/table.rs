use wasm_bindgen::JsValue;
use web_sys::{console, Document};
use wt_ballistics_calc_lib;
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::{generate, LaunchResults};
use wt_missile_calc_lib::missiles::{Missile, SeekerType};
use wasm_bindgen::prelude::*;

use crate::MISSILES;
use crate::util::{get_document, make_row_ir, make_row_rd};

#[wasm_bindgen]
pub fn update_tables(alt: u32, vel: u32) {
	let document = get_document();

	for missile in MISSILES.iter() {
		let parameters = LaunchParameter::new_from_parameters(false, vel as f64, 0.0, 0.0, alt);
		let results = generate(&missile, &parameters, 0.1, false);
		let cell = document.get_element_by_id(&format!("range_{}", &missile.name)).unwrap();
		cell.set_inner_html(&results.distance_flown.round().to_string());
	}
}

#[wasm_bindgen]
pub fn generate_main_tables(document: &web_sys::Document) {
	let document = get_document();

	let mut parameters = LaunchParameter::new_from_parameters(false, 343.0, 0.0, 0.0, 0);

	document.get_element_by_id("alt").unwrap().set_attribute("value", &parameters.altitude.to_string());
	document.get_element_by_id("vel").unwrap().set_attribute("value", &parameters.start_velocity.to_string());

	make_table(&parameters);
}

pub fn make_table(parameters: &LaunchParameter) -> Result<(), JsValue> {
	let document = get_document();

	let ir_table = document.query_selector(".ir_table").unwrap().unwrap();
	let rd_table = document.query_selector(".rd_table").unwrap().unwrap();

	for Missile in MISSILES.iter() {
		match &Missile.seekertype {
			SeekerType::Ir => {
				let row = document.create_element("tr")?;
				let made_row = make_row_ir(&Missile, &parameters);

				for j in 0..17 {
					let value = &made_row[j];
					let cell = document.create_element("td")?;

					if j == 0 {
						cell.set_attribute("id", &Missile.name);
						let a = document.create_element("a")?;
						a.set_attribute("href", &format!(" https://github.com/FlareFlo/wt_missile_calc/blob/master/index/missiles/{}.blkx", &Missile.name));
						a.set_inner_html(&Missile.name);
						cell.append_child(&a)?;
					} else if j == 1 {
						cell.set_attribute("id", &format!("range_{}", &Missile.name));
						cell.set_text_content(Some(&value));
					} else {
						cell.set_text_content(Some(&value));
					}

					row.append_child(&cell)?;
				}
				ir_table.append_child(&row)?;
			}
			SeekerType::Radar => {
				let row = document.create_element("tr")?;
				let made_row = make_row_rd(&Missile, &parameters);

				for j in 0..11 {
					let value = &made_row[j];
					let cell = document.create_element("td")?;

					if j == 0 {
						cell.set_attribute("id", &Missile.name);
						let a = document.create_element("a")?;
						a.set_attribute("href", &format!(" https://github.com/FlareFlo/wt_missile_calc/blob/master/index/missiles/{}.blkx", &Missile.name));
						a.set_inner_html(&Missile.name);
						cell.append_child(&a)?;
					} else if j == 1 {
						cell.set_attribute("id", &format!("range_{}", &Missile.name));
						cell.set_text_content(Some(&value));
					} else {
						cell.set_text_content(Some(&value));
					}

					row.append_child(&cell)?;
				}
				rd_table.append_child(&row)?;
			}
		}
	}
	Ok(())
}