import {plot, run_compare} from "../pkg";
import {input_manager, set_value_enter} from "./util";

async function main() {
	await fetch('missile_select.html')
		.then(res => res.text())
		.then(text => {
			let oldelem = document.querySelector("script#select_0");
			let newelem = document.createElement("div");
			newelem.setAttribute("id", "div_input");
			newelem.innerHTML = text;
			oldelem.replaceWith(newelem, oldelem);
		});

	run_compare();
	input_manager("Select missile");

	let selector = document.getElementById("dropdown");
	selector.addEventListener("submit", () => {
		set_value_enter();
	});


	document.getElementById("ul_input").addEventListener("click", () => {
		call_ballistics();
	});

	document.getElementById("altitude").addEventListener("input", () => {
		document.getElementById("altitude_value").innerText = "Altitude: " + document.getElementById("altitude").value;
		call_ballistics();
	});

	document.getElementById("velocity").addEventListener("input", () => {
		document.getElementById("velocity_value").innerText = "Launch velocity: " + document.getElementById("velocity").value;
		call_ballistics();
	});

	document.getElementById("background_color").addEventListener("change", () => {
		document.getElementById("background_color_value").innerText = "Background color: ";
		call_ballistics();
	});
}

function call_ballistics() {
	let background_color = document.getElementById("background_color").value;
	let altitude = document.getElementById("altitude").value;
	let velocity = document.getElementById("velocity").value;
	let target =document.getElementById("ul_input").getAttribute("target_name");
	if (target !== undefined) {
		plot("ballistics", target, parseInt(altitude), parseInt(velocity), hex_to_rgb(background_color).join("_"));
	} else{
		alert("No missile selected")
	}
}

function hex_to_rgb(hex) {
	return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
}

main();