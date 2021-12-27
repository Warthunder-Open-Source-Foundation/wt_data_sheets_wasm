async function main() {
	let rust; // Yes its a weird assignment but the IDE likes it this way
	rust = await import ("../pkg/index.js").catch(console.error);

	let url = window.location.href.split("/").at(-1);

	if (window.location.href.includes("nightly")) {
		console.info("ENABLING NIGHTLY MODE")
		document.querySelector("html").style.setProperty("--background-image-red", "linear-gradient(120deg, #8d8d8d, #343434)");
		document.querySelector("html").style.setProperty("--color-background", "url(metafiles/WIP.png)");
	}

	// Custom section for each page to make sure it runs properly
	if (url.includes("table.html")) {
		rust.generate_main_tables();

		document.getElementById("vel").addEventListener("input", update);
		document.getElementById("alt").addEventListener("input", update);
		document.getElementById("run_calc").addEventListener("input", update);

		function update() {
			let alt = parseInt(document.getElementById("alt").value);
			let vel = parseInt(document.getElementById("vel").value);
			rust.update_tables(alt, vel);
		}

		document.getElementById("reset_values").addEventListener("click", (ev) => {
			document.getElementById("alt").value = "0";
			document.getElementById("vel").value = "343";
			rust.update_tables(0, 343);
		});
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
		rust.run_compare();
		input_manager("Select missile");
		while (true) {
			await fetch("http://localhost:8111/state").then(function (response) {
				return response.json();

			}).then(function (data) {
				let target = document.getElementById("ul_input").getAttribute("selected");
				if (data["valid"] === true && !(target === "")) {
					let velocity = data["IAS, km/h"];
					let alt = data["H, m"];
					rust.initiate_calc(velocity, alt, parseInt(target));
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

		rust.run_compare(); // Creates input field options

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
					rust.compare(parseInt(reference), parseInt(contrary), identical, differences);
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


		rust.generate_thermal_options();

		input_manager("Select vehicle class");

		document.getElementById("dropdown").addEventListener("submit", function () {
			set_value_enter();
		});

		rust.generate_tank_list()

		let sorted = false;
		document.getElementById("column_1").addEventListener("click", function () {
			sort_row_thermals("table_contents", sorted);
			sorted = !sorted;
		});


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

		rust.make_shell_options();

		document.getElementById("select_ammo_type").addEventListener("input", function () {
			document.getElementById("tbody").innerHTML = "";
			rust.make_rows_from_shell(document.getElementById("select_ammo_type").value);
		})

		for (const element of document.getElementsByClassName("sortable_str")) {
			element.addEventListener("click", event => {
				sort_universal_string(event)
			})
		}
		for (const element of document.getElementsByClassName("sortable_n")) {
			element.addEventListener("click", event => {
				sort_universal_number(event)
			})
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

	function sort_universal_string(event) {
		if (event.target.getAttribute("class") !== "sortable_str") {
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
				switchcount ++;
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
				switchcount ++;
			} else {
				if (switchcount === 0 && dir === "asc") {
					dir = "desc";
					switching = true;
				}
			}
		}
	}
}

main();

// GoatCounter: https://www.goatcounter.com
// This file (and *only* this file) is released under the ISC license:
// https://opensource.org/licenses/ISC
;(function() {
	'use strict';

	if (window.goatcounter && window.goatcounter.vars)  // Compatibility with very old version; do not use.
		window.goatcounter = window.goatcounter.vars
	else
		window.goatcounter = window.goatcounter || {}

	// Load settings from data-goatcounter-settings.
	var s = document.querySelector('script[data-goatcounter]')
	if (s && s.dataset.goatcounterSettings) {
		try         { var set = JSON.parse(s.dataset.goatcounterSettings) }
		catch (err) { console.error('invalid JSON in data-goatcounter-settings: ' + err) }
		for (var k in set)
			if (['no_onload', 'no_events', 'allow_local', 'allow_frame', 'path', 'title', 'referrer', 'event'].indexOf(k) > -1)
				window.goatcounter[k] = set[k]
	}

	var enc = encodeURIComponent

	// Get all data we're going to send off to the counter endpoint.
	var get_data = function(vars) {
		var data = {
			p: (vars.path     === undefined ? goatcounter.path     : vars.path),
			r: (vars.referrer === undefined ? goatcounter.referrer : vars.referrer),
			t: (vars.title    === undefined ? goatcounter.title    : vars.title),
			e: !!(vars.event || goatcounter.event),
			s: [window.screen.width, window.screen.height, (window.devicePixelRatio || 1)],
			b: is_bot(),
			q: location.search,
		}

		var rcb, pcb, tcb  // Save callbacks to apply later.
		if (typeof(data.r) === 'function') rcb = data.r
		if (typeof(data.t) === 'function') tcb = data.t
		if (typeof(data.p) === 'function') pcb = data.p

		if (is_empty(data.r)) data.r = document.referrer
		if (is_empty(data.t)) data.t = document.title
		if (is_empty(data.p)) data.p = get_path()

		if (rcb) data.r = rcb(data.r)
		if (tcb) data.t = tcb(data.t)
		if (pcb) data.p = pcb(data.p)
		return data
	}

	// Check if a value is "empty" for the purpose of get_data().
	var is_empty = function(v) { return v === null || v === undefined || typeof(v) === 'function' }

	// See if this looks like a bot; there is some additional filtering on the
	// backend, but these properties can't be fetched from there.
	var is_bot = function() {
		// Headless browsers are probably a bot.
		var w = window, d = document
		if (w.callPhantom || w._phantom || w.phantom)
			return 150
		if (w.__nightmare)
			return 151
		if (d.__selenium_unwrapped || d.__webdriver_evaluate || d.__driver_evaluate)
			return 152
		if (navigator.webdriver)
			return 153
		return 0
	}

	// Object to urlencoded string, starting with a ?.
	var urlencode = function(obj) {
		var p = []
		for (var k in obj)
			if (obj[k] !== '' && obj[k] !== null && obj[k] !== undefined && obj[k] !== false)
				p.push(enc(k) + '=' + enc(obj[k]))
		return '?' + p.join('&')
	}

	// Show a warning in the console.
	var warn = function(msg) {
		if (console && 'warn' in console)
			console.warn('goatcounter: ' + msg)
	}

	// Get the endpoint to send requests to.
	var get_endpoint = function() {
		var s = document.querySelector('script[data-goatcounter]')
		if (s && s.dataset.goatcounter)
			return s.dataset.goatcounter
		return (goatcounter.endpoint || window.counter)  // counter is for compat; don't use.
	}

	// Get current path.
	var get_path = function() {
		var loc = location,
			c = document.querySelector('link[rel="canonical"][href]')
		if (c) {  // May be relative or point to different domain.
			var a = document.createElement('a')
			a.href = c.href
			if (a.hostname.replace(/^www\./, '') === location.hostname.replace(/^www\./, ''))
				loc = a
		}
		return (loc.pathname + loc.search) || '/'
	}

	// Run function after DOM is loaded.
	var on_load = function(f) {
		if (document.body === null)
			document.addEventListener('DOMContentLoaded', function() { f() }, false)
		else
			f()
	}

	// Filter some requests that we (probably) don't want to count.
	goatcounter.filter = function() {
		if ('visibilityState' in document && document.visibilityState === 'prerender')
			return 'visibilityState'
		if (!goatcounter.allow_frame && location !== parent.location)
			return 'frame'
		if (!goatcounter.allow_local && location.hostname.match(/(localhost$|^127\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\.|^0\.0\.0\.0$)/))
			return 'localhost'
		if (!goatcounter.allow_local && location.protocol === 'file:')
			return 'localfile'
		if (localStorage && localStorage.getItem('skipgc') === 't')
			return 'disabled with #toggle-goatcounter'
		return false
	}

	// Get URL to send to GoatCounter.
	window.goatcounter.url = function(vars) {
		var data = get_data(vars || {})
		if (data.p === null)  // null from user callback.
			return
		data.rnd = Math.random().toString(36).substr(2, 5)  // Browsers don't always listen to Cache-Control.

		var endpoint = get_endpoint()
		if (!endpoint)
			return warn('no endpoint found')

		return endpoint + urlencode(data)
	}

	// Count a hit.
	window.goatcounter.count = function(vars) {
		var f = goatcounter.filter()
		if (f)
			return warn('not counting because of: ' + f)

		var url = goatcounter.url(vars)
		if (!url)
			return warn('not counting because path callback returned null')

		var img = document.createElement('img')
		img.src = url
		img.style.position = 'absolute'  // Affect layout less.
		img.style.bottom = '0px'
		img.style.width = '1px'
		img.style.height = '1px'
		img.loading = 'eager'
		img.setAttribute('alt', '')
		img.setAttribute('aria-hidden', 'true')

		var rm = function() { if (img && img.parentNode) img.parentNode.removeChild(img) }
		img.addEventListener('load', rm, false)
		document.body.appendChild(img)
	}

	// Get a query parameter.
	window.goatcounter.get_query = function(name) {
		var s = location.search.substr(1).split('&')
		for (var i = 0; i < s.length; i++)
			if (s[i].toLowerCase().indexOf(name.toLowerCase() + '=') === 0)
				return s[i].substr(name.length + 1)
	}

	// Track click events.
	window.goatcounter.bind_events = function() {
		if (!document.querySelectorAll)  // Just in case someone uses an ancient browser.
			return

		var send = function(elem) {
			return function() {
				goatcounter.count({
					event:    true,
					path:     (elem.dataset.goatcounterClick || elem.name || elem.id || ''),
					title:    (elem.dataset.goatcounterTitle || elem.title || (elem.innerHTML || '').substr(0, 200) || ''),
					referrer: (elem.dataset.goatcounterReferrer || elem.dataset.goatcounterReferral || ''),
				})
			}
		}

		Array.prototype.slice.call(document.querySelectorAll("*[data-goatcounter-click]")).forEach(function(elem) {
			if (elem.dataset.goatcounterBound)
				return
			var f = send(elem)
			elem.addEventListener('click', f, false)
			elem.addEventListener('auxclick', f, false)  // Middle click.
			elem.dataset.goatcounterBound = 'true'
		})
	}

	// Add a "visitor counter" frame or image.
	window.goatcounter.visit_count = function(opt) {
		on_load(function() {
			opt        = opt        || {}
			opt.type   = opt.type   || 'html'
			opt.append = opt.append || 'body'
			opt.path   = opt.path   || get_path()
			opt.attr   = opt.attr   || {width: '200', height: (opt.no_branding ? '60' : '80')}

			opt.attr['src'] = get_endpoint() + 'er/' + enc(opt.path) + '.' + enc(opt.type) + '?'
			if (opt.no_branding) opt.attr['src'] += '&no_branding=1'
			if (opt.style)       opt.attr['src'] += '&style=' + enc(opt.style)
			if (opt.start)       opt.attr['src'] += '&start=' + enc(opt.start)
			if (opt.end)         opt.attr['src'] += '&end='   + enc(opt.end)

			var tag = {png: 'img', svg: 'img', html: 'iframe'}[opt.type]
			if (!tag)
				return warn('visit_count: unknown type: ' + opt.type)

			if (opt.type === 'html') {
				opt.attr['frameborder'] = '0'
				opt.attr['scrolling']   = 'no'
			}

			var d = document.createElement(tag)
			for (var k in opt.attr)
				d.setAttribute(k, opt.attr[k])

			var p = document.querySelector(opt.append)
			if (!p)
				return warn('visit_count: append not found: ' + opt.append)
			p.appendChild(d)
		})
	}

	// Make it easy to skip your own views.
	if (location.hash === '#toggle-goatcounter') {
		if (localStorage.getItem('skipgc') === 't') {
			localStorage.removeItem('skipgc', 't')
			alert('GoatCounter tracking is now ENABLED in this browser.')
		}
		else {
			localStorage.setItem('skipgc', 't')
			alert('GoatCounter tracking is now DISABLED in this browser until ' + location + ' is loaded again.')
		}
	}

	if (!goatcounter.no_onload)
		on_load(function() {
			// 1. Page is visible, count request.
			// 2. Page is not yet visible; wait until it switches to 'visible' and count.
			// See #487
			if (!('visibilityState' in document) || document.visibilityState === 'visible')
				goatcounter.count()
			else {
				var f = function(e) {
					if (document.visibilityState !== 'visible')
						return
					document.removeEventListener('visibilitychange', f)
					goatcounter.count()
				}
				document.addEventListener('visibilitychange', f)
			}

			if (!goatcounter.no_events)
				goatcounter.bind_events()
		})
})();