import {generate_tank_list, generate_thermal_options} from "../pkg";
import {input_manager, set_value_enter, sort_universal_string} from "./util";

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


	generate_thermal_options();

	input_manager("Select vehicle class");

	document.getElementById("dropdown").addEventListener("submit", function () {
		set_value_enter();
	});

	generate_tank_list()

	let sorted = false;
	document.getElementById("column_1").addEventListener("click", function () {
		sort_row_thermals("table_contents", sorted);
		sorted = !sorted;
	});

	for (const element of document.getElementsByClassName("sortable_str")) {
		element.addEventListener("click", event => {
			sort_universal_string(event, "table_contents")
		})
	}


	for (let i = 0; i < document.getElementsByClassName("selecto_0").length; i++) {
		document.getElementsByClassName("selecto_0")[i].addEventListener("click", (evt) => {
			switch (document.getElementById("ul_input").getAttribute("target_name")) {
				case "Helicopter":
					document.querySelector("html").style.setProperty("--show-heli", "table-row");
					document.querySelector("html").style.setProperty("--show-tank", "none");
					document.querySelector("html").style.setProperty("--show-aircraft", "none");
					break;
				case "Aircraft":
					document.querySelector("html").style.setProperty("--show-aircraft", "table-row");
					document.querySelector("html").style.setProperty("--show-heli", "none");
					document.querySelector("html").style.setProperty("--show-tank", "none");
					break;
				case "Tank":
					document.querySelector("html").style.setProperty("--show-tank", "table-row");
					document.querySelector("html").style.setProperty("--show-heli", "none");
					document.querySelector("html").style.setProperty("--show-aircraft", "none");
					break;
			}
		});
	}
}

function sort_row_thermals(selector, ascending) {
	let table = document.getElementById(selector);

	let elems = [];

	for (const numKey in table.childNodes) {
		let element = table.getElementsByClassName(numKey).item(0);
		if (element !== null) {
			elems[numKey] = element;
		}
	}

	let gen1 = [];
	let gen2 = [];
	let gen3 = [];
	let heli = [];
	let unknown = [];

	for (let i = 0; i < elems.length; i++) {
		let x = parseInt(elems[i].lastChild.innerHTML.split("x")[0]);

		if (x === 500) {
			gen1[gen1.length] = elems[i];
		} else if (x === 800) {
			gen2[gen2.length] = elems[i];
		} else if (x === 1200) {
			gen3[gen3.length] = elems[i];
		} else if (x === 1024) {
			heli[heli.length] = elems[i];
		} else {
			unknown[unknown.length] = elems[i];
		}
	}

	table.innerHTML = "";

	let total;
	if (ascending) {
		total = gen1.concat(gen2, heli, gen3, unknown);

	} else {
		total = gen3.concat(heli, gen2, gen1, unknown);
	}
	for (let i = 0; i < total.length; i++) {
		table.appendChild(total[i]);
	}
}

main()