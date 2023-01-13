import {generate_main_tables, update_tables} from "../pkg";


async function main() {
	// Validate URL against referrer
	const urlParams = new URL(window.location.href).searchParams;
	let ir = urlParams.get("ir");
	let sarh = urlParams.get("sarh");
	let arh = urlParams.get("arh");

	const prompt = document.getElementById("dialog_missiles");

	const missile_buttons = document.getElementsByClassName("missile_class_btn");
	for (const missileButton of missile_buttons) {
		missileButton.addEventListener("click", () => {
			switch (missileButton.dataset.type) {
				case "ir":
					ir = "true";
					break;
				case "sarh":
					sarh = "true";
					break;
				case "arh":
					arh = "true";
					break;
				default:
					console.log("bad missile param" + missileButton.dataset.type);
			}

			// Updates URL for sharing
			urlParams.append(missileButton.dataset.type, "true")
			const next_url = window.location  + "?" + urlParams.toString();
			const next_title = 'Missile sheet';
			const next_state = {additionalInformation: 'Missile category'};

			window.history.replaceState(next_state, next_title, next_url);

			table_check();
			prompt.close();
		})
	}

	table_check();

	function table_check() {
		if (ir == null && sarh == null && arh == null) {
			prompt.showModal();
		} else {
			hide_if_null(ir, "ir_table");
			hide_if_null(sarh, "sarh_table");
			hide_if_null(arh, "arh_table");
		}
	}


	function hide_if_null(elem, id) {
		if (elem !== "true") {
			document.getElementById(id).classList.add("invisible");
		}
	}

	// Add sorting buttons and icons to sortable rows

	const up_arrow = "↑";
	const down_arrow = "↓";
	const sortables = document.getElementsByClassName("sort");
	for (const sortable of sortables) {
		let node = document.createElement('p');
		node.classList.add("sortable_button")
		node.innerText = "-";

		node.addEventListener("click", (e) => {
			const target = e.target;

			switch (target.innerText) {
				case "-":
					reset_sortable();
					target.innerText = up_arrow;
					clear_tables();
					generate_main_tables(true, target.parentElement.dataset.type);
					break;
				case up_arrow:
					reset_sortable();
					target.innerText = down_arrow;
					clear_tables();
					generate_main_tables(false, target.parentElement.dataset.type);

					break;
				case down_arrow:
					reset_sortable();
					target.innerText = up_arrow;
					clear_tables();
					generate_main_tables(true, target.parentElement.dataset.type);
					break;
			}


		});
		sortable.appendChild(node);
	}

	function reset_sortable() {
		for (const elem of document.getElementsByClassName("sortable_button")) {
			elem.innerText = "-";
		}
	}

	function clear_tables() {
		clear_table(document.getElementById("ir_table"));
		clear_table(document.getElementById("sarh_table"));
		clear_table(document.getElementById("arh_table"));
	}

	function clear_table(table) {
		let tableHeaderRowCount = 1;
		let rowCount = table.rows.length;
		for (let i = tableHeaderRowCount; i < rowCount; i++) {
			table.deleteRow(tableHeaderRowCount);
		}
	}


	generate_main_tables(null, "");
	let lastMove = 0;

	const vel_slider = document.getElementById("vel_slider");
	const vel_bullet = document.getElementById("vel");
	vel_slider.addEventListener("input", update_slider, false);
	vel_bullet.addEventListener("input", update, false);

	const alt_slider = document.getElementById("alt_slider");
	const alt_bullet = document.getElementById("alt");
	alt_slider.addEventListener("input", update_slider, false);
	alt_bullet.addEventListener("input", update, false);

	// Sets sliders to initial positions
	showSliderValue(alt_slider, alt_bullet);
	showSliderValue(vel_slider, vel_bullet);

	document.getElementById("reset_values").addEventListener("click", (ev) => {
		alt_bullet.value = "1000";
		alt_slider.value = "1000";

		vel_bullet.value = "343";
		vel_slider.value = "343";

		// Sets sliders to initial positions
		showSliderValue(alt_slider, alt_bullet);
		showSliderValue(vel_slider, vel_bullet);
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

	function showSliderValue(slider, bullet) {
		bullet.innerHTML = slider.value;
		const bulletPosition = (slider.value / slider.max);
		bullet.style.left = (bulletPosition * 280) + "px";
	}

	function update() {
		if (Date.now() - lastMove > 40) {
			lastMove = Date.now();
		} else {
			return;
		}

		let alt = Math.min(parseInt(alt_bullet.value), 10000);
		let vel = Math.min(parseInt(vel_bullet.value), 1000);
		vel_slider.value = vel;
		alt_slider.value = alt;
		// Set values as the limiting max function prevents too large values
		vel_bullet.value = vel;
		alt_bullet.value = alt;
		showSliderValue(alt_slider, alt_bullet);
		showSliderValue(vel_slider, vel_bullet);
		update_tables(alt, vel);
	}

	function update_slider() {
		if (Date.now() - lastMove > 40) {
			lastMove = Date.now();
		} else {
			return;
		}

		let alt = parseInt(alt_slider.value);
		let vel = parseInt(vel_slider.value);
		vel_bullet.value = vel;
		alt_bullet.value = alt;
		showSliderValue(alt_slider, alt_bullet);
		showSliderValue(vel_slider, vel_bullet);
		update_tables(alt, vel);
	}
}

main()