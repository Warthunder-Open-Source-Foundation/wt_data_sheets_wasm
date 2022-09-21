use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use crate::{console_log, get_document};
use std::sync::Arc;
use std::sync::Mutex;
use crate::utils::avg_struct::Average;

lazy_static! {
    static ref APP_STATE: Mutex<AppState> = Mutex::new(AppState::new());
}

#[derive(Debug, Clone)]
pub struct AppState {
	last_fuel: f64,
	avg_fuel: Average<f64>,
	avg_efficiency: Average<f64>,
}

impl AppState {
	pub fn new() -> Self {
		Self {
			last_fuel: 0.0,
			avg_fuel: Average::new(10),
			avg_efficiency: Average::new(10)
		}
	}
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Indicators {

}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct State {
	#[serde(alias = "Mfuel, kg")]
	fuel_mass: f64,
	#[serde(alias = "thrust 1, kgs")]
	thrust_0: f64,
	#[serde(alias = "thrust 2, kgs")]
	thrust_1: Option<f64>,
}

#[wasm_bindgen]
pub fn core_loop(indicators: &str, state: &str, timeout: usize) {
	let mut app_state = APP_STATE.lock().unwrap();
	// Gates validity of passed data
	if !indicators.contains(r#""valid":true,"#) || !state.contains(r#""valid":true,"#) {
		console_log("Data is invalid");
		console_log(&(indicators.to_owned() + state));
		return;
	}

	let indicators: Indicators = serde_json::from_str(indicators).unwrap();
	let state: State = serde_json::from_str(state).unwrap();

	// Compute avg fuel
	let fuel_now = app_state.last_fuel;
	app_state.avg_fuel.insert(fuel_now - state.fuel_mass);
	app_state.last_fuel = state.fuel_mass;
	let avg_fuel = app_state.avg_fuel.get_avg().abs();

	let mut total_thrust = state.thrust_0;
	if let Some(thrust_1) = state.thrust_1 {
		total_thrust += total_thrust;
	}

	app_state.avg_efficiency.insert(total_thrust / avg_fuel);

	// console_log(&format!("{} kN/kg", app_state.avg_efficiency.get_avg()));

	let doc = get_document();
	doc.get_element_by_id("fuel_efficiency").unwrap().set_inner_html(&app_state.avg_efficiency.get_avg().floor().to_string());
	// console_log(&format!("{} {}", total_thrust, avg_fuel));
}