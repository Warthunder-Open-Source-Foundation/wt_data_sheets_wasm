use js_sys::JsString;
use std::str::FromStr;
use simple_si_units::base::Distance;
use wasm_bindgen::prelude::*;
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::generate;
use crate::{make_missile_option_inputs, MISSILES};

#[wasm_bindgen]
pub fn generate_targets() {
    make_missile_option_inputs("ul_input", "option", None);
}

#[wasm_bindgen]
#[allow(clippy::missing_errors_doc)]
pub fn initiate_calc(velocity: f64, alt: f64, select: usize) -> Result<Vec<JsString>, JsValue> {
    constant_calc(velocity, alt, select, true)
}

#[allow(clippy::missing_panics_doc, clippy::missing_errors_doc)]
pub fn constant_calc(
    velocity: f64,
    alt: f64,
    missile_select: usize,
    do_splash: bool,
) -> Result<Vec<JsString>, JsValue> {
    let mut parameters =
        LaunchParameter::new_from_parameters(false, velocity / 3.6, 0.0, velocity / 3.6, alt);

    let missile = &MISSILES[missile_select];
    let mut results = generate(&missile, parameters, 0.1, false);

    parameters.distance_to_target = results.distance_flown;
    results.splash.splash = false;

    if do_splash {
        while !results.splash.splash {
            results = generate(&missile, parameters, 0.1, false);
            parameters.distance_to_target -= Distance::from_meters(10.0);
        }
        Ok([
            JsString::from_str(&results.distance_flown.to_meters().round().to_string()).unwrap(),
            JsString::from_str(&results.splash.at.to_meters().round().to_string()).unwrap(),
        ]
        .to_vec())
    // splash_at_element.set_inner_html(&results.splash.at.round().to_string());
    } else {
        Ok([
            JsString::from_str(&results.distance_flown.to_meters().round().to_string()).unwrap(),
            JsString::from_str("-").unwrap(),
        ]
        .to_vec())
        // Ok(JsString::from_str(&("-".to_owned() + " aaaa " + &results.distance_flown.round().to_string())).unwrap())
        // splash_at_element.set_inner_html("-");
    }
}
