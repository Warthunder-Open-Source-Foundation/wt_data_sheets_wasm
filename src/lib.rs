use std::str::FromStr;

use lazy_static::lazy_static;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;
use web_sys::{console, Document, Window, window};
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::{generate, LaunchResults, Splash};
use wt_datamine_extractor_lib::missile::missile::Missile;
use crate::comparison::make_comparison;

use crate::util::{console_log, make_option_inputs};

use crate::table::{generate_main_tables, make_table};

pub mod table;
pub mod util;
pub mod live_calc;
pub mod comparison;

lazy_static! {
	static ref MISSILES: Vec<Missile> = {
		let json = include_str!("../../wt_datamine_extractor/missile_index/all.json");
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
	Ok(())
}