async function main() {

	let rust;

	let url = window.location.href.split("/").at(-1)

	// Custom section for each page to make sure it runs properly
	if (url == "") {
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
		rust = await import ("../pkg/index.js").catch(console.error);
		rust.generate_targets();

		let missile_select = document.getElementById("missile_select");

		missile_select.addEventListener('change', async (e) => {
			let target = e.target;
			while (true) {
				let do_splash = document.getElementById("use_splash").checked;
				await fetch("http://localhost:8111/state").then(function (response) {
					return response.json();

				}).then(function (data) {
					if (data["valid"] === true) {
						let velocity = data["IAS, km/h"];
						let alt = data["H, m"];
						rust.constant_calc(velocity, alt, parseInt(target.value), do_splash);
					}

				}).catch(function (error) {
					console.log("error: " + error);
				});
				await sleep(50);
			}
		})
	}
	if (url == "compare.html") {
		rust = await import ("../pkg/index.js").catch(console.error);
		rust.make_comparison();
	}

	rust.console_log("This is rust!");

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

main();