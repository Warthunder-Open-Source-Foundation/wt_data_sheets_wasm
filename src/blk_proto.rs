use crate::util::{console_log, get_document};
use std::fs::File;
use wasm_bindgen::prelude::wasm_bindgen;
use wt_blk::binary::file::FileType;

#[wasm_bindgen]
pub fn detect_input(file_name: &str, file: &[u8]) {
    console_log("received file");

    let f_type = FileType::from_byte(file[0]).unwrap();
    console_log(&format!("{:?}", f_type));
}
