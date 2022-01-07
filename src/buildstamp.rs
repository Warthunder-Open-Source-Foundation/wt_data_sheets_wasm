use std::collections::HashMap;
use chrono::{DateTime, NaiveDateTime, Utc};
use serde_json::Value;
use crate::BUILDSTAMP_RAW;

#[derive(serde::Deserialize, Debug)]
pub struct BuildStamp {
	pub date: i64,
	pub formatted: String,
}

impl BuildStamp {
	pub fn from_const() -> Self {
		let map: HashMap<String, Value> = serde_json::from_str(BUILDSTAMP_RAW).unwrap();

		let stamp = map.get("date").unwrap().as_i64().unwrap();

		let naive = NaiveDateTime::from_timestamp(stamp / 1000, 0);
		let datetime: DateTime<Utc> = DateTime::from_utc(naive, Utc);
		let formatted = datetime.format("%Y-%m-%d %H:%M:%S").to_string();

		BuildStamp {
			date: stamp,
			formatted,
		}
	}
}