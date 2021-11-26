use wasm_bindgen::JsValue;
use wt_ballistics_calc_lib;
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::{generate};
use wasm_bindgen::prelude::*;
use wt_datamine_extractor_lib::missile::missile::SeekerType;

use crate::util::{get_document, make_row_ir, make_row_rd};
use crate::MISSILES;

#[wasm_bindgen]
#[allow(clippy::missing_panics_doc)]
pub fn update_tables(alt: u32, vel: u32) {
	let document = get_document();

	for missile in MISSILES.iter() {
		let parameters = LaunchParameter::new_from_parameters(false, f64::from(vel), 0.0, 0.0, alt);
		let results = generate(missile, &parameters, 0.1, false);
		let cell = document.get_element_by_id(&format!("range_{}", &missile.name)).unwrap();
		cell.set_inner_html(&results.distance_flown.round().to_string());
	}
}

#[wasm_bindgen]
#[allow(clippy::missing_errors_doc, clippy::missing_panics_doc)]
pub fn generate_main_tables() -> Result<(), JsValue> {
	let document = get_document();

	let parameters = LaunchParameter::new_from_parameters(false, 343.0, 0.0, 0.0, 0);

	document.get_element_by_id("alt").unwrap().set_attribute("value", &parameters.altitude.to_string())?;
	document.get_element_by_id("vel").unwrap().set_attribute("value", &parameters.start_velocity.to_string())?;

	make_table(&parameters)
}

#[allow(clippy::module_name_repetitions, clippy::missing_errors_doc, clippy::missing_panics_doc)]
pub fn make_table(parameters: &LaunchParameter) -> Result<(), JsValue> {
	let document = get_document();

	let ir_table = document.query_selector(".ir_table").unwrap().unwrap();
	let rd_table = document.query_selector(".rd_table").unwrap().unwrap();

	for missile in MISSILES.iter() {
		match &missile.seekertype {
			SeekerType::Ir => {
				let row = document.create_element("tr")?;
				let made_row = make_row_ir(missile, parameters);

				for (j, _) in made_row.iter().enumerate() {
					let value = &made_row[j];
					let cell = document.create_element("td")?;

					if j == 0 {
						cell.set_attribute("id", &missile.name)?;
						let a = document.create_element("a")?;
						a.set_attribute("href", &format!("https://github.com/FlareFlo/wt_datamine_extractor/blob/master/missile_index/missiles/{}.blkx", &missile.name))?;
						a.set_inner_html(&missile.name);
						cell.append_child(&a)?;
					} else if j == 1 {
						cell.set_attribute("id", &format!("range_{}", &missile.name))?;
						cell.set_text_content(Some(value));
					} else {
						cell.set_text_content(Some(value));
					}

					row.append_child(&cell)?;
				}
				ir_table.append_child(&row)?;
			}
			SeekerType::Radar => {
				let row = document.create_element("tr")?;
				let made_row = make_row_rd(missile, parameters);

				for (j, item) in made_row.iter().enumerate() {
					let value = &item;
					let cell = document.create_element("td")?;

					if j == 0 {
						cell.set_attribute("id", &missile.name)?;
						let a = document.create_element("a")?;
						a.set_attribute("href", &format!(" https://github.com/FlareFlo/wt_missile_calc/blob/master/index/missiles/{}.blkx", &missile.name))?;
						a.set_inner_html(&missile.name);
						let _res = cell.append_child(&a)?;
					} else if j == 1 {
						cell.set_attribute("id", &format!("range_{}", &missile.name))?;
						cell.set_text_content(Some(value));
					} else {
						cell.set_text_content(Some(value));
					}

					row.append_child(&cell)?;
				}
				rd_table.append_child(&row)?;
			}
		}
	}
	Ok(())
}