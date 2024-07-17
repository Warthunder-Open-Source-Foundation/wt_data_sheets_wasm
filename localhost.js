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
/* unused harmony exports set_dialog_ready, get_state, get_indicators */
function set_dialog_ready() {
	let done_bttn = document.getElementById("done");
	done_bttn.addEventListener("click", function () {
		location.reload();
	});
	let exit_bttn = document.getElementById("exit");
	exit_bttn.addEventListener("click", function () {
		window.location = "/";
	});
}


async function get_local(url) {
	let result = null;
	await fetch(url).then(async function (res) {
		result = await res.json();
	}).catch(function (err) {
		console.log(`Cannot request $url`);
		console.error(err);
		});
	return result;
}

async function get_state() {
	let res = await get_local("http://localhost:8111/state");
	return is_valid(res);
}

async function get_indicators() {
	let res = await get_local("http://localhost:8111/indicators");
	return is_valid(res)
}

function is_valid(data) {
	if (data === null || data === undefined) {
		console.error("Data is null or undefined!");
		return null;
	}
	if (data["valid"])  {
		return data;
	} else {
		console.error("Data is invalid!");
		return null;
	}
}
/******/ })()
;