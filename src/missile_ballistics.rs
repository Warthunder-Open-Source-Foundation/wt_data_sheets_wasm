use std::ops::Range;
use plotters::prelude::*;
use plotters_canvas::CanvasBackend;
use wasm_bindgen::prelude::*;
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_ballistics_calc_lib::runner::generate;
use crate::MISSILES;
use crate::console_log;


const WIDTH: u32 = 3840;
const HEIGHT: u32 = 2160;

const TIMESTEP: f64 = 0.1;

// Scaling settings
const FONT_AXIS: u32 = ((WIDTH + HEIGHT) / 2) as u32;
const DIST_C: u32 = 100;

#[wasm_bindgen]
pub fn plot(id: &str, target_missile: &str) {
	let backend = CanvasBackend::new(id).expect("cannot find canvas");
	let size = backend.get_size();

	let root = backend.into_drawing_area();

	console_log(&format!("{:?}", size));

	let mut missile = &MISSILES[0];
	for item in MISSILES.iter() {
		if item.name == target_missile {
			missile = item;
		}
	};
	let missile = wt_datamine_extractor_lib::missile::missile::Missile::from(missile);

	let results = generate(&missile, &LaunchParameter {
		use_gravity: false,
		start_velocity: 343.0,
		distance_to_target: 0.0,
		target_speed: 0.0,
		altitude: 7000,
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
		d_profile.push((i.0 as f32, *i.1 / DIST_C as f64));
	}


	root.fill(&WHITE).unwrap();
	let root = root.margin(10, 10, 10, 10);


	let x_dim = 0f32..results.profile.sim_len as f32 * 1.1;
	let mut y_dim = -(results.min_a.abs() + 50.0).round()..(results.max_v + 50.0).round();

	// Catches weird edge case i dont even know how
	if y_dim.start.abs() + y_dim.end.abs() > 1000.0 {
		return;
		y_dim = 0.0..1000.0;
	}

	// After this point, we should be able to draw construct a chart context
	let mut chart = ChartBuilder::on(&root)
		// Set the size of the label region
		.x_label_area_size(20)
		.y_label_area_size(40)
		.set_label_area_size(LabelAreaPosition::Bottom, FONT_AXIS / 50)
		.set_label_area_size(LabelAreaPosition::Left, FONT_AXIS / 50)
		.caption(&format!("{}", &missile.localized), ("sans-serif", FONT_AXIS / 20))
		// Finally attach a coordinate on the drawing area and make a chart context
		.build_cartesian_2d(x_dim, y_dim).unwrap(); // Any y range >= 1000 breaks the tool


	// Then we can draw a mesh
	chart
		.configure_mesh()
		// We can customize the maximum number of labels allowed for each axis
		.x_labels(50)
		.y_labels(50)
		.x_desc("time in s")
		.x_label_style(("sans-serif", FONT_AXIS / 100))
		.y_label_style(("sans-serif", FONT_AXIS / 100))
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
		 .label(format!("Distance m / {DIST_C}"))
		 .legend(|(x, y)| PathElement::new(vec![(x, y), (x + (WIDTH / 50) as i32, y)], &GREEN));


	chart.draw_series(LineSeries::new(
		vec![(0.0, 0.0), (WIDTH as f32 * TIMESTEP.powi(-1) as f32, 0.0)],
		&BLACK,
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
		 .border_style(&BLACK)
		 .background_style(&WHITE.mix(0.8))
		 .legend_area_size(WIDTH / 40)
		 .label_font(("sans-serif", FONT_AXIS / 50))
		 .draw().unwrap();
}