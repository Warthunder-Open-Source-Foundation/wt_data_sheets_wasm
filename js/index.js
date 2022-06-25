import {
	compare,
	create_aircraft_dropdown,
	generate_main_tables,
	generate_tank_list,
	generate_thermal_options,
	initiate_calc,
	main_js,
	make_rows_from_shell,
	make_shell_options,
	output_selection,
	plot,
	run_compare,
	show_aircraft_loadout,
	update_tables
} from "../pkg";

async function main() {
	let refreshing;
	navigator.serviceWorker.addEventListener('controllerchange',
		function () {
			if (refreshing) return;
			refreshing = true;
			window.location.reload();
		}
	);

	let url = window.location.href.split("/").at(-1);

	if (window.location.href.includes("https://wt.flareflo.dev")) {
		load_goatcounter();
	}

	if (window.location.href.includes("nightly")) {
		console.info("ENABLING NIGHTLY MODE");
		document.querySelector("html").style.setProperty("--background-image-red", "linear-gradient(120deg, #8d8d8d, #343434)");
		document.querySelector("html").style.setProperty("--color-background", "url(WIP.png)");
	}

	main_js();

	// Custom section for each page to make sure it runs properly
	// I know ist bad but I haven't had time to fix it, you only get to complain about this to me when you make a PR to fix it
	if (url.includes("table.html")) {
		generate_main_tables();

		document.getElementById("vel").addEventListener("input", update);
		document.getElementById("alt").addEventListener("input", update);
		document.getElementById("run_calc").addEventListener("input", update);

		function update() {
			let alt = parseInt(document.getElementById("alt").value);
			let vel = parseInt(document.getElementById("vel").value);
			update_tables(alt, vel);
		}

		document.getElementById("reset_values").addEventListener("click", (ev) => {
			document.getElementById("alt").value = "1000";
			document.getElementById("vel").value = "343";
			update_tables(1000, 343);
		});


		// Takes about 1 milliseconds to compute on a plain build
		let tables = document.getElementsByClassName("missile_table");
		for (const table of tables) {
			iterate_inner_child(table);
		}

		// Iterates over children nodes of an element using recursion, sets their class to green or red given their boolean text value
		function iterate_inner_child(parent) {
			if (parent.tagName === "td") {
				if (parent.innerText === "true") {
					parent.classList.add("value_green");
				} else if (parent.innerText === "false") {
					parent.classList.add("value_red");
				}
			} else {
				let children = parent.children;
				if (children.length !== 0) {
					for (let i = 0; i < children.length; i++) {
						iterate_inner_child(children[i]);
					}
				}
			}
		}
	}

	if (url.includes("live_calc.html")) {
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

	if (url.includes("compare.html")) {
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

	if (url.includes("thermal_index.html")) {
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

	if (url.includes("shell_index.html")) {

		make_shell_options();
		make_rows_from_shell("ApFsDs");

		document.getElementById("select_ammo_type").addEventListener("input", function () {
			document.getElementById("tbody").innerHTML = "";
			make_rows_from_shell(document.getElementById("select_ammo_type").value);
		})

		for (const element of document.getElementsByClassName("sortable_str")) {
			element.addEventListener("click", event => {
				sort_universal_string(event, "tbody")
			})
		}
		for (const element of document.getElementsByClassName("sortable_n")) {
			element.addEventListener("click", event => {
				sort_universal_number(event)
			})
		}
	}

	if (url.includes("custom_loadout.html")) {

		let selected = [];

		create_aircraft_dropdown();
		show_aircraft_loadout(0);

		document.getElementById("aircraft").addEventListener("input", function () {
			show_aircraft_loadout(selectedAircraft());
			addSelectionListeners();
		});

		let selectable = document.getElementsByClassName("selectable");
		addSelectionListeners();

		document.getElementById("apply_choices").addEventListener("click", function () {
			output_selection(selected, selectedAircraft());
		});

		document.getElementById("reset_choices").addEventListener("click", function () {
			selected = [];
			for (let i = 0; i < selectable.length; i++) {
				selectable[i].classList.remove("selected");
			}

			let table = document.getElementById("loadout_screen");
			for (let i = 0; i < table.childNodes.length; i++) {
				const row = table.childNodes[i];
				const first_item = row.childNodes[1];
				first_item.classList.add("selected");
			}

			document.getElementById("cl_result").innerHTML = "";
		});

		function addSelectionListeners() {
			for (let i = 0; i < selectable.length; i++) {
				selectable[i].addEventListener("click", function (element, target) {
					let id = element.composedPath()[1].id;
					if (id === "") {
						id = element.composedPath()[0].id;
					}
					;
					let split = id.split("_");
					let col = parseInt(split[0]);

					// Disable selection for previously selected item
					let old_idx = selected[col];
					if (old_idx !== undefined) {
						let select = `${col}_${old_idx}`;
						let old = document.getElementById(select);
						old.classList.remove("selected");
					}

					let pre_selected = `${col}_0`;
					let empty = document.getElementById(pre_selected);
					if (empty !== null) {
						empty.classList.remove("selected");
					}
					// Finished cleaning up old selection


					// Add new selection to list
					selected[col] = parseInt(split[1]);
					document.getElementById(id).classList.add("selected");
				});
			}
		}

		function selectedAircraft() {
			let id = document.getElementById("aircraft").selectedOptions[0].getAttribute("index");
			return parseInt(id);
		}

	}

	if (url.includes("bombing_computer.html")) {
		while (true) {
			await fetch("http://localhost:8111/map_obj.json").then(function (response) {
				return response.json();

			}).then(function (data) {
				let base_count = document.getElementById("base_count");
				let string_data = JSON.stringify(data);
				base_count.innerText = (string_data.split("bombing_point").length - 1) / 2;

			}).catch(function (error) {
				console.log("error: " + error);
			});
			await sleep(1000);
		}
	}

	if (url.includes("missile_ballistics.html")) {
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
	}

	// Misc functions --------------------------------------------------------------------------------------------------

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function set_value_enter() {
		document.getElementById("ul_input").setAttribute("class", "value-list");
		let ul = document.getElementById("ul_input");
		let elems = ul.getElementsByClassName("select_0");
		for (var i = 0; i < elems.length; ++i) {
			if (!elems[i].className.includes("closed")) {
				document.getElementById("ul_input").setAttribute("selected", i.toString());
				document.getElementById("ul_input").setAttribute("target_name", elems[i].getAttribute("id"));
				document.getElementById("input_select").value = elems[i].getAttribute("id");
				break;
			}
		}
	}

	function input_manager(placeholder) {
		const inputField = document.querySelector(".chosen-value");
		const dropdown = document.querySelector(".value-list");
		const dropdownArray = [...document.querySelectorAll("#ul_input > li")];
		dropdown.classList.add("open");
		let valueArray = [];
		dropdownArray.forEach((item) => {
			valueArray.push(item.id);
		});

		inputField.addEventListener("input", () => {
			dropdown.classList.add("open");
			let inputValue = inputField.value.toLowerCase();
			if (inputValue.length > 0) {
				for (let j = 0; j < valueArray.length; j++) {
					let input = inputValue.toLowerCase().substring(0, inputValue.length);
					let refference = valueArray[j]
						.replace(valueArray[j].split("_")[0], '').replaceAll('_', '')
						.substring(0, inputValue.length).toLowerCase();
					if (!(input === refference)) {
						dropdownArray[j].classList.add("closed");
					} else {
						dropdownArray[j].classList.remove("closed");
					}
				}
			} else {
				for (let i = 0; i < dropdownArray.length; i++) {
					dropdownArray[i].classList.remove("closed");
				}
			}
		});

		dropdownArray.forEach((item) => {
			item.addEventListener("click", (env) => {
				document.getElementById("ul_input").setAttribute("selected", env.target.value);
				document.getElementById("ul_input").setAttribute("target_name", env.target.getAttribute("id"));
				inputField.value = item.textContent;
				dropdownArray.forEach((dropdown) => {
					dropdown.classList.add("closed");
				});
			});
		});

		inputField.addEventListener("focus", () => {
			// Resets values
			document.getElementById("input_select").value = "";
			document.getElementById("ul_input").setAttribute("target_name", "");
			document.getElementById("ul_input").setAttribute("selected", "");

			// Since it might not always be present
			let range = document.getElementById("range");
			if (range !== null) {
				range.innerHTML = "-";
				document.getElementById("splash_at").innerHTML = "-";
			}
			inputField.placeholder = "Type to filter";
			dropdown.classList.add("open");
			dropdownArray.forEach((dropdown) => {
				dropdown.classList.remove("closed");
			});
		});

		inputField.addEventListener("blur", () => {
			inputField.placeholder = placeholder;
			dropdown.classList.remove("open");
		});

		document.addEventListener("click", (evt) => {
			const isDropdown = dropdown.contains(evt.target);
			const isInput = inputField.contains(evt.target);
			if (!isDropdown && !isInput) {
				dropdown.classList.remove("open");
			}
		});
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

	function sort_universal_string(event, id) {
		if (event.target.getAttribute("class") !== "sortable_str") {
			console.log("Target is not a sortable_str");
			return;
		}
		let n = event.target.cellIndex;
		let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
		table = document.getElementById(id);
		switching = true;
		dir = "asc";
		while (switching) {
			switching = false;
			rows = table.rows;
			for (i = 0; i < (rows.length - 1); i++) {
				shouldSwitch = false;
				x = rows[i].getElementsByTagName("TD")[n];
				y = rows[i + 1].getElementsByTagName("TD")[n];
				if (dir === "asc") {
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				} else if (dir === "desc") {
					if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				}
			}
			if (shouldSwitch) {
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
				switchcount++;
			} else {
				if (switchcount === 0 && dir === "asc") {
					dir = "desc";
					switching = true;
				}
			}
		}
	}

	function sort_universal_number(event) {
		if (event.target.getAttribute("class") !== "sortable_n") {
			return;
		}
		let n = event.target.cellIndex;
		let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
		table = document.getElementById("tbody");
		switching = true;
		dir = "asc";
		while (switching) {
			switching = false;
			rows = table.rows;
			for (i = 0; i < (rows.length - 1); i++) {
				shouldSwitch = false;
				x = rows[i].getElementsByTagName("TD")[n];
				y = rows[i + 1].getElementsByTagName("TD")[n];
				if (dir === "asc") {
					if (Number(x.innerHTML) > Number(y.innerHTML)) {
						shouldSwitch = true;
						break;
					}
				} else if (dir === "desc") {
					if (Number(x.innerHTML) < Number(y.innerHTML)) {
						shouldSwitch = true;
						break;
					}
				}
			}
			if (shouldSwitch) {
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
				switchcount++;
			} else {
				if (switchcount === 0 && dir === "asc") {
					dir = "desc";
					switching = true;
				}
			}
		}
	}

	async function load_goatcounter() {
		let script = document.createElement("script");
		script.setAttribute("src", "count.js");
		script.setAttribute("data-goatcounter", "https://wt-flareflo.goatcounter.com/count");
		script.setAttribute("async", "");
		document.head.appendChild(script);
	}
}

main();