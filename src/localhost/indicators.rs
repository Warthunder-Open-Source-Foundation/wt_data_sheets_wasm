use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Indicators {
    #[serde(alias = "fuel")]
    pub fuel_mass: f64,
}
