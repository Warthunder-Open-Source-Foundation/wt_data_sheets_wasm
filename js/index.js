async function main() {

	let rust;

	let url = window.location.href.split("/").at(-1)

	// Custom section for each page to make sure it runs properly
	if (url == "") {
		rust = await import ("../pkg/index.js").catch(console.error);
	}

	if (url == "live_calc.html") {
		rust = await import ("../pkg/index.js").catch(console.error);
		rust.make_option_inputs();

		let missile_select = document.getElementById("missile_select");

		missile_select.addEventListener('change', async (e) => {
			let target = e.target;
			while (missile_select.value !== -1) {
				console.log(missile_select.value);
				let do_splash = document.getElementById("use_splash").checked;
				await fetch("http://localhost:8111/state").then(function (response) {
					return response.json();

				}).then(function (data) {
					let velocity = data["IAS, km/h"];
					let alt = data["H, m"];
					rust.constant_calc(velocity, alt, parseInt(target.value), do_splash);

				}).catch(function (error) {
					console.log("error: " + error);
				});
				await sleep(100);
			}
		})


	}


	rust.console_log("This is rust!");



	function fetch_stuff() {
		fetch("http://localhost:8111/indicators").then(function (myJson) {
			console.log(myJson);
		})
		fetch("http://localhost:8111/state").then(function (myJson) {
			console.log(myJson);
		})
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

main();