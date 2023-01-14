import {compare, main_js, run_compare} from "../pkg";
import {input_manager, set_value_enter} from "./util";

async function main() {
	await fetch('missile_select.html')
		.then(res => res.text())
		.then(text => {
			let oldelem = document.querySelector("script#select_0");
			let newelem = document.createElement("div");
			newelem.innerHTML = text;
			oldelem.replaceWith(newelem, oldelem);
		});

	run_compare(); // Creates input field options

	document.getElementById("dropdown").addEventListener("submit", set_value_enter);
	input_manager("Select missile");

	let identical = false;
	let identical_button = document.getElementById("show_identical");
	identical_button.addEventListener("change", function () {
		if (identical_button.value === "true") {
			identical = false;
			identical_button.value = "false";
			document.getElementById("label_show_identical").setAttribute("class", "un_checked"); // Css logic
		} else {
			identical = true;
			identical_button.value = "true";
			document.getElementById("label_show_identical").setAttribute("class", "checked"); // Css logic
		}
		invoke_compare();
	});

	let differences = false;
	let differences_button = document.getElementById("show_diff");
	differences_button.addEventListener("change", function () {
		if (differences_button.value === "true") {
			differences = false;
			differences_button.value = "false";
			document.getElementById("label_show_diff").setAttribute("class", "un_checked"); // Css logic
		} else {
			differences = true;
			differences_button.value = "true";
			document.getElementById("label_show_diff").setAttribute("class", "checked"); // Css logic
		}
		invoke_compare();
	});

	let reference;
	let contrary;
	document.getElementById("lock").addEventListener("click", function () {
		invoke_compare();
	});

	function invoke_compare() {
		if (document.getElementById("ul_input").getAttribute("selected") !== "") {
			document.getElementById("comparison").textContent = "";
			if (reference === undefined) {
				reference = document.getElementById("ul_input").getAttribute("selected");
				document.getElementById("lock").innerHTML = "Select another missile to compare to";
			} else {
				contrary = document.getElementById("ul_input").getAttribute("selected");
				compare(parseInt(reference), parseInt(contrary), identical, differences);
			}
		}
	}

	document.getElementById("reset").addEventListener("click", function () {
		reference = undefined;
		contrary = undefined;
		document.getElementById("comparison").textContent = "";
		document.getElementById("input_select").value = "";
		document.getElementById("ul_input").setAttribute("selected", "");
	});
}

main_js()
main()