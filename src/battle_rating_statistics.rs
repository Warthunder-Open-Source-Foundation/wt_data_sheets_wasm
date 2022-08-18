use lazy_static::lazy_static;
use wasm_bindgen::prelude::*;
use std::collections::HashMap;
use wt_datamine_extractor_lib::battle_rating::battle_rating::VehicleBattleRating;


const BATTLE_RATINGS_RAW: &str = include_str!("../wt_datamine_extractor/battle_rating/all.json");

lazy_static! {
	static ref BATTLE_RATINGS: Vec<VehicleBattleRating> = {
		serde_json::from_str::<Vec<VehicleBattleRating>>(BATTLE_RATINGS_RAW).unwrap()
    };
    static ref LOCALE_TO_INGAME: HashMap<String, String> = {
		let map = HashMap::new();

		for

		map
    };
}

#[wasm_bindgen]
pub fn main_loop() {

}