use wasm_bindgen::prelude::*;
use web_sys::{Document, Window};
use wt_ballistics_calc_lib::launch_parameters::LaunchParameter;
use wt_missile_calc_lib::missiles::{Missile, SeekerType};

use crate::{console_log, make_option_inputs, MISSILES};
use crate::util::{get_document, make_row_ir, make_row_params, make_row_rd};

#[wasm_bindgen]
pub fn make_comparison() {
	make_option_inputs("ul_input", "li", Some("select_0"));
}

#[wasm_bindgen]
pub fn compare(reference: usize, contrary: usize, show_equal: bool) {
	console_log(&format!("{} {}", reference, contrary));

	let document = get_document();

	let selection_area = document.get_element_by_id("selection_area").unwrap();
	let table = document.create_element("table").unwrap();
	table.set_attribute("class", "ir_table");

	let ref_missile = &MISSILES[reference];
	let contrary_missile = &MISSILES[contrary];

	let ref_row = make_row_ir(&ref_missile, &LaunchParameter::new_from_default_hor());
	let con_row = make_row_ir(&contrary_missile, &LaunchParameter::new_from_default_hor());
	let params = make_row_params();
	for i in 0..17 {
		let tr = document.create_element("tr").unwrap();

		let ref_value = &ref_row[i];
		let con_value = &con_row[i];
		let param_value = &params[i];

		if ref_value == con_value && !show_equal {
			continue
		}

		let ref_cell = document.create_element("td").unwrap();
		if ref_value == "0" {
			ref_cell.set_text_content(Some("-"));
		} else {
			ref_cell.set_text_content(Some(&ref_value));
		}


		let cont_cell = document.create_element("td").unwrap();
		if con_value == "0" {
			cont_cell.set_text_content(Some("-"));
		} else {
			cont_cell.set_text_content(Some(&con_value));
		}
		let param_cell = document.create_element("td").unwrap();
		param_cell.set_text_content(Some(param_value));

		tr.append_child(&param_cell);
		tr.append_child(&ref_cell);
		tr.append_child(&cont_cell);

		table.append_child(&tr);
	}


	selection_area.append_child(&table).unwrap();
}