use wt_datamine_extractor_lib::missile::missile::{Missile as WtMissile};
use crate::Missile;

impl From<&Missile> for WtMissile {
	fn from(m: &Missile) -> Self {
		Self {
			name: m.name.to_owned(),
			localized: m.localized.to_owned(),
			seekertype: m.seekertype,
			mass: m.mass,
			mass_end: m.mass_end,
			mass_end1: m.mass_end1,
			caliber: m.caliber,
			force0: m.force0,
			force1: m.force1,
			timefire0: m.timefire0,
			timefire1: m.timefire1,
			cxk: m.cxk,
			dragcx: m.dragcx,
			timelife: m.timelife,
			endspeed: m.endspeed,
			exp_mass: m.exp_mass,
			pfuse: m.pfuse,
			loadfactormax: m.loadfactormax,
			reqaccelmax: m.reqaccelmax,
			bands: m.bands,
			fov: m.fov,
			gate: m.gate,
			lockanglemax: m.lockanglemax,
			anglemax: m.anglemax,
			minangletosun: m.minangletosun,
			warmuptime: m.warmuptime,
			worktime: m.worktime,
			cageable: m.cageable,
			rate_max: m.rate_max,
			inertial_navigation: m.inertial_navigation,
			use_target_vel: m.use_target_vel,
			deltav: m.deltav
		}
	}
}