import {create_aircraft_dropdown, output_selection, show_aircraft_loadout} from "../pkg";

async function main() {

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

main()