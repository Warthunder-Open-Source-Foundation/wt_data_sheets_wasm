use crate::localhost::all_from_req;
use crate::localhost::indicators::Indicators;
use crate::localhost::state::State;
use crate::utils::direct_average::Average;
use crate::utils::format_duration::format_duration;
use crate::utils::long_average::LongAverage;
use crate::{console_log, get_document};
use lazy_static::lazy_static;
use plotters::drawing::IntoDrawingArea;
use plotters::prelude::ChartBuilder;
use plotters::prelude::TextStyle;
use plotters::prelude::*;
use plotters::style::IntoFont;
use plotters::style::RGBColor;
use plotters_canvas::CanvasBackend;
use serde::{Deserialize, Serialize};
use std::ops::RangeInclusive;
use std::sync::Arc;
use std::sync::Mutex;
use std::time::{Duration, SystemTime};
use wasm_bindgen::prelude::*;
use wt_afterburner::Thrust;

const WIDTH: u32 = 3840;
const HEIGHT: u32 = 2160;
const TIME: usize = 300;

// Scaling settings
const FONT_AXIS: u32 = ((WIDTH + HEIGHT) / 2) as u32;

lazy_static! {
    static ref APP_STATE: Mutex<AppState> = Mutex::new(AppState::new());
}

#[derive(Debug, Clone)]
pub struct AppState {
    last_fuel: f64,
    avg_fuel: LongAverage<f64>,
    avg_efficiency: LongAverage<f64>,
    avg_thrust: LongAverage<f64>,
    after_burner_stages: Thrust,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            last_fuel: 0.0,
            avg_fuel: LongAverage::new(),
            avg_efficiency: LongAverage::new(),
            avg_thrust: LongAverage::new(),
            after_burner_stages: Thrust::new(0),
        }
    }
}

#[wasm_bindgen]
pub fn core_loop(indicators: &str, state: &str, timeout: usize) {
    let mut app_state = APP_STATE.lock().unwrap();
    // Gates validity of passed data

    let (indicators, state) = if let Some(out) = all_from_req(indicators, state) {
        out
    } else {
        console_log("Data invalid");
        return;
    };

    // app_state.after_burner_stages.add_ab_level(state.throttle as u8);
    // app_state.after_burner_stages.current = state.throttle as u8;

    // Compute avg fuel
    let fuel_now = app_state.last_fuel;
    app_state.avg_fuel.push(fuel_now - indicators.fuel_mass);
    app_state.last_fuel = indicators.fuel_mass;
    let avg_fuel = app_state.avg_fuel.take_avg(3).abs();

    let mut total_thrust = state.thrust_0;
    if let Some(thrust_1) = state.thrust_1 {
        total_thrust += thrust_1;
    }
    app_state.avg_thrust.push(total_thrust);

    let fuel_efficiency = app_state.avg_thrust.take_avg(3) / avg_fuel;
    app_state.avg_efficiency.push(fuel_efficiency);

    // console_log(&format!("{} kN/kg", app_state.avg_efficiency.get_avg()));

    let doc = get_document();
    doc.get_element_by_id("fuel_efficiency")
        .unwrap()
        .set_inner_html(&format!(
            "Fuel efficiency: {} kN\\kg",
            fuel_efficiency.floor()
        ));
    doc.get_element_by_id("avg_fuel")
        .unwrap()
        .set_inner_html(&format!("Fuel average usage: {:.3} kg\\s", avg_fuel));
    doc.get_element_by_id("thrust")
        .unwrap()
        .set_inner_html(&format!("Thrust: {} kN", total_thrust));
    doc.get_element_by_id("fuel_percent")
        .unwrap()
        .set_inner_html(&format!(
            "Fuel: {:.2} % ({:.1} kg)",
            ((indicators.fuel_mass / state.total_fuel) * 100.0),
            indicators.fuel_mass
        ));
    doc.get_element_by_id("fuel_ttb")
        .unwrap()
        .set_inner_html(&format!(
            "Time to bingo: {}",
            format_duration(
                (indicators.fuel_mass / app_state.avg_fuel.take_avg(10).abs()).round() as u64
            )
        ));
    doc.get_element_by_id("throttle")
        .unwrap()
        .set_inner_html(&format!("Throttle: {} %", state.throttle));

    let ab_stage = if let Some(stage) = app_state
        .after_burner_stages
        .get_and_set_ab(state.throttle as u8)
    {
        format!("AB Stage: {stage}")
    } else {
        "No AB".to_owned()
    };
    doc.get_element_by_id("ab_stage")
        .unwrap()
        .set_inner_html(&ab_stage);

    // CANVAS STUFF FROM HERE ON

    let text_color = RGBAColor(255, 255, 255, 1.0);
    let background_color = RGBAColor(0x_28, 0x_28, 0x_28, 1.0);

    let backend: CanvasBackend = CanvasBackend::new("fuel_stats").expect("cannot find canvas");
    let root = backend.into_drawing_area();

    root.fill(&background_color).unwrap();
    let root = root.margin(50, 50, 50, 50);

    let text = |size| {
        TextStyle::from(("sans-serif", FONT_AXIS / size).into_font())
            .color(&RGBColor(255, 255, 255))
    };

    let max = (app_state.avg_thrust.max() * 1.15) as usize;

    let mut chart = ChartBuilder::on(&root)
        // Set the size of the label region
        .x_label_area_size(20)
        .y_label_area_size(40)
        .set_label_area_size(LabelAreaPosition::Bottom, FONT_AXIS / 50)
        .set_label_area_size(LabelAreaPosition::Left, FONT_AXIS / 50)
        .caption("bogos binted idk shut up", text(20))
        // Finally attach a coordinate on the drawing area and make a chart context
        .build_cartesian_2d(0..TIME, 0..max)
        .unwrap();

    let line_style = ShapeStyle {
        color: text_color,
        filled: true,
        stroke_width: 1,
    };

    let axis_style = ShapeStyle {
        color: text_color,
        filled: false,
        stroke_width: 1,
    };

    chart
        .configure_mesh()
        .axis_style(axis_style)
        .bold_line_style(line_style)
        .x_labels(50)
        .y_labels(50)
        .x_desc("time in s")
        .x_label_style(text(100))
        .y_label_style(text(100))
        .y_label_formatter(&|x| format!("{:.0}", x))
        .x_label_formatter(&|x| format!("t - {}", TIME - x))
        .draw()
        .unwrap();

    let thrust_n: Vec<f64> = app_state.avg_thrust.take_n(TIME, Some(0.0));
    let efficiency_n: Vec<f64> = app_state.avg_efficiency.take_n(TIME, Some(0.0));
    let fuel_usage_n: Vec<f64> = app_state
        .avg_fuel
        .take_n(TIME, Some(0.0))
        .iter()
        .map(|x| x * 1000.0)
        .collect();

    let mut draw_line = |input: Vec<f64>, label, style: ShapeStyle| {
        let values: Vec<(usize, usize)> = [(); TIME]
            .iter()
            .enumerate()
            .map(|(idx, _)| (idx, input[idx] as usize))
            .collect();

        let line: LineSeries<_, _> = LineSeries::new(values, style);

        chart
            .draw_series(line)
            .unwrap()
            .label(label)
            .legend(move |(x, y)| {
                PathElement::new(vec![(x, y), (x + (WIDTH / 50) as i32, y)], &style.color)
            });
    };
    draw_line(
        thrust_n,
        "Thrust N",
        ShapeStyle {
            color: RGBAColor(255, 0, 0, 1.0),
            filled: true,
            stroke_width: 200,
        }
        .into(),
    );

    draw_line(
        efficiency_n,
        "Efficiency kN/kg",
        ShapeStyle {
            color: RGBAColor(0, 255, 0, 1.0),
            filled: true,
            stroke_width: 200,
        }
        .into(),
    );

    draw_line(
        fuel_usage_n,
        "Fuel usage / 1000 kg\\s",
        ShapeStyle {
            color: RGBAColor(0, 0, 255, 1.0),
            filled: true,
            stroke_width: 200,
        }
        .into(),
    );

    chart
        .configure_series_labels()
        .position(SeriesLabelPosition::MiddleLeft)
        .border_style(&text_color)
        .background_style(&background_color.mix(0.8))
        .legend_area_size(WIDTH / 40)
        .label_font(text(50))
        .draw()
        .unwrap();
}
