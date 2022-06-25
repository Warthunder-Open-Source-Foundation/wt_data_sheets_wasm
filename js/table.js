import {generate_main_tables, update_tables} from "../pkg";


async function main() {
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

main()