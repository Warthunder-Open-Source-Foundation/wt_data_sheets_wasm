use crate::localhost::indicators::Indicators;
use crate::localhost::state::State;

pub mod state;
pub mod indicators;

pub fn all_from_req(indicators: &str, state: &str) -> Option<(Indicators, State)> {
	if !indicators.contains(r#""valid":true,"#) || !state.contains(r#""valid":true,"#) {
		return None;
	}

	let indicators: Indicators = serde_json::from_str(indicators).unwrap();
	let state: State = serde_json::from_str(state).unwrap();
	Some((indicators, state))
}