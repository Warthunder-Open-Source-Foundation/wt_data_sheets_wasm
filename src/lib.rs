use std::f64;
use std::str::FromStr;

use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;
use web_sys::{console, Document, Window, window};
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::{generate, LaunchResults, Splash};
use wt_missile_calc_lib::missiles::Missile;

use lazy_static::lazy_static;

use crate::table::make_table;

mod table;

lazy_static! {
	static ref MISSILES: Vec<Missile> = {
		let json = include_str!("../../wt_missile_calc/index/all.json");
		let mut missiles: Vec<Missile> = serde_json::from_str(json).unwrap();
		missiles.sort_by_key(|d| d.name.clone());

		missiles
	};
}

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
	// This provides better error messages in debug mode.
	// It's disabled in release mode so it doesn't bloat up the file size.
	#[cfg(debug_assertions)]
		console_error_panic_hook::set_once();

	let window: Window = web_sys::window().expect("no global `window` exists");
	let document: Document = window.document().expect("should have a document on window");
	let url: String = document.url().expect("should have a url");

	let url_local: &str = url.split("/").collect::<Vec<&str>>()[3];

	// Required as loading the functions via this module through the main is required (WASM doesnt support modules)
	match url_local {
		"" => { generate_main_tables(&document) }
		"live_calc.html" => { console_log("live") }
		_ => {}
	}


	#[wasm_bindgen]
	pub fn console_log(message: &str) {
		console::log_1(&JsValue::from_str(message));
	}

	#[wasm_bindgen]
	pub fn constant_calc(velocity: f64, alt: u32, missile_select: usize, do_splash: bool) {
		let mut parameters = LaunchParameter::new_from_parameters(false, (velocity / 3.6), 0.0, (velocity / 3.6), alt);

		let mut results = generate(&MISSILES[missile_select], &parameters, 0.1, false);

		let window: Window = web_sys::window().expect("no global `window` exists");
		let document: Document = window.document().expect("should have a document on window");

		document.get_element_by_id("range").unwrap().set_inner_html(&results.distance_flown.round().to_string());

		let mut attempted_distance = results.distance_flown.round();

		if do_splash {
			while !results.splash.splash {
				results = generate(&MISSILES[missile_select], &parameters, 0.1, false);
				parameters.distance_to_target -= 10.0;
			}
			document.get_element_by_id("splash_at").unwrap().set_inner_html(&results.splash.at.round().to_string());
		}else {
			document.get_element_by_id("splash_at").unwrap().set_inner_html("-");
		}
	}

	#[wasm_bindgen]
	pub fn update_tables(alt: u32, vel: u32) {update_main_tables(alt, vel)}
	#[wasm_bindgen]
	pub fn make_option_inputs() {
		let window: Window = web_sys::window().expect("no global `window` exists");
		let document: Document = window.document().expect("should have a document on window");

		let select = document.get_element_by_id("missile_select").unwrap();

		for (i, missile) in MISSILES.iter().enumerate() {
			let missile_element = document.create_element("option").unwrap();
			missile_element.set_attribute("value", &i.to_string());
			missile_element.set_text_content(Some(&missile.name));
			select.append_child(&missile_element);
		}
	}
	Ok(())
}

fn generate_main_tables(document: &web_sys::Document) {
	let mut parameters = LaunchParameter::new_from_parameters(false, 343.0, 0.0, 0.0, 0);

	document.get_element_by_id("alt").unwrap().set_attribute("value", &parameters.altitude.to_string());
	document.get_element_by_id("vel").unwrap().set_attribute("value", &parameters.start_velocity.to_string());

	make_table(&parameters);
}

fn update_main_tables(alt: u32, vel: u32) {
	let document: Document = web_sys::window().unwrap().document().expect("should have a document on window");

	for missile in MISSILES.iter() {
		let parameters = LaunchParameter::new_from_parameters(false, vel as f64,0.0, 0.0, alt);
		let results = generate(&missile, &parameters, 0.1, false);
		let cell = document.get_element_by_id(&format!("range_{}", &missile.name)).unwrap();
		cell.set_inner_html(&results.distance_flown.round().to_string());
	}
}