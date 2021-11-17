use std::f64;
use std::str::FromStr;

use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;
use web_sys::{console, Document, Window, window};
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;

use crate::table::make_table;

mod table;

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

	match url_local {
		"" => { generate_main_tables(&document) },
		_ => {}
	}


	#[wasm_bindgen]
		pub fn console_log(message: &str) {
		console::log_1(&JsValue::from_str(message));
	}

	Ok(())
}

fn generate_main_tables(document: &web_sys::Document) {

	let mut parameters = LaunchParameter::new_from_parameters(false, 343.0, 0.0, 0.0, 0);

	let url: String = document.url().unwrap(); // gets url from entire page

	if url.contains("?") {
		let mut keys = "";

		console::log_1(&JsValue::from_str("Using custom values"));

		keys = url.split("?").collect::<Vec<&str>>()[1]; // seperates url.com/?yes to ?yes

		let values = keys.split("+").collect::<Vec<&str>>(); // seperates values like one=1+two=2

		for value in values {
			if value.contains("alt") {
				let parameer = &value.clone()[4..];
				parameters.altitude = u32::from_str(parameer).unwrap();
			}
			if value.contains("vel") {
				let parameer = &value.clone()[4..];
				parameters.start_velocity = f64::from_str(parameer).unwrap();
			}
		}
	}

	document.get_element_by_id("alt").unwrap().set_attribute("value", &parameters.altitude.to_string());
	document.get_element_by_id("vel").unwrap().set_attribute("value", &parameters.start_velocity.to_string());

	make_table(&parameters);
}