import {generate_main_tables, update_tables} from "../pkg";


async function main() {
	generate_main_tables();
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

	function showSliderValue(slider, bullet) {
		bullet.innerHTML = slider.value;
		const bulletPosition = (slider.value / slider.max);
		bullet.style.left = (bulletPosition * 280) + "px";
	}

	function update() {
		if(Date.now() - lastMove > 40) {
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
		if(Date.now() - lastMove > 40) {
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
}

main()