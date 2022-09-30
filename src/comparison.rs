use wasm_bindgen::prelude::*;
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;

use crate::{make_missile_option_inputs, MISSILES};
use crate::util::{get_document, make_row_ir, make_row_params};

#[wasm_bindgen]
pub fn run_compare() {
	make_missile_option_inputs("ul_input", "li", Some("select_0"));
}

#[wasm_bindgen]
#[allow(clippy::let_underscore_drop, clippy::missing_panics_doc)]
pub fn compare(reference: usize, contrary: usize, show_equal: bool, diff_mode: bool) {
	let document = get_document();

	let selection_area = document.get_element_by_id("selection_area").unwrap();
	let table = document.get_element_by_id("comparison").unwrap();

	let ref_missile = &MISSILES[reference];
	let contrary_missile = &MISSILES[contrary];

	let ref_row = make_row_ir(&ref_missile, &LaunchParameter::new_from_default_hor());
	let con_row = make_row_ir(&contrary_missile, &LaunchParameter::new_from_default_hor());
	let params = make_row_params();
	for i in 0..17 {
		let tr = document.create_element("tr").unwrap();

		let ref_value = ref_row[i].clone();
		let mut con_value = con_row[i].clone();
		let param_value = &params[i];

		if ref_value == con_value && !show_equal {
			continue;
		}

		if diff_mode {
			if let Ok(ref_number) = ref_value.parse::<i32>() {
				if let Ok(con_number) = con_value.parse::<i32>() {
					let num = con_number - ref_number;
					if num < 0 {
						con_value = format!("{}", num);
					} else {
						con_value = format!("+{}", num);
					}
				}
			}
		}

		let ref_cell = document.create_element("td").unwrap();
		if ref_value == "0" {
			ref_cell.set_text_content(Some("-"));
		} else {
			ref_cell.set_text_content(Some(&ref_value.to_string()));
		}


		let cont_cell = document.create_element("td").unwrap();
		if con_value == "0" {
			cont_cell.set_text_content(Some("-"));
		} else {
			cont_cell.set_text_content(Some(&con_value.to_string()));
		}
		let param_cell = document.create_element("td").unwrap();
		param_cell.set_text_content(Some(&param_value.to_string()));

		let _ = tr.append_child(&param_cell);
		let _ = tr.append_child(&ref_cell);
		let _ = tr.append_child(&cont_cell);

		let _ = table.append_child(&tr);
	}


	selection_area.append_child(&table).unwrap();
}