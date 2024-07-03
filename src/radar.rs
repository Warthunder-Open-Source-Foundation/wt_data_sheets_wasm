use std::sync::atomic::Ordering::Relaxed;
use std::sync::atomic::{AtomicBool, AtomicI32, Ordering};

use bevy_reflect::{Reflect, Struct};
use plotters::prelude::*;
use plotters_canvas::CanvasBackend;
use std::str::FromStr;
use wasm_bindgen::prelude::*;
use wt_sensor::scanning::scan_pattern::SubmodeCategory;
use wt_sensor::scanning::scan_type::Pattern;
use wt_sensor::util::Limits;

use crate::util::{console_log, get_document, panic_debug};
use crate::RADAR;

#[wasm_bindgen]
pub fn render_table() {
    panic_debug();
    let document = get_document();

    let radar_name = document.get_element_by_id("r_name").unwrap();
    radar_name.set_inner_html(&RADAR.localized);

    // Scan ranges
    {
        let scan_ranges = document.get_element_by_id("scan_ranges").unwrap();

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

    // Submodes
    {
        let submode_rows = document.get_element_by_id("submode_rows").unwrap();

        for (i, mode) in RADAR.submode.iter().enumerate() {
            let row = document.create_element("tr").unwrap();
            for iter_field in mode.iter_fields() {
                let elem = document.create_element("td").unwrap();
                if let Some(val) = iter_field.downcast_ref::<Option<f64>>() {
                    elem.set_inner_html(&if let Some(out) = val {
                        out.to_string()
                    } else {
                        "-".to_owned()
                    });
                }
                if let Some(val) = iter_field.downcast_ref::<Option<bool>>() {
                    elem.set_inner_html(&if let Some(out) = val {
                        out.to_string()
                    } else {
                        "-".to_owned()
                    });
                }
                if let Some(val) = iter_field.downcast_ref::<Option<u8>>() {
                    elem.set_inner_html(&if let Some(out) = val {
                        out.to_string()
                    } else {
                        "-".to_owned()
                    });
                }
                if let Some(val) = iter_field.downcast_ref::<Pattern>() {
                    elem.set_inner_html(&val.to_string());
                }
                if let Some(val) = iter_field.downcast_ref::<SubmodeCategory>() {
                    elem.set_inner_html(&val.to_string());
                }
                if let Some(val) = iter_field.downcast_ref::<Limits>() {
                    elem.set_inner_html(&format!(
                        "{}/{} {}/{}",
                        val.azimuth.start(),
                        val.azimuth.end(),
                        val.elevation.start(),
                        val.elevation.end(),
                    ));
                }
                row.append_child(&elem);
            }

            let canvas = document.create_element("canvas").unwrap();
            canvas.set_id(&format!("canvas_{i}"));
            canvas.set_class_name("canvas_scan");
            canvas.set_attribute("data-pattern", &mode.pattern.to_string());
            canvas.set_attribute("width", "100").unwrap();
            canvas.set_attribute("height", "100").unwrap();

            row.append_child(&canvas).unwrap();

            submode_rows.append_child(&row);
        }
    }
}

#[wasm_bindgen]
pub fn run_proto(step: i32, id: &str) {
    let pattern = &RADAR.submode[usize::from_str(id.split("_").last().unwrap()).unwrap()];

    const WIDTH: usize = 100;
    const HEIGHT: usize = 100;

    let mut backend = CanvasBackend::new(id).expect("cannot find canvas");
    draw_rectangle(
        &mut backend,
        (0, 0),
        (WIDTH as i32, HEIGHT as i32),
        &RGBAColor(0, 0, 0, 1.0),
    ); // prefill black

    let beam_width = 5;
    let speed = pattern.period.unwrap_or(0.0) * 10.0; // higher faster
    let radar_angle =
        (((step as f64 / speed).sin() + 1.0) * WIDTH as f64 * 0.5) - beam_width as f64 * 0.5;

    draw_rectangle(
        &mut backend,
        (radar_angle as i32, 0),                          // Top left
        (radar_angle as i32 + beam_width, HEIGHT as i32), // Bottom right
        &RGBAColor(0, 128, 0, 1.0),
    );
}

fn draw_rectangle(
    backend: &mut CanvasBackend,
    lhs: (i32, i32),
    rhs: (i32, i32),
    style: &RGBAColor,
) {
    let tl = (lhs.0, lhs.1);
    let tr = (lhs.0, rhs.1);
    let br = (rhs.0, rhs.1);
    let bl = (rhs.0, lhs.1);
    backend.fill_polygon([tl, tr, br, bl], style).unwrap();
}
