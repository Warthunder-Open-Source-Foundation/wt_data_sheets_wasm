use wasm_bindgen::prelude::*;
use web_sys::console;
use wasm_bindgen::JsValue;
use wt_missile_calc_lib::missiles::Missile;

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

static STATIC_MISSILES: &str =  include_str!("../../wt_missile_calc/index/all.json");


// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
	// This provides better error messages in debug mode.
	// It's disabled in release mode so it doesn't bloat up the file size.
	#[cfg(debug_assertions)]
		console_error_panic_hook::set_once();

	// Your code goes here!
	console::log_1(&JsValue::from_str("Hello world!"));

	let window = web_sys::window().expect("no global `window` exists");
	let document = window.document().expect("should have a document on window");
	let body = document.body().expect("document should have a body");

	let mut missiles: Vec<Missile> = serde_json::from_str(STATIC_MISSILES).unwrap();

	missiles.sort_by_key(|d| d.name.clone());

	let table = document.query_selector(".main_table").unwrap().unwrap();


	for (i, Missile) in missiles.iter().enumerate() {
		let row = document.create_element("tr")?;
		let made_row = make_row(&Missile);

		if i % 2 == 0 {
			row.set_attribute("class", "grey-tr");
		}

		for j in 0..17 {
			let value = &made_row[j];
			let cell = document.create_element("td")?;
			cell.set_text_content(Some(&value));


			// if let Ok(results) = value.parse::<f64>() {
			// 	if results == 0.0 {
			// 		cell.set_attribute("bgcolor", "#ff0000");
			// 	}
			// }


			row.append_child(&cell)?;
		}
		table.append_child(&row)?;

	}
	Ok(())
}


pub fn make_row(m: &Missile) -> [String; 17] {
	[
		m.name.split("/").collect::<Vec<&str>>()[3].split(".").collect::<Vec<&str>>()[0].to_string(),
		"WIP".into(),
		m.endspeed.to_string(),
		m.deltav.to_string(),
		m.loadfactormax.to_string(),
		m.reqaccelmax.to_string(),
		m.bands[0].to_string(),
		m.bands[1].to_string(),
		m.bands[2].to_string(),
		m.bands[3].to_string(),
		m.fov.to_string(),
		m.gate.to_string(),
		m.lockanglemax.to_string(),
		m.anglemax.to_string(),
		m.warmuptime.to_string(),
		m.worktime.to_string(),
		m.cageable.to_string(),
	]
}