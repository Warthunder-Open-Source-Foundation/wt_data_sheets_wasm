/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 495:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UY: () => (/* binding */ sort_universal_number)
/* harmony export */ });
/* unused harmony exports load_goatcounter, sort_universal_string, sleep, set_value_enter, input_manager, getCookie, setCookie, indexed_db */
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


/***/ }),

/***/ 275:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "83784240eeb0861f8120.wasm";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			826: 0,
/******/ 			923: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ./pkg/index.js
let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
/**
*/
function make_shell_options() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.make_shell_options(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {string} selected
*/
function make_rows_from_shell(selected) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(selected, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.make_rows_from_shell(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {string} nation_filter
*/
function render_bombs(nation_filter) {
    const ptr0 = passStringToWasm0(nation_filter, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    wasm.render_bombs(ptr0, len0);
}

/**
* @param {string} bomb
*/
function render_calc(bomb) {
    const ptr0 = passStringToWasm0(bomb, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    wasm.render_calc(ptr0, len0);
}

/**
*/
function render_nations() {
    wasm.render_nations();
}

/**
*/
function generate_targets() {
    wasm.generate_targets();
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}
/**
* @param {number} velocity
* @param {number} alt
* @param {number} select
* @returns {(string)[]}
*/
function initiate_calc(velocity, alt, select) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.initiate_calc(retptr, velocity, alt, select);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_2(r0, r1 * 4, 4);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
*/
function main_js() {
    wasm.main_js();
}

/**
*/
function make_footer_data() {
    wasm.make_footer_data();
}

/**
*/
function run_compare() {
    wasm.run_compare();
}

/**
* @param {number} reference
* @param {number} contrary
* @param {boolean} show_equal
* @param {boolean} diff_mode
*/
function compare(reference, contrary, show_equal, diff_mode) {
    wasm.compare(reference, contrary, show_equal, diff_mode);
}

/**
*/
function generate_tank_list() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generate_tank_list(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
*/
function generate_thermal_options() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generate_thermal_options(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
*/
function render_table() {
    wasm.render_table();
}

/**
* @param {number} step
* @param {string} id
*/
function run_proto(step, id) {
    const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    wasm.run_proto(step, ptr0, len0);
}

/**
* @param {string} aircraft_raw
*/
function display_br(aircraft_raw) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(aircraft_raw, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.display_br(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} alt
* @param {number} vel
*/
function update_tables(alt, vel) {
    wasm.update_tables(alt, vel);
}

/**
* @param {boolean | undefined} is_ascending
* @param {string} row_to_sort_by
* @param {string} target_table_to_sort
*/
function generate_main_tables(is_ascending, row_to_sort_by, target_table_to_sort) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(row_to_sort_by, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(target_table_to_sort, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.generate_main_tables(retptr, isLikeNone(is_ascending) ? 0xFFFFFF : is_ascending ? 1 : 0, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {string} indicators
* @param {string} state
* @param {number} timeout
*/
function core_loop(indicators, state, timeout) {
    const ptr0 = passStringToWasm0(indicators, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(state, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    wasm.core_loop(ptr0, len0, ptr1, len1, timeout);
}

/**
* @param {string} message
*/
function console_log(message) {
    const ptr0 = passStringToWasm0(message, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    wasm.console_log(ptr0, len0);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {string} file_name
* @param {Uint8Array} file
*/
function detect_input(file_name, file) {
    const ptr0 = passStringToWasm0(file_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(file, wasm.__wbindgen_export_0);
    const len1 = WASM_VECTOR_LEN;
    wasm.detect_input(ptr0, len0, ptr1, len1);
}

/**
* @param {string} id
* @param {string} target_missile
* @param {number} altitude
* @param {number} start_velocity
* @param {string} canvas_background_color
* @param {string} canvas_text_color
*/
function plot(id, target_missile, altitude, start_velocity, canvas_background_color, canvas_text_color) {
    const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(target_missile, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(canvas_background_color, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(canvas_text_color, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len3 = WASM_VECTOR_LEN;
    wasm.plot(ptr0, len0, ptr1, len1, altitude, start_velocity, ptr2, len2, ptr3, len3);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {Uint8Array} plot_png
* @returns {Uint8Array}
*/
function export_zip(plot_png) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(plot_png, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.export_zip(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_2(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} altitude
* @param {number} start_velocity
* @returns {Uint8Array}
*/
function export_all_to_zip(altitude, start_velocity) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.export_all_to_zip(retptr, altitude, start_velocity);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_2(r0, r1 * 1, 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export_3(addHeapObject(e));
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_export_2(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_setinnerHTML_ea7e3c6a3c4790c6 = function(arg0, arg1, arg2) {
        getObject(arg0).innerHTML = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_getElementById_f56c8e6a15a6926d = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_beginPath_46864742afca3d8a = function(arg0) {
        getObject(arg0).beginPath();
    };
    imports.wbg.__wbg_setstrokeStyle_8c584cd9fa6fe055 = function(arg0, arg1) {
        getObject(arg0).strokeStyle = getObject(arg1);
    };
    imports.wbg.__wbg_moveTo_c946166c812bd616 = function(arg0, arg1, arg2) {
        getObject(arg0).moveTo(arg1, arg2);
    };
    imports.wbg.__wbg_lineTo_d568f4e620652516 = function(arg0, arg1, arg2) {
        getObject(arg0).lineTo(arg1, arg2);
    };
    imports.wbg.__wbg_stroke_c97a8fafa1b6f2ba = function(arg0) {
        getObject(arg0).stroke();
    };
    imports.wbg.__wbg_settextContent_cd38ea7d4e0f7260 = function(arg0, arg1, arg2) {
        getObject(arg0).textContent = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setid_b43ed506c9b1e9c5 = function(arg0, arg1, arg2) {
        getObject(arg0).id = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setclassName_972f4bd6262f9c17 = function(arg0, arg1, arg2) {
        getObject(arg0).className = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setfillStyle_98060f7b257936ba = function(arg0, arg1) {
        getObject(arg0).fillStyle = getObject(arg1);
    };
    imports.wbg.__wbg_closePath_b417e91d179f99c7 = function(arg0) {
        getObject(arg0).closePath();
    };
    imports.wbg.__wbg_fill_e279a178cb36bb43 = function(arg0) {
        getObject(arg0).fill();
    };
    imports.wbg.__wbg_width_53a5bd0268e99485 = function(arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_height_6fb32e51e54037ae = function(arg0) {
        const ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_strokeRect_c7078a2599bb05cf = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).strokeRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_fillRect_a5a5da573f0412b5 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_document_8554450897a855b9 = function(arg0) {
        const ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_log_b103404cc5920657 = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_arc_11d1da7b92e7ab3e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).arc(arg1, arg2, arg3, arg4, arg5);
    }, arguments) };
    imports.wbg.__wbg_setlineWidth_e98dce97a4e03908 = function(arg0, arg1) {
        getObject(arg0).lineWidth = arg1;
    };
    imports.wbg.__wbg_save_3cc576b49ad4c50d = function(arg0) {
        getObject(arg0).save();
    };
    imports.wbg.__wbg_translate_8d9423d4f949d7d6 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).translate(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_rotate_3ac6bb19a1c15c1c = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).rotate(arg1);
    }, arguments) };
    imports.wbg.__wbg_settextBaseline_4d2b8aebef4287a6 = function(arg0, arg1, arg2) {
        getObject(arg0).textBaseline = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settextAlign_7adfb5a00f7d1703 = function(arg0, arg1, arg2) {
        getObject(arg0).textAlign = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setfont_931e1f36bec6a342 = function(arg0, arg1, arg2) {
        getObject(arg0).font = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_fillText_ae0445d1930428dd = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_restore_f1e60b7a6baea463 = function(arg0) {
        getObject(arg0).restore();
    };
    imports.wbg.__wbg_self_3093d5d1f7bcb682 = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_3bcfc4d31bc012f8 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_86b222e13bdf32ed = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_e5a3fe56f8be9485 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_76313bd6ff35d0f2 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_1084a111329e68ce = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_body_b3bb488e8e54bf4b = function(arg0) {
        const ret = getObject(arg0).body;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_append_e2fc366a9f0be0e9 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).append(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlElement_ee6cb55e6b90ae79 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_offsetHeight_3fd383b839bb6c45 = function(arg0) {
        const ret = getObject(arg0).offsetHeight;
        return ret;
    };
    imports.wbg.__wbg_offsetWidth_e22a06cc87eb3cb2 = function(arg0) {
        const ret = getObject(arg0).offsetWidth;
        return ret;
    };
    imports.wbg.__wbg_remove_5b68b70c39041e2a = function(arg0) {
        getObject(arg0).remove();
    };
    imports.wbg.__wbg_stringify_bbf45426c92a6bf5 = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_1a96a01603ec2d8b = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLCanvasElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_getContext_69ec873410cbba3c = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_a0c4f0da6392b8ca = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof CanvasRenderingContext2D;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_createElement_5921e9eb06b9ec89 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_querySelector_e21c39150aa72078 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).querySelector(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setAttribute_d5540a19be09f8dc = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_appendChild_ac45d1abddf1b89b = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_Window_5012736c80a01584 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined' && Object.getPrototypeOf(module) === Object.prototype)
    ({module} = module)
    else
    console.warn('using deprecated parameters for `initSync()`; pass a single object instead')

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined' && Object.getPrototypeOf(module_or_path) === Object.prototype)
    ({module_or_path} = module_or_path)
    else
    console.warn('using deprecated parameters for the initialization function; pass a single object instead')

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL(/* asset import */ __webpack_require__(275), __webpack_require__.b);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}


/* harmony default export */ const pkg = (__wbg_init);

// EXTERNAL MODULE: ./js/util.js
var util = __webpack_require__(495);
;// CONCATENATED MODULE: ./js/bombing_table.js




async function main() {
	render_bombs("none");
	render_nations();
	const nation_select = document.getElementById("nation_select")
	nation_select.addEventListener("input", event => {
		render_bombs(nation_select.value);
		set_listeners_add();
	});

	for (const element of document.getElementsByClassName("sortable_n")) {
		element.addEventListener("click", event => {
			(0,util/* sort_universal_number */.UY)(event)
		})
	}

	set_listeners_add();
}

function set_listeners_add() {
	for (const element of document.getElementsByClassName("add_btn")) {
		element.addEventListener("click", event => {
			console.log("called")
			render_calc(event.target.attributes.name.value);
		})
	}
}
pkg().finally(() => {
	main_js()
	main()
});
})();

/******/ })()
;