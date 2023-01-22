use std::sync::atomic::{AtomicBool, AtomicI32, Ordering};
use std::sync::atomic::Ordering::Relaxed;
use wasm_bindgen::prelude::*;
use plotters::prelude::*;
use plotters_canvas::CanvasBackend;
use crate::RADAR;
use crate::util::{console_log, get_document, panic_debug};

const RADAR_POS: AtomicI32 = AtomicI32::new(0);
const INVERT: AtomicBool = AtomicBool::new(false);

#[wasm_bindgen]
pub fn render_table() {
	panic_debug();
	let document = get_document();

	let radar_name = document.get_element_by_id("r_name").unwrap();
	radar_name.set_inner_html(&RADAR.localized);

	// Set scan ranges
	let scan_ranges = document.get_element_by_id("scan_ranges").unwrap();
	console_log("&i.to_string()");


	for i in &RADAR.scope_range_sets.common {
		let elem = document.create_element("p").unwrap();
		elem.set_inner_html(&((i * 0.001).to_string() + " km"));
		scan_ranges.append_child(&elem).unwrap();
	}

	let boresight_ranges = document.get_element_by_id("boresight_ranges").unwrap();

	for i in &RADAR.scope_range_sets.boresight_lock {
		let elem = document.create_element("p").unwrap();
		elem.set_inner_html(&((i * 0.001).to_string() + " km"));
		boresight_ranges.append_child(&elem).unwrap();
	}
}

#[wasm_bindgen]
pub fn run_proto(step: i32) {
	let mut radar_pos = RADAR_POS.load(Ordering::Relaxed);
	let mut invert = INVERT.load(Relaxed);
	let mut backend = CanvasBackend::new("radar_pattern").expect("cannot find canvas");
	draw_rectangle(&mut backend, (0, 0), (1000, 1000), &RGBAColor(0, 0, 0, 1.0));

	let counter = (step * 10) % 1000;


	let radar_angle  = (((step as f64 / 25.0).sin() + 1.0) * 500.0) - 25.0;

	// console_log(&format!("{} {}", radar_angle, counter));

	draw_rectangle(&mut backend, (radar_angle as i32, 0), (radar_angle as i32 + 50, 1000), &RGBAColor(0, 128, 0, 1.0));

	RADAR_POS.store(radar_pos, Relaxed);
	INVERT.store(invert, Relaxed);
}

fn draw_rectangle(backend: &mut CanvasBackend, lhs: (i32, i32), rhs: (i32, i32), style: &RGBAColor) {
	let tl = (lhs.0, lhs.1);
	let tr = (lhs.0, rhs.1);
	let br = (rhs.0, rhs.1);
	let bl = (rhs.0, lhs.1);
	backend.fill_polygon([tl, tr, br, bl], style).unwrap();
}