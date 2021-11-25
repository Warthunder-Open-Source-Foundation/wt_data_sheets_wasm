async function main() {

	let rust;

	let url = window.location.href.split("/").at(-1)

	// Custom section for each page to make sure it runs properly
	if (url == "table.html") {
		rust = await import ("../pkg/index.js").catch(console.error);
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
			}
		);
	}

	if (url == "live_calc.html") {
		await fetch('missile_select.html')
			.then(res => res.text())
			.then(text => {
				let oldelem = document.querySelector("script#add_missile_select");
				let newelem = document.createElement("div");
				newelem.innerHTML = text;
				oldelem.replaceWith(newelem, oldelem);
			});
		document.getElementById("dropdown").addEventListener("submit", set_value_enter);
		rust = await import ("../pkg/index.js").catch(console.error);
		rust.run_compare();
		input_manager();
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

		rust = await import ("../pkg/index.js").catch(console.error);
		rust.run_compare(); // Creates input field options

		document.getElementById("dropdown").addEventListener("submit", set_value_enter);
		input_manager();

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
				document.getElementById("ul_input").setAttribute("target_name", elems[i].innerHTML);
				document.getElementById("input_select").value = elems[i].innerHTML;
				break;
			}
		}
	}

	function input_manager() {
		const inputField = document.querySelector(".chosen-value");
		const dropdown = document.querySelector(".value-list");
		const dropdownArray = [...document.querySelectorAll("li")];
		dropdown.classList.add("open");
		let valueArray = [];
		dropdownArray.forEach((item) => {
			valueArray.push(item.textContent);
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
					if (
						!(
							input === refference
						)
					) {
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
				document.getElementById("ul_input").setAttribute("target_name", env.target.innerHTML);
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
			inputField.placeholder = "Select Missile";
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
}

main();