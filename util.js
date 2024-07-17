/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/* unused harmony exports load_goatcounter, sort_universal_number, sort_universal_string, sleep, set_value_enter, input_manager, getCookie, setCookie, indexed_db */
async function load_goatcounter() {
	let script = document.createElement("script");
	script.setAttribute("src", "count.js");
	script.setAttribute("data-goatcounter", "https://wt-flareflo.goatcounter.com/count");
	script.setAttribute("async", "");
	document.head.appendChild(script);
}

function sort_universal(event, cmp) {
	let table = document.getElementById("tbody");
	let rows = Array.from(table.rows);
	
	let isSorted = rows.every((e, i, a) => {
		return !i || cmp(a[i - 1], e) <= 0;
	}) || rows.every((e, i, a) => {
		return !i || cmp(a[i - 1], e) >= 0;
	});

	if (isSorted) {
		rows = rows.reverse();
	} else {
		rows.sort(cmp);
	}

	rows.forEach((a) => {
		table.appendChild(a);
	});

}

function sort_universal_number(event) {
	if (event.target.getAttribute("class") !== "sortable_n") {
		return;
	}
	let n = event.target.cellIndex;

	let cmp = (a, b) => {
		let aVal = Number(a.getElementsByTagName("TD")[n].innerHTML);
		let bVal = Number(b.getElementsByTagName("TD")[n].innerHTML);

		if (aVal < bVal) return -1;
		if (aVal > bVal) return 1;
		return 0;
	};

	sort_universal(event, cmp);
}

function sort_universal_string(event, id) {
	if (event.target.getAttribute("class") !== "sortable_str") {
		return;
	}
	let n = event.target.cellIndex;

	let cmp = (a, b) => {
		let aVal = a.getElementsByTagName("TD")[n].innerHTML.toLowerCase();
		let bVal = b.getElementsByTagName("TD")[n].innerHTML.toLowerCase();

		if (aVal < bVal) return -1;
		if (aVal > bVal) return 1;
		return 0;
	};

	sort_universal(event, cmp);
}

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

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function indexed_db() {
	return "wt_data_sheets_wasm";
}

/******/ })()
;