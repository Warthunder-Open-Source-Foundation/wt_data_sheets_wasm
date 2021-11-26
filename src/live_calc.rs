use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::generate;

use wasm_bindgen::prelude::*;

use crate::{make_missile_option_inputs, MISSILES};
use crate::util::get_document;

#[wasm_bindgen]
pub fn generate_targets() {
	make_missile_option_inputs("ul_input", "option", None);
}

#[wasm_bindgen]
#[allow(clippy::missing_errors_doc)]
pub fn initiate_calc(velocity: f64, alt: u32, select: usize) -> Result<(), JsValue> {
	constant_calc(velocity, alt, select, true)?;
	Ok(())
}

#[allow(clippy::missing_panics_doc, clippy::missing_errors_doc)]
pub fn constant_calc(velocity: f64, alt: u32, missile_select: usize, do_splash: bool) -> Result<(), JsValue> {
	let mut parameters = LaunchParameter::new_from_parameters(false, velocity / 3.6, 0.0, velocity / 3.6, alt);

	let mut results = generate(&MISSILES[missile_select], &parameters, 0.1, false);

	let document = get_document();

	document.get_element_by_id("range").unwrap().set_inner_html(&results.distance_flown.round().to_string());

	parameters.distance_to_target = results.distance_flown.round();
	results.splash.splash = false;

	if do_splash {
		while !results.splash.splash {
			results = generate(&MISSILES[missile_select], &parameters, 0.1, false);
			parameters.distance_to_target -= 10.0;
		}
		document.get_element_by_id("splash_at").unwrap().set_inner_html(&results.splash.at.round().to_string());
	} else {
		document.get_element_by_id("splash_at").unwrap().set_inner_html("-");
	}
	Ok(())
}