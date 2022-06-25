export async function load_goatcounter() {
	let script = document.createElement("script");
	script.setAttribute("src", "count.js");
	script.setAttribute("data-goatcounter", "https://wt-flareflo.goatcounter.com/count");
	script.setAttribute("async", "");
	document.head.appendChild(script);
}

export function sort_universal_number(event) {
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

export function sort_universal_string(event, id) {
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

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function set_value_enter() {
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

export function input_manager(placeholder) {
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

export function sort_row_thermals(selector, ascending) {
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