use std::sync::Mutex;
use lazy_static::lazy_static;
use wasm_bindgen::prelude::*;
use crate::{BOMB_MAP, get_document};
use crate::BOMBS;
use crate::console_log;
use std::sync::Arc;
use wt_datamine_extractor_lib::bombs::bombs::Bomb;

lazy_static! {
	static ref APP_STATE: Arc<Mutex<AppState>> = {
		Arc::new(Mutex::new(AppState::new()))
	};
}

struct AppState {
	total_tnt: f64,
}

impl AppState {
	pub fn new() -> Self {
		Self {
			total_tnt: 0.0,
		}
	}
}

#[wasm_bindgen]
pub fn render_bombs() {
	let state = APP_STATE.lock().unwrap();
	let document = get_document();
	let table = document.get_element_by_id("tbody").unwrap();

	let mut local_sorted = BOMBS.clone();
	local_sorted.sort_by_key(|bomb|bomb.explosive_mass.round() as u32);
	local_sorted.reverse();

	for bomb in local_sorted.iter() {
		// Filters out nukes and other outliers
		if bomb.explosive_equiv <= 1.0 {
			continue
		}

		let row = document.create_element("tr").unwrap();

		let new_field = |content: &str, classes: Option<Vec<(&str, &str)>>| {
			let item = document.create_element("td").unwrap();
			item.set_inner_html(&content);
			if let Some(attrs) = classes {
				for attr in attrs {
					item.set_attribute(attr.0, attr.1);
				}
			}
			row.append_child(&item);
		};

		row.set_attribute("name", &bomb.name);
		new_field(&bomb.name, None);
		new_field(&bomb.explosive_type.clone(), None);
		new_field(&bomb.explosive_mass.to_string(), None);
		new_field(&bomb.explosive_equiv.to_string(), None);
		new_field(&bomb.weight.to_string(), None);
		new_field(&format!("{:.2}", &bomb.explosive_equiv / &bomb.weight), None);
		new_field("+", Some(vec![("class", "add_btn"), ("name", &bomb.name)]));

		table.append_child(&row);
	}
}

#[wasm_bindgen]
pub fn render_calc(bomb: &str) {
	let mut state = APP_STATE.lock().unwrap();
	let document = get_document();

	let bomb: &Bomb = BOMB_MAP.get(bomb).unwrap();
	state.total_tnt += bomb.explosive_equiv;
	document.get_element_by_id("total_tnt").unwrap().set_inner_html(&format!("{} kg", state.total_tnt));
}