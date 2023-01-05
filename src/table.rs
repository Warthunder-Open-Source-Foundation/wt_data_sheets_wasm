use std::str::FromStr;
use bevy_reflect::Reflect;

use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::*;
use web_sys::Element;
use wt_ballistics_calc_lib;
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::generate;
use wt_datamine_extractor_lib::missile::missile::SeekerType;
use crate::{MISSILES};

use crate::util::get_document;

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

	let parameters = LaunchParameter::new_from_parameters(false, 343.0, 0.0, 0.0, 1000);

	document.get_element_by_id("alt").unwrap().set_attribute("value", &parameters.altitude.to_string())?;
	document.get_element_by_id("vel").unwrap().set_attribute("value", &parameters.start_velocity.to_string())?;

	make_table(&parameters)
}

#[allow(clippy::module_name_repetitions, clippy::missing_errors_doc, clippy::missing_panics_doc)]
pub fn make_table(parameters: &LaunchParameter) -> Result<(), JsValue> {
	let document = get_document();

	let ir_table = document.query_selector(".main_table").unwrap().unwrap();
	let sarh_table = document.query_selector(".sarh_table").unwrap().unwrap();
	let arh_table = document.query_selector(".arh_table").unwrap().unwrap();

	for missile in MISSILES.iter() {
		// Hide useless duplicates
		// Missiles with the default keyword are the stock-counterparts to
		if missile.name.contains("default") {
			continue;
		}
		match &missile.seekertype {
			SeekerType::Ir => {
				let ir_missile = IrTable::from_missile(missile, parameters);
				ir_table.append_child(&ir_missile.to_html_row(missile, parameters)).unwrap();
			}
			SeekerType::Sarh => {
				let sarh_missiles = SarhTable::from_missile(missile, parameters);
				sarh_table.append_child(&sarh_missiles.to_html_row(missile, parameters)).unwrap();
			}
			SeekerType::Arh => {
				let arh_missiles = ArhTable::from_missile(missile, parameters);
				arh_table.append_child(&arh_missiles.to_html_row(missile, parameters)).unwrap();
			}
		}
	}
	Ok(())
}

// As represented in the HTML
#[derive(Reflect)]
pub struct IrTable {
	pub name: String,
	pub range: f64,
	pub twr: f64,
	pub max_speed: f64,
	pub delta_v: f64,
	pub launch_g: f64,
	pub flight_g: f64,
	pub rear_aspect: f64,
	pub all_aspect: f64,
	pub ir_decoys: f64,
	pub ircm: f64,
	pub fov: f64,
	pub gate: f64,
	pub launch_fov: f64,
	pub flight_fov: f64,
	pub warm_up_time: f64,
	pub work_time: f64,
	pub time_out: f64,
	pub uncage: bool,
	pub allow_radar_slave: bool,
}

impl IrTable {
	pub fn from_missile(m: &wt_datamine_extractor_lib::missile::missile::Missile, parameters: &LaunchParameter) -> Self {
		let results = generate(m, parameters, 0.1, false);

		let range = f64::from_str(&format!("{:.1}", results.distance_flown)).unwrap();
		Self {
			name: m.name.to_owned(),
			range,
			twr: f64::from_str(&format!("{:.1}", (m.force0 / 9.807) / m.mass)).unwrap(),
			max_speed: m.endspeed,
			delta_v: m.deltav,
			launch_g: m.loadfactormax,
			flight_g: m.reqaccelmax,
			rear_aspect: m.bands[0],
			all_aspect: m.bands[1],
			ir_decoys: m.bands[2],
			ircm: m.bands[3],
			fov: m.fov,
			gate: m.gate,
			launch_fov: m.lockanglemax,
			flight_fov: m.anglemax,
			warm_up_time: m.warmuptime,
			work_time: m.worktime,
			time_out: m.timeout,
			uncage: m.cageable,
			allow_radar_slave: m.allow_radar_slave
		}
	}
}

impl ToHtmlTable for IrTable {}

// As represented in the HTML
#[derive(Reflect)]
pub struct SarhTable {
	pub name: String,
	pub range: f64,
	pub twr: f64,
	pub max_speed: f64,
	pub delta_v: f64,
	pub launch_g: f64,
	pub flight_g: f64,
	pub launch_fov: f64,
	pub flight_fov: f64,
	pub warm_up_time: f64,
	pub work_time: f64,
	pub uncage: bool,
}

impl SarhTable {
	pub fn from_missile(m: &wt_datamine_extractor_lib::missile::missile::Missile, parameters: &LaunchParameter) -> Self {
		let results = generate(m, parameters, 0.1, false);

		let range = f64::from_str(&format!("{:.1}", results.distance_flown)).unwrap();
		Self {
			name: m.name.to_owned(),
			range,
			twr: f64::from_str(&format!("{:.1}", (m.force0 / 9.807) / m.mass)).unwrap(),
			max_speed: m.endspeed,
			delta_v: m.deltav,
			launch_g: m.loadfactormax,
			flight_g: m.reqaccelmax,
			launch_fov: m.lockanglemax,
			flight_fov: m.anglemax,
			warm_up_time: m.warmuptime,
			work_time: m.worktime,
			uncage: m.cageable,
		}
	}
}

impl ToHtmlTable for SarhTable {}

// As represented in the HTML
#[derive(Reflect)]
pub struct ArhTable {
	pub name: String,
	pub range: f64,
	pub twr: f64,
	pub max_speed: f64,
	pub delta_v: f64,
	pub launch_g: f64,
	pub flight_g: f64,
	pub launch_fov: f64,
	pub flight_fov: f64,
	pub warm_up_time: f64,
	pub work_time: f64,
	pub uncage: bool,
}

impl ArhTable {
	pub fn from_missile(m: &wt_datamine_extractor_lib::missile::missile::Missile, parameters: &LaunchParameter) -> Self {
		let results = generate(m, parameters, 0.1, false);

		let range = f64::from_str(&format!("{:.1}", results.distance_flown)).unwrap();
		Self {
			name: m.name.to_owned(),
			range,
			twr: f64::from_str(&format!("{:.1}", (m.force0 / 9.807) / m.mass)).unwrap(),
			max_speed: m.endspeed,
			delta_v: m.deltav,
			launch_g: m.loadfactormax,
			flight_g: m.reqaccelmax,
			launch_fov: m.lockanglemax,
			flight_fov: m.anglemax,
			warm_up_time: m.warmuptime,
			work_time: m.worktime,
			uncage: m.cageable,
		}
	}
}

impl ToHtmlTable for ArhTable {}

pub trait ToHtmlTable: bevy_reflect::Struct {
	fn to_html_row(self, missile: &wt_datamine_extractor_lib::missile::missile::Missile, parameters: &LaunchParameter) -> Element where Self: Sized {
		let document = get_document();

		let row = document.create_element("tr").unwrap();

		for i in self.iter_fields().enumerate() {
			let cell = document.create_element("td").unwrap();
			match i.0 {
				0 => {
					cell.set_attribute("id", &missile.name).unwrap();
					let a = document.create_element("a").unwrap();
					a.set_attribute("href", &format!("https://github.com/FlareFlo/wt_datamine_extractor/blob/master/missile_index/missiles/{}.blkx", &missile.name)).unwrap();
					a.set_inner_html(&missile.localized);
					cell.append_child(&a).unwrap();
				}
				1 => {
					let results = generate(missile, parameters, 0.1, false);

					let range = results.distance_flown.round().to_string();

					cell.set_attribute("id", &format!("range_{}", &missile.name)).unwrap();
					cell.set_text_content(Some(&range.to_string()));
				}
				_ => {
					if let Some(value) = i.1.downcast_ref::<f64>() {
						if *value == 0.0 {
							cell.set_text_content(Some(&"-"));
						} else if value.trunc() == 0.0 {
							cell.set_text_content(Some(&format!("{:.1}", value)));
						} else {
							cell.set_text_content(Some(&value.to_string()));
						}
					}
					if let Some(value) = i.1.downcast_ref::<bool>() {
						cell.set_text_content(Some(&value.to_string()));
					}
					if let Some(value) = i.1.downcast_ref::<String>() {
						cell.set_text_content(Some(&value));
					}
				}
			}
			row.append_child(&cell).unwrap();
		}
		row
	}
}