use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct State {
    #[serde(alias = "Mfuel0, kg")]
    pub total_fuel: f64,
    #[serde(alias = "thrust 1, kgs")]
    pub thrust_0: f64,
    #[serde(alias = "thrust 2, kgs")]
    pub thrust_1: Option<f64>,
    #[serde(alias = "throttle 1, %")]
    pub throttle: u64,
}
