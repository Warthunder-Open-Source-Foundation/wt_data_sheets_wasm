use std::collections::HashMap;

use csv::{ReaderBuilder, Terminator};
use lazy_static::lazy_static;
use wasm_bindgen::prelude::*;
use wt_datamine_extractor_lib::battle_rating::battle_rating::VehicleBattleRating;
use wt_datamine_extractor_lib::battle_rating::battle_rating_def::BattleRating;

use crate::console_log;
use crate::get_document;

const BATTLE_RATINGS_RAW: &[u8] = include_bytes!("../wt_datamine_extractor/battle_rating/all.csv");

lazy_static! {
	static ref BATTLE_RATINGS: Vec<VehicleBattleRating> = {
		let mut reader = ReaderBuilder::default()
		.has_headers(false)
		.delimiter(b';')
		.terminator(Terminator::Any(b'\n'))
		.from_reader(BATTLE_RATINGS_RAW);

	let mut res: Vec<VehicleBattleRating> = vec![];
	for record in reader.records() {
		if let Ok(resulting_record) = record {
			if let Ok(deserialized) = resulting_record.deserialize(None) {
				res.push(deserialized);
			} else {
					console_log(&format!("Failed to serialize record, \"{:?}\"", resulting_record));
				}
		} else {
				console_log(&format!("Failed to get record, {:?}", record));
			}
	}
		res
    };
}

#[wasm_bindgen]
pub fn display_br(aircraft_raw: String) -> Result<(), JsValue> {
	let document = get_document();
	let elem = document.get_element_by_id("your_br").ok_or(JsValue::from_str("Cant find element your_br"))?;
	let aircraft = aircraft_raw.split('\n').collect::<Vec<&str>>();
	let mut result = HashMap::new();
	for air in aircraft {
		for vehicle in BATTLE_RATINGS.iter() {
			if vehicle.localized.contains(air) {
				if let Some(counter) = result.get_mut(&vehicle.realistic) {
					*counter += 1;
				} else {
					result.insert(vehicle.realistic, 0);
				}
				break;
			}
		}
	}

	let mut kv = result.drain().collect::<Vec<(BattleRating, usize)>>();
	drop(result);

	kv.sort_by_key(|x| x.1);
	kv.reverse();
	kv.retain(|x| x.1 != 0);

	let mut full = "".to_owned();
	for item in &kv {
		full.push_str(&format!("{}x {}\n", item.1, item.0.to_string()));
	}

	elem.set_inner_html(&full);

	if let Some(highest_br) = &kv.get(0) {
		let highest = document.get_element_by_id("highest_br").ok_or(JsValue::from_str("Cant find element highest_br"))?;
		highest.set_inner_html(&highest_br.0.to_string());
	}
	Ok(())
}