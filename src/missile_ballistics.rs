use plotters::prelude::*;
use plotters_canvas::CanvasBackend;
use wasm_bindgen::prelude::*;
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::generate;
use crate::MISSILES;

use std::str::FromStr;


const WIDTH: u32 = 3840;
const HEIGHT: u32 = 2160;

const TIMESTEP: f64 = 0.1;

// Scaling settings
const FONT_AXIS: u32 = ((WIDTH + HEIGHT) / 2) as u32;
const DISTANCE_FACTOR: u32 = 100;

#[wasm_bindgen]
pub fn plot(id: &str, target_missile: &str, altitude: u32, start_velocity: f64, canvas_background_color: &str, canvas_text_color: &str) {
	let background_split: Vec<&str> = canvas_background_color.split("_").collect();
	let text_split: Vec<&str> = canvas_text_color.split("_").collect();
	let rgb = |input| u8::from_str(input).unwrap_or(255);
	let background_color = RGBColor(
		rgb(background_split[0]),
		rgb(background_split[1]),
		rgb(background_split[2])
	);

	let text_color = RGBColor(
		rgb(text_split[0]),
		rgb(text_split[1]),
		rgb(text_split[2])
	);

	let backend = CanvasBackend::new(id).expect("cannot find canvas");

	let root = backend.into_drawing_area();

	let mut missile = &MISSILES[0];
	for item in MISSILES.iter() {
		if item.name == target_missile {
			missile = item;
		}
	};
	let missile = wt_datamine_extractor_lib::missile::missile::Missile::from(missile);

	let results = generate(&missile, &LaunchParameter {
		use_gravity: false,
		start_velocity,
		distance_to_target: 0.0,
		target_speed: 0.0,
		altitude,
	}, TIMESTEP, false);

	let mut v_profile: Vec<(f32, f64)> = Vec::new();
	for i in results.profile.v.clone().iter().enumerate() {
		v_profile.push((i.0 as f32, *i.1 as f64));
	}

	let mut a_profile: Vec<(f32, f64)> = Vec::new();
	for i in results.profile.a.clone().iter().enumerate() {
		a_profile.push((i.0 as f32, *i.1 as f64));
	}

	let mut d_profile: Vec<(f32, f64)> = Vec::new();
	for i in results.profile.d.clone().iter().enumerate() {
		d_profile.push((i.0 as f32, *i.1 / DISTANCE_FACTOR as f64));
	}

	let x_dim = 0f32..results.profile.sim_len as f32 * 1.1;
	let y_dim = -(results.min_a.abs() + 50.0).round()..(results.max_v + 50.0).round();

	root.fill(&background_color).unwrap();
	let root = root.margin(50, 50, 50, 50);

	let text = |size|TextStyle::from(("sans-serif", FONT_AXIS / size).into_font()).color(&text_color);

	// After this point, we should be able to draw construct a chart context
	let mut chart = ChartBuilder::on(&root)
		// Set the size of the label region
		.x_label_area_size(20)
		.y_label_area_size(40)
		.set_label_area_size(LabelAreaPosition::Bottom, FONT_AXIS / 50)
		.set_label_area_size(LabelAreaPosition::Left, FONT_AXIS / 50)
		.caption(&format!("{}", &missile.localized), text(20))
		// Finally attach a coordinate on the drawing area and make a chart context
		.build_cartesian_2d(x_dim, y_dim).unwrap();

	let line_style = ShapeStyle {
		color: RGBAColor {
			0: text_color.0,
			1: text_color.1,
			2: text_color.2,
			3: 1.0
		},
		filled: true,
		stroke_width: 1
	};

	let axis_style =ShapeStyle {
		color: RGBAColor {
			0: text_color.0,
			1: text_color.1,
			2: text_color.2,
			3: 1.0
		},
		filled: false,
		stroke_width: 1
	};
	// Then we can draw a mesh
	chart
		.configure_mesh()
		.axis_style(axis_style)
		.bold_line_style(line_style)
		// We can customize the maximum number of labels allowed for each axis
		.x_labels(50)
		.y_labels(50)
		.x_desc("time in s")
		.x_label_style(text(100))
		.y_label_style(text(100))
		// We can also change the format of the label text
		.y_label_formatter(&|x| format!("{:.0}", x))
		.x_label_formatter(&|x| format!("{}", x / TIMESTEP.powi(-1) as f32))
		.draw().unwrap();


	// And we can draw something in the drawing area
	chart.draw_series(LineSeries::new(
		v_profile,
		&RED,
	)).unwrap()
		 .label("Velocity m/s")
		 .legend(|(x, y)| PathElement::new(vec![(x, y), (x + (WIDTH / 50) as i32, y)], &RED));


	chart.draw_series(LineSeries::new(
		a_profile,
		&BLUE,
	)).unwrap()
		 .label("Acceleration m/s²")
		 .legend(|(x, y)| PathElement::new(vec![(x, y), (x + (WIDTH / 50) as i32, y)], &BLUE));


	chart.draw_series(LineSeries::new(
		d_profile,
		&GREEN,
	)).unwrap()
		 .label(format!("Distance m / {DISTANCE_FACTOR}"))
		 .legend(|(x, y)| PathElement::new(vec![(x, y), (x + (WIDTH / 50) as i32, y)], &GREEN));


	chart.draw_series(LineSeries::new(
		vec![(0.0, 0.0), (WIDTH as f32 * TIMESTEP.powi(-1) as f32, 0.0)],
		&text_color,
	)).unwrap();

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

	chart.configure_series_labels()
		 .border_style(&text_color)
		 .background_style(&background_color.mix(0.8))
		 .legend_area_size(WIDTH / 40)
		 .label_font(text(50))
		 .draw().unwrap();
}