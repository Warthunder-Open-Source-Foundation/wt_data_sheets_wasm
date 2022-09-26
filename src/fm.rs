use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use crate::{console_log, get_document};
use std::sync::Arc;
use std::sync::Mutex;
use std::time::{Duration, SystemTime};
use crate::utils::direct_average::Average;
use crate::utils::long_average::LongAverage;
use crate::utils::format_duration::format_duration;

lazy_static! {
    static ref APP_STATE: Mutex<AppState> = Mutex::new(AppState::new());
}

#[derive(Debug, Clone)]
pub struct AppState {
	last_fuel: f64,
	avg_fuel: LongAverage<f64>,
	avg_efficiency: LongAverage<f64>,
	avg_thrust: LongAverage<f64>,
}

impl AppState {
	pub fn new() -> Self {
		Self {
			last_fuel: 0.0,
			avg_fuel: LongAverage::new(),
			avg_efficiency: LongAverage::new(),
			avg_thrust:LongAverage::new(),
		}
	}
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Indicators {
	#[serde(alias = "fuel")]
	fuel_mass: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct State {
	#[serde(alias = "Mfuel0, kg")]
	total_fuel: f64,
	#[serde(alias = "thrust 1, kgs")]
	thrust_0: f64,
	#[serde(alias = "thrust 2, kgs")]
	thrust_1: Option<f64>,
	#[serde(alias = "throttle 1, %")]
	throttle: u64,
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
	app_state.avg_fuel.push(fuel_now - indicators.fuel_mass);
	app_state.last_fuel = indicators.fuel_mass;
	let avg_fuel = app_state.avg_fuel.take_avg(5).abs();

	let mut total_thrust = state.thrust_0;
	if let Some(thrust_1) = state.thrust_1 {
		total_thrust += thrust_1;
	}
	app_state.avg_thrust.push(total_thrust);

	let fuel_efficiency = app_state.avg_thrust.take_avg(5) / avg_fuel;

	// console_log(&format!("{} kN/kg", app_state.avg_efficiency.get_avg()));

	let doc = get_document();
	doc.get_element_by_id("fuel_efficiency").unwrap().set_inner_html(&format!("Fuel efficiency: {} kN\\kg", fuel_efficiency.floor()));
	doc.get_element_by_id("avg_fuel").unwrap().set_inner_html(&format!("Fuel average usage: {:.3} kg\\s", avg_fuel));
	doc.get_element_by_id("thrust").unwrap().set_inner_html(&format!("Thrust: {} kN", total_thrust));
	doc.get_element_by_id("fuel_percent").unwrap().set_inner_html(&format!("Fuel: {:.2} % ({:.1} kg)", ((indicators.fuel_mass / state.total_fuel) * 100.0), indicators.fuel_mass));
	doc.get_element_by_id("fuel_ttb").unwrap().set_inner_html(&format!("Time to bingo: {:?}", format_duration((indicators.fuel_mass / app_state.avg_fuel.take_avg(10).abs()).round() as u64)));
	doc.get_element_by_id("throttle").unwrap().set_inner_html(&format!("Throttle: {} %", state.throttle));
}