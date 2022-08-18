use std::panic;
use lazy_static::lazy_static;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::*;

use wt_datamine_extractor_lib::bombs::bombs::Bomb;

use crate::util::{console_log, get_document, make_missile_option_inputs};
use crate::buildstamp::BuildStamp;

pub mod table;
pub mod util;
pub mod live_calc;
pub mod comparison;
pub mod thermal_index;
pub mod shell_index;
pub mod buildstamp;
pub mod const_gen_trait_compat;
pub mod missile_ballistics;
pub mod bombing_table;
pub mod battle_rating_statistics;

const GAME_VER: &str = include_str!("../wt_datamine_extractor/meta_index/version.txt");
const BUILDSTAMP_RAW: &str = include_str!("../buildstamp.json");

const BOMBS_RAW: &str = include_str!("../wt_datamine_extractor/bombs/all.json");

lazy_static! {
    static ref BOMBS: Vec<Bomb> = {
		 serde_json::from_str::<Vec<Bomb>>(&BOMBS_RAW).unwrap()
    };
}

include!(concat!(env!("OUT_DIR"), "/const_gen.rs"));

// Reduces size by around 3kb
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(start)]
#[allow(clippy::missing_errors_doc)]
pub fn main_js() -> Result<(), JsValue> {
	// This provides better error messages in debug mode.
	// It's disabled in release mode so it doesn't bloat up the file size.
	// #[cfg(debug_assertions)]
	panic::set_hook(Box::new(console_error_panic_hook::hook));
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