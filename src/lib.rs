use lazy_static::lazy_static;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::*;
use wt_datamine_extractor_lib::missile::missile::Missile;
use wt_datamine_extractor_lib::shell::shells::Shell;
use wt_datamine_extractor_lib::thermal::thermals::Thermal;

use crate::util::{console_log, get_document, make_missile_option_inputs};

pub mod table;
pub mod util;
pub mod live_calc;
pub mod comparison;
pub mod thermal_index;
pub mod shell_index;

lazy_static! {
	static ref MISSILES: Vec<Missile> = {
		let json = include_str!("../wt_datamine_extractor/missile_index/all.json");
		let mut missiles: Vec<Missile> = serde_json::from_str(json).unwrap();
		missiles.sort_by_key(|d| d.name.clone());

		missiles
	};
	static ref THERMALS: Vec<Thermal> = {
		let json = include_str!("../wt_datamine_extractor/thermal_index/all.json");
		let mut thermals: Vec<Thermal> = serde_json::from_str(json).unwrap();
		thermals.sort_by_key(|d| d.name.clone());

		thermals
	};
	static ref SHELLS: Vec<Shell> = {
		let json = include_str!("../wt_datamine_extractor/shell_index/all.json");
		let mut shells: Vec<Shell> = serde_json::from_str(json).unwrap();
		shells.sort_by_key(|d| d.name.clone());

		shells
	};
}

const GAME_VER: &str = include_str!("../wt_datamine_extractor/meta_index/version.txt");

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
#[allow(clippy::missing_errors_doc)]
pub fn main_js() -> Result<(), JsValue> {
	// This provides better error messages in debug mode.
	// It's disabled in release mode so it doesn't bloat up the file size.
	#[cfg(debug_assertions)]
		console_error_panic_hook::set_once();
	make_footer_data();
	Ok(())
}

#[wasm_bindgen]
pub fn make_footer_data() {
	let document = get_document();
	if let Some(ver) = document.get_element_by_id("game_ver") {
		ver.set_inner_html(&format!("{} {}", ver.inner_html(), GAME_VER));
		console_log(&format!("Game version set to {}", GAME_VER));
	} else {
		console_log(&format!("Cant display game version {}", GAME_VER));
	}
}