import init, {initiate_calc, main_js, run_compare} from "../pkg";
import {input_manager, set_value_enter, sleep} from "./util";

async function main() {
	await fetch('missile_select.html')
		.then(res => res.text())
		.then(text => {
			let oldelem = document.querySelector("script#add_missile_select");
			let newelem = document.createElement("div");
			newelem.innerHTML = text;
			oldelem.replaceWith(newelem, oldelem);
		});
	document.getElementById("dropdown").addEventListener("submit", set_value_enter);
	run_compare();
	input_manager("Select missile");

	let range_element = document.getElementById("range");
	let splash_at_element = document.getElementById("splash_at");
	while (true) {
		await fetch("http://localhost:8111/state").then(function (response) {
			return response.json();

		}).then(function (data) {
			let target = document.getElementById("ul_input").getAttribute("selected");
			if (data["valid"] === true && !(target === "")) {
				let velocity = data["IAS, km/h"];
				let alt = data["H, m"];
				let results = initiate_calc(velocity, alt, parseInt(target), range_element, splash_at_element);
				range_element.innerText = results[0];
				splash_at_element.innerText = results[1];
			}

		}).catch(function (error) {
			console.log("error: " + error);
		});
		await sleep(16);
	}
}
init().finally(() => {
	main_js()
	main()
});