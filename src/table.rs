use wasm_bindgen::JsValue;
use wt_missile_calc_lib::missiles::{Missile, SeekerType};
use wt_ballistics_calc_lib;
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::{generate, LaunchResults};

static STATIC_MISSILES: &str =  include_str!("../../wt_missile_calc/index/all.json");

pub fn make_table(parameters: &LaunchParameter) -> Result<(), JsValue> {
	let window = web_sys::window().expect("no global `window` exists");
	let document = window.document().expect("should have a document on window");
	let body = document.body().expect("document should have a body");

	let mut missiles: Vec<Missile> = serde_json::from_str(STATIC_MISSILES).unwrap();

	missiles.sort_by_key(|d| d.name.clone());

	let ir_table = document.query_selector(".ir_table").unwrap().unwrap();
	let rd_table = document.query_selector(".rd_table").unwrap().unwrap();

	let mut ir = 0;
	let mut rd = 0;

	for (i, Missile) in missiles.iter().enumerate() {
		match &Missile.seekertype {
			SeekerType::Ir => {
				let row = document.create_element("tr")?;
				let made_row = make_row_ir(&Missile, &parameters);

				if ir % 2 == 0 {
					row.set_attribute("class", "bright-tr");
				} else {
					row.set_attribute("class", "dark-tr");
				}
				ir += 1;

				for j in 0..17 {
					let value = &made_row[j];
					let cell = document.create_element("td")?;
					cell.set_text_content(Some(&value));


					// if let Ok(results) = value.parse::<f64>() {
					// 	if results == 0.0 {
					// 		cell.set_attribute("bgcolor", "#ff0000");
					// 	}
					// }


					row.append_child(&cell)?;
				}
				ir_table.append_child(&row)?;
			},
			SeekerType::Radar => {
				let row = document.create_element("tr")?;
				let made_row = make_row_rd(&Missile, &parameters);

				if rd % 2 == 0 {
					row.set_attribute("class", "bright-tr");
				} else {
					row.set_attribute("class", "dark-tr");
				}
				rd += 1;

				for j in 0..13 {
					let value = &made_row[j];
					let cell = document.create_element("td")?;
					cell.set_text_content(Some(&value));


					// if let Ok(results) = value.parse::<f64>() {
					// 	if results == 0.0 {
					// 		cell.set_attribute("bgcolor", "#ff0000");
					// 	}
					// }


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
		m.name.split("/").collect::<Vec<&str>>()[3].split(".").collect::<Vec<&str>>()[0].to_string(),
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

fn make_row_rd(m: &Missile, parameters: &LaunchParameter) -> [String; 13] {
	// let parameters = LaunchParameter::new_from_parameters(false, 343.0, 0.0, 0.0, 0);

	let results = generate(&m, &parameters, 0.1, false);

	let range = results.distance_flown.round();
	[
		m.name.split("/").collect::<Vec<&str>>()[3].split(".").collect::<Vec<&str>>()[0].to_string(),
		range.to_string(),
		m.endspeed.to_string(),
		m.deltav.to_string(),
		m.loadfactormax.to_string(),
		m.reqaccelmax.to_string(),
		m.fov.to_string(),
		m.gate.to_string(),
		m.lockanglemax.to_string(),
		m.anglemax.to_string(),
		m.warmuptime.to_string(),
		m.worktime.to_string(),
		m.cageable.to_string(),
	]
}