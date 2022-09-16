use std::{env, fs};
use std::path::Path;
use wt_datamine_extractor_lib::missile::missile::Missile;
use wt_datamine_extractor_lib::shell::shells::Shell;
use wt_datamine_extractor_lib::thermal::thermals::Thermal;
use const_gen::{CompileConst, const_definition};

fn main() {
	let missiles: Vec<Missile> = {
		let json = include_str!("wt_datamine_extractor/missile_index/all.json");
		let mut missiles: Vec<Missile> = serde_json::from_str(json).unwrap();
		missiles.sort_by_key(|d| d.name.clone());

		missiles
	};

	let out_dir = env::var_os("OUT_DIR").unwrap();
	let dest_path = Path::new(&out_dir).join("const_gen.rs");


	let const_declarations = vec! {
		// Here are type definitions for our enums and structs
		// above. Attributes from build.rs will not be preserved,
		// so we need to pass any we want in.
		const_definition!(pub Missile),
		const_gen::const_declaration!(pub MISSILES = missiles),
	}.join("\n");

	// Adding imports for enums and core structs
	let final_dec = "".to_owned() +
		"use wt_datamine_extractor_lib::missile::missile::SeekerType;\n" +
		&const_declarations;

	fs::write(&dest_path, final_dec).unwrap();

	println!("cargo:rerun-if-changed=build.rs");
}