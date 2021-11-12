mod table;

use std::thread::sleep;
use std::time::Duration;
use wasm_bindgen::prelude::*;
use web_sys::{console};
use wasm_bindgen::JsValue;
use crate::table::make_table;

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

	// Your code goes here!
	console::log_1(&JsValue::from_str("Hello world!"));

	make_table();

	let window = web_sys::window().expect("no global `window` exists");
	let document = window.document().expect("should have a document on window");

	let button = document.query_selector("#start_calc").unwrap().unwrap();

	Ok(())
}