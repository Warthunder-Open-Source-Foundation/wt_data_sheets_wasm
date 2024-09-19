use crate::MISSILES;
use std::panic;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use web_sys::{console, Document, Window};
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::generate;
use wt_datamine_extractor_lib::missile::missile::Missile;
use wt_datamine_extractor_lib::missile::visbands::Visband;

pub fn panic_debug() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen]
pub fn console_log(message: &str) {
    console::log_1(&JsValue::from_str(message));
}

#[allow(clippy::let_underscore_drop, clippy::missing_panics_doc)]
pub fn make_missile_option_inputs(selector: &str, item: &str, class: Option<&str>) {
    let document = get_document();

    let select;
    if let Some(value) = document.get_element_by_id(selector) {
        select = value;
    } else {
        return;
    };

    for (i, missile) in MISSILES.iter().enumerate() {
        if !missile.name.contains("default") {
            let element = document.create_element(item).unwrap();
            let _ = element.set_attribute("value", &i.to_string());
            if let Some(value) = class {
                let _ = element.set_attribute("class", value);
            }
            element.set_text_content(Some(&missile.localized));
            element.set_attribute("id", &missile.name).unwrap();
            let _ = select.append_child(&element);
        }
    }
}

#[allow(clippy::must_use_candidate)]
pub fn get_document() -> Document {
    let window: Window = web_sys::window().expect("no global `window` exists");
    let document: Document = window.document().expect("should have a document on window");
    document
}

#[allow(clippy::must_use_candidate)]
pub fn make_row(m: &Missile, parameters: LaunchParameter) -> [String; 24] {
    // let parameters = LaunchParameter::new_from_parameters(false, 343.0, 0.0, 0.0, 0);

    let results = generate(m, parameters, 0.1, false);

    let range = results.distance_flown.to_meters().round();

    let visband = m.bands.clone().unwrap_or(Visband {
        range_band0: 0,
        range_band1: 0,
        range_band2: 0,
        range_band3: 0,
        range_band4: 0,
        range_band6: 0,
        range_band7: 0,
        range_max: 0,
    });

    [
        m.localized.to_string(),
        m.seekertype.to_string(),
        range.to_string(),
        format!("{:.1}", (m.force0 / 9.807) / m.mass),
        if m.endspeed == 0.0 {
            "-".to_owned()
        } else {
            m.endspeed.to_string()
        },
        m.deltav.to_string(),
        m.loadfactormax.to_string(),
        m.reqaccelmax.to_string(),
        visband.rear_aspect().to_string(),
        visband.all_aspect().to_string(),
        visband.flares().to_string(),
        visband.ircm().to_string(),
        visband.sun_and_misc().to_string(),
        visband.dircm().to_string(),
        visband.afterburner_plume().to_string(),
        m.fov.unwrap_or_default().to_string(),
        m.gate.unwrap_or_default().to_string(),
        m.lockanglemax.to_string(),
        m.anglemax.to_string(),
        m.warmuptime.to_string(),
        m.worktime.to_string(),
        m.cageable.to_string(),
        m.allow_radar_slave.to_string(),
        m.has_data_link.to_string(),
    ]
}

#[allow(clippy::must_use_candidate)]
pub fn make_row_params() -> [String; 21] {
    [
        "name".to_string(),
        "Seeker".to_string(),
        "range".to_string(),
        "TWR".to_string(),
        "Time to 2km".to_string(),
        "DeltaV".to_string(),
        "LaunchG".to_string(),
        "FlightG".to_string(),
        "Rear aspect".to_string(),
        "All aspect".to_string(),
        "IR decoys".to_string(),
        "IRCM".to_string(),
        "Fov".to_string(),
        "Gate".to_string(),
        "LaunchFov".to_string(),
        "FlightFov".to_string(),
        "WarmUpTime".to_string(),
        "WorkTime".to_string(),
        "Uncage".to_string(),
        "Radar slave".to_string(),
        "Datalink".to_string(),
    ]
}
