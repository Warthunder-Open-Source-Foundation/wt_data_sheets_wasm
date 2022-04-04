use lazy_static::lazy_static;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::*;
use wt_datamine_extractor_lib::missile::missile::Missile;
use wt_datamine_extractor_lib::shell::shells::{Shell};
use wt_datamine_extractor_lib::shell::compress::CompressedShells;
use wt_datamine_extractor_lib::thermal::thermals::Thermal;
use crate::buildstamp::BuildStamp;

use crate::util::{console_log, get_document, make_missile_option_inputs};

pub mod table;
pub mod util;
pub mod live_calc;
pub mod comparison;
pub mod thermal_index;
pub mod shell_index;
mod buildstamp;


const GAME_VER: &str = include_str!("../wt_datamine_extractor/meta_index/version.txt");
const BUILDSTAMP_RAW: &str = include_str!("../buildstamp.json");

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(start)]
#[allow(clippy::missing_errors_doc)]
pub fn main_js() -> Result<(), JsValue> {
	// This provides better error messages in debug mode.
	// It's disabled in release mode so it doesn't bloat up the file size.
	#[cfg(debug)]
		console_error_panic_hook::set_once();
	make_footer_data();
	Ok(())
}

#[wasm_bindgen]
pub fn make_footer_data() {
	let document = get_document();
	if let Some(ver) = document.get_element_by_id("game_ver") {
		let buildstamp =  BuildStamp::from_const();

		ver.set_inner_html(&format!("{} {}", ver.inner_html(), GAME_VER));
		ver.set_inner_html(&format!("{} last updated on {}", ver.inner_html(), buildstamp.formatted));
		console_log(&format!("Game version set to {}, with timestamp {}", GAME_VER, buildstamp.date));
	} else {
		console_log(&format!("Cant display game version {}", GAME_VER));
	}
}