use wasm_bindgen::JsValue;
use web_sys::console;
use wt_ballistics_calc_lib;
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::{generate, LaunchResults};
use wt_missile_calc_lib::missiles::{Missile, SeekerType};
use crate::MISSILES;

pub fn make_table(parameters: &LaunchParameter) -> Result<(), JsValue> {
	let window = web_sys::window().expect("no global `window` exists");
	let document = window.document().expect("should have a document on window");

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
					} else if j ==1 {
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
					} else if j ==1 {
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

fn make_row_ir(m: &Missile, parameters: &LaunchParameter) -> [String; 17] {
	// let parameters = LaunchParameter::new_from_parameters(false, 343.0, 0.0, 0.0, 0);

	let results = generate(&m, &parameters, 0.1, false);

	let range = results.distance_flown.round();

	[
		m.name.to_string(),
		range.to_string(),
		m.endspeed.to_string(),
		m.deltav.to_string(),
		m.loadfactormax.to_string(),
		m.reqaccelmax.to_string(),
		m.bands[0].to_string(),
		m.bands[1].to_string(),
		m.bands[2].to_string(),
		m.bands[3].to_string(),
		m.fov.to_string(),
		m.gate.to_string(),
		m.lockanglemax.to_string(),
		m.anglemax.to_string(),
		m.warmuptime.to_string(),
		m.worktime.to_string(),
		m.cageable.to_string(),
	]
}

fn make_row_rd(m: &Missile, parameters: &LaunchParameter) -> [String; 11] {
	// let parameters = LaunchParameter::new_from_parameters(false, 343.0, 0.0, 0.0, 0);

	let results = generate(&m, &parameters, 0.1, false);

	let range = results.distance_flown.round();
	[
		m.name.to_string(),
		range.to_string(),
		m.endspeed.to_string(),
		m.deltav.to_string(),
		m.loadfactormax.to_string(),
		m.reqaccelmax.to_string(),
		m.lockanglemax.to_string(),
		m.anglemax.to_string(),
		m.warmuptime.to_string(),
		m.worktime.to_string(),
		m.cageable.to_string(),
	]
}