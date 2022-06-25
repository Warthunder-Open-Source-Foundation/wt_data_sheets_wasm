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
}

main();