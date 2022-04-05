use std::{env, fs};
use std::path::Path;
use wt_datamine_extractor_lib::missile::missile::Missile;
use wt_datamine_extractor_lib::shell::compress::CompressedShells;
use wt_datamine_extractor_lib::shell::shells::Shell;
use wt_datamine_extractor_lib::thermal::thermals::Thermal;
use const_gen::{CompileConst, const_definition};

fn main() {
	let missiles: Vec<Missile> = {
		let json = include_str!("../wt_datamine_extractor/missile_index/all.json");
		let mut missiles: Vec<Missile> = serde_json::from_str(json).unwrap();
		missiles.sort_by_key(|d| d.name.clone());

		missiles
	};

	let thermals: Vec<Thermal> = {
		let json = include_str!("../wt_datamine_extractor/thermal_index/all.json");
		let mut thermals: Vec<Thermal> = serde_json::from_str(json).unwrap();
		thermals.sort_by_key(|d| d.name.clone());

		thermals
	};
	let shells: Vec<Shell> = {
		let json = include_str!("../wt_datamine_extractor/shell_index/compressed.json");
		let compressed_shells: CompressedShells = serde_json::from_str(json).unwrap();
		let mut shells = compressed_shells.decompress();
		shells.sort_by_key(|d| d.name.clone());

		shells
	};

	let out_dir = env::var_os("OUT_DIR").unwrap();
	let dest_path = Path::new(&out_dir).join("const_gen.rs");


	let const_declarations = vec! {
		// Here are type definitions for our enums and structs
		// above. Attributes from build.rs will not be preserved,
		// so we need to pass any we want in.
		"pub ".to_owned() + &const_definition!(Missile),
		"pub ".to_owned() + &const_definition!(Thermal),
		"pub ".to_owned() + &const_definition!(Shell),
		"pub ".to_owned() + &const_gen::const_declaration!(MISSILES = missiles),
		"pub ".to_owned() + &const_gen::const_declaration!(THERMALS = thermals),
		"pub ".to_owned() + &const_gen::const_declaration!(SHELLS = shells),
	}.join("\n");

	// Adding imports for enums and core structs
	let final_dec = "".to_owned() +
	"use wt_datamine_extractor_lib::missile::missile::SeekerType;\n" +
		"use wt_datamine_extractor_lib::thermal::thermals::Crew;\n" +
		"use wt_datamine_extractor_lib::thermal::thermals::VehicleType;\n" +
		"use wt_datamine_extractor_lib::shell::shells::ShellType;\n" +
		"use wt_datamine_extractor_lib::thermal::thermals::Sight;\n" +
		&const_declarations;

	fs::write(&dest_path, final_dec).unwrap();

	println!("cargo:rerun-if-changed=build.rs");
}