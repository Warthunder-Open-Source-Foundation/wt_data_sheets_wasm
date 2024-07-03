use crate::MISSILES;
use plotters::prelude::*;
use plotters_canvas::CanvasBackend;
use std::cell::Cell;
use wasm_bindgen::prelude::*;
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::{generate, LaunchResults};

use std::str::FromStr;
use std::sync::Mutex;
use js_sys::Math::min;
use wt_datamine_extractor_lib::missile::missile::Missile;

const WIDTH: u32 = 3840;
const HEIGHT: u32 = 2160;

const TIMESTEP: f64 = 0.1;

// Scaling settings
const FONT_AXIS: u32 = ((WIDTH + HEIGHT) / 2) as u32;
const DISTANCE_FACTOR: f64 = 100.0;
const TURNING_FACTOR: f64 = 100.0;

static LAST_RESULTS: Mutex<Option<(LaunchResults, Missile)>> = Mutex::new(None);

#[wasm_bindgen]
pub fn plot(
    id: &str,
    target_missile: &str,
    altitude: u32,
    start_velocity: f64,
    canvas_background_color: &str,
    canvas_text_color: &str,
) {
    let background_split: Vec<&str> = canvas_background_color.split("_").collect();
    let text_split: Vec<&str> = canvas_text_color.split("_").collect();
    let rgb = |input| u8::from_str(input).unwrap_or(255);
    let background_color = RGBColor(
        rgb(background_split[0]),
        rgb(background_split[1]),
        rgb(background_split[2]),
    );

    let text_color = RGBColor(rgb(text_split[0]), rgb(text_split[1]), rgb(text_split[2]));

    let backend = CanvasBackend::new(id).expect("cannot find canvas");

    let root = backend.into_drawing_area();

    let mut missile = &MISSILES[0];
    for item in MISSILES.iter() {
        if item.name == target_missile {
            missile = item;
        }
    }

    let results = generate(
        &missile,
        LaunchParameter {
            use_gravity: false,
            start_velocity,
            distance_to_target: 0.0,
            target_speed: 0.0,
            altitude,
        },
        TIMESTEP,
        false,
    );

    // Centripetal force F = mv² / r for maximum turning radius
    // F = force newtons or ms²
    // m = mass kg
    // v = velocity m/s
    // r = radius meter

    // Formula used below
    // Base:
    //		F = mv² / r
    // Solve for r:
    //		r = mv² / F
    // Expand F:
    //		r = mv² / ma
    // Eliminate:
    //		r = v² / m

    let turning_radius = |velocity: f64| velocity.powi(2) / missile.reqaccelmax;

    // Velocity over time
    let v_profile: Vec<(f32, f64)> = results
        .profile
        .v
        .iter()
        .enumerate()
        .map(|i| (i.0 as f32, *i.1 as f64))
        .collect();

    // Maximum turning radius at given velocity
    let turn_profile: Vec<(f32, f64)> = v_profile
        .iter()
        .map(|(i, velocity)| (*i, turning_radius(*velocity) / TURNING_FACTOR))
        .collect();

    // Acceleration over time
    let a_profile: Vec<(f32, f64)> = results
        .profile
        .a
        .iter()
        .enumerate()
        .map(|i| (i.0 as f32, *i.1 as f64))
        .collect();

    // Distance over time
    let d_profile: Vec<(f32, f64)> = results
        .profile
        .d
        .iter()
        .enumerate()
        .map(|i| (i.0 as f32, *i.1 / DISTANCE_FACTOR as f64))
        .collect();

    let x_dim = 0f32..results.profile.sim_len as f32 * 1.1;
    let y_dim = -(results.min_a.abs() + 50.0).round()..(results.max_v + 50.0).round();

    // Save once all data has been copied out of results
    *LAST_RESULTS.try_lock().unwrap() = Some((results, missile.clone()));

    root.fill(&background_color).unwrap();
    let root = root.margin(50, 50, 50, 50);

    let text =
        |size| TextStyle::from(("sans-serif", FONT_AXIS / size).into_font()).color(&text_color);

    // After this point, we should be able to draw construct a chart context
    let mut chart = ChartBuilder::on(&root)
        // Set the size of the label region
        .x_label_area_size(20)
        .y_label_area_size(40)
        .set_label_area_size(LabelAreaPosition::Bottom, FONT_AXIS / 50)
        .set_label_area_size(LabelAreaPosition::Left, FONT_AXIS / 50)
        .caption(&format!("{}", &missile.localized), text(20))
        // Finally attach a coordinate on the drawing area and make a chart context
        .build_cartesian_2d(x_dim, y_dim)
        .unwrap();

    let line_style = ShapeStyle {
        color: RGBAColor {
            0: text_color.0,
            1: text_color.1,
            2: text_color.2,
            3: 1.0,
        },
        filled: true,
        stroke_width: 1,
    };

    let axis_style = ShapeStyle {
        color: RGBAColor {
            0: text_color.0,
            1: text_color.1,
            2: text_color.2,
            3: 1.0,
        },
        filled: false,
        stroke_width: 1,
    };
    // Then we can draw a mesh
    chart
        .configure_mesh()
        .axis_style(axis_style)
        .bold_line_style(line_style)
        // We can customize the maximum number of labels allowed for each axis
        .x_labels(50)
        .y_labels(25)
        .x_desc("time in s")
        .x_label_style(text(100))
        .y_label_style(text(100))
        // We can also change the format of the label text
        .y_label_formatter(&|x| format!("{:.0}", x))
        .x_label_formatter(&|x| format!("{}", x / TIMESTEP.powi(-1) as f32))
        .draw()
        .unwrap();

    let style = |color: RGBColor| ShapeStyle {
        color: color.to_rgba(),
        filled: true,
        stroke_width: 1,
    };

    let mut draw_line = |profile, caption, color| {
        chart
            .draw_series(LineSeries::new(profile, style(color)))
            .unwrap()
            .label(caption)
            .legend(move |(x, y)| {
                PathElement::new(vec![(x, y), (x + (WIDTH / 50) as i32, y)], color)
            });
    };

    draw_line(v_profile, "Velocity m/s".to_owned(), RED);

    draw_line(a_profile, "Acceleration m/s²".to_owned(), BLUE);

    draw_line(d_profile, format!("Distance m / {DISTANCE_FACTOR}"), GREEN);

    // Load is 0 on some missile, making this calculation useless to display
    if missile.reqaccelmax != 0.0 {
        draw_line(
            turn_profile,
            format!("Turning radius km / {:.0}", 1000.0 / TURNING_FACTOR),
            YELLOW,
        );
    }

    chart
        .draw_series(LineSeries::new(
            vec![(0.0, 0.0), (WIDTH as f32 * TIMESTEP.powi(-1) as f32, 0.0)],
            &text_color,
        ))
        .unwrap();

    // let mach_lines = for i in 1..(results.max_v / 343.0).ceil() as u32 {
    // 	let target: f64 = (i * 343) as f64;
    // 	chart.draw_series(LineSeries::new(
    // 		vec![(0.0 as f32, target), (120000.0 as f32, target)],
    // 		&RED,
    // 	)).unwrap();
    // };

    // chart.draw_series(
    // 	vec![(3.1_f32, 4.1)].iter().map(|point| TriangleMarker::new(*point, 5, &BLUE)),
    // ).unwrap();

    chart
        .configure_series_labels()
        .border_style(&text_color)
        .background_style(&background_color.mix(0.8))
        .legend_area_size(WIDTH / 40)
        .label_font(text(50))
        .draw()
        .unwrap();
}

#[wasm_bindgen]
pub fn export_zip(plot_png: &[u8]) -> Vec<u8> {
    let (res, missile) = LAST_RESULTS.try_lock().unwrap().clone().unwrap();
    let file = res.as_csv(Some(plot_png), missile);
    file.unwrap()
}

#[wasm_bindgen]
pub fn export_all_to_zip(altitude: u32, start_velocity: f64) -> Vec<u8> {
    let mut zip = None;
    for missile in MISSILES.iter() {
        let results = generate(
            missile,
            LaunchParameter {
                use_gravity: false,
                start_velocity,
                distance_to_target: 0.0,
                target_speed: 0.0,
                altitude,
            },
            TIMESTEP,
            false,
        );
        if zip.is_none() {
            zip = Some(results.start_csv(None, missile.clone()));
        } else {
            results.write_into_zip(None, missile.clone(), zip.as_mut().unwrap()).unwrap();
        }
    }
    LaunchResults::finish_zip(zip.unwrap()).unwrap()
}
