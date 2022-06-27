import {initiate_calc, plot, run_compare} from "../pkg";
import {input_manager, set_value_enter, sleep} from "./util";

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
		document.getElementById("altitude_value").innerText = "Altitude (meters): " + document.getElementById("altitude").value;
		call_ballistics();
	});

	document.getElementById("velocity").addEventListener("input", () => {
		document.getElementById("velocity_value").innerText = "Launch velocity (meters/second): " + document.getElementById("velocity").value;
		call_ballistics();
	});

	let canvas_scale = 1;
	let canvas_translate = (0, 0);
	let canvas = document.getElementById("ballistics");
	let c = canvas.getContext("2d");
	let width = canvas.width;
	let height = canvas.height;

	document.getElementById("zoom_in").addEventListener("click", () => {
		zoom_level(2);
	});

	document.getElementById("zoom_out").addEventListener("click", () => {
		zoom_level(0.5);
	});

	document.getElementById("zoom_reset").addEventListener("click", () => {
		c.reset();
		canvas_scale = 1;
		canvas_translate = (0, 0);
		call_ballistics();
	});

	document.getElementById("color_select").addEventListener("change", () => {
		call_ballistics();
	})

	let live_mode = document.getElementById("use_live_mode")
	live_mode.addEventListener("input", run_live_mode)

	async function run_live_mode() {
		while (live_mode.checked === true) {
			console.time()
			let start = new Date().getTime();
			await fetch("http://localhost:8111/state").then(function (response) {
				return response.json();
			}).then(function (data) {
				let target = document.getElementById("ul_input").getAttribute("selected");
				if (data["valid"] === true && !(target === "")) {
					let velocity = Math.round(data["IAS, km/h"] / 3.6);
					let alt = data["H, m"];

					call_ballistics();

					document.getElementById("altitude").value = alt;
					document.getElementById("altitude_value").innerText = "Altitude (meters): " + alt;

					document.getElementById("velocity").value = velocity;
					document.getElementById("velocity_value").innerText = "Launch velocity (meters/second): " + velocity;
				}

			}).catch(function (error) {
				console.log("error: " + error);
				live_mode.checked =  false;
				alert("Game is not in a match/open or responding");
			});
			let stop = new Date().getTime();
			if (stop - start < 40) {
				await sleep(40 - stop - start);
			}
			console.timeEnd()
		}
	}

	function zoom_level(amount) {
		let old_scale = canvas_scale;
		canvas_scale *= amount;
		if (canvas_scale < 1) {
			canvas_scale = 1;
			return;
		}
		c.scale(amount, amount);
		call_ballistics();
		translate_center(old_scale, amount);
	}

	function translate_center(old_scale, amount) {
		// Saves translation matrix, wipes canvas, and restores scaling
		c.save();
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.clearRect(0, 0, width, height);
		c.restore();

		let translate_x = width / old_scale / amount;
		let translate_y = height / old_scale / amount;

		if (amount > 1) {
			translate_y = -translate_y;
			translate_x = -translate_x;
		}
		c.translate(translate_x, translate_y);
		call_ballistics();
	}
}

function call_ballistics() {
	let theme_selection = document.getElementById("color_select").value;
	let background_color;
	let text_color;
	switch (parseInt(theme_selection)) {
		case 0:
			background_color = "#282828";
			text_color = "#FFFFFF";
			break;
		case 1:
			background_color = "#000000";
			text_color = "#FFFFFF";
			break;
		case 2:
			background_color = "#FFFFFF";
			text_color = "#000000";
			break;
	}
	let altitude = document.getElementById("altitude").value;
	let velocity = document.getElementById("velocity").value;
	let target =document.getElementById("ul_input").getAttribute("target_name");
	if (target !== undefined) {
		plot("ballistics", target, parseInt(altitude), parseInt(velocity), hex_to_rgb(background_color).join("_"), hex_to_rgb(text_color).join("_"));
	} else{
		alert("No missile selected")
	}
}

function hex_to_rgb(hex) {
	return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
}

main();