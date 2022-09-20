use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use crate::console_log;
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
}

impl AppState {
	pub fn new() -> Self {
		Self {
			last_fuel: 0.0,
			avg_fuel: Average::new(5)
		}
	}
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Indicators {

}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct State {
	#[serde(alias = "Mfuel, kg")]
	fuel_mass: f64
}

#[wasm_bindgen]
pub fn core_loop(indicators: &str, state: &str) {
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
	let last_fuel = app_state.last_fuel;
	app_state.avg_fuel.insert(last_fuel - state.fuel_mass);
	app_state.last_fuel = state.fuel_mass;

	console_log(&app_state.avg_fuel.get_avg().to_string());
}