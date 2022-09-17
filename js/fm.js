import {sleep} from "./util";

async function main() {
	// Returns early when error, add else clause with warning later TODO
	if (!(await fetch("http://localhost:8111/state")).ok || !(await fetch("http://localhost:8111/indicators")).ok) {
		return;
	};

	let timeout = 1000;

	let last_fuel = 0;
	let avg_fuel = [0, 0, 0, 0, 0];

	let interval = setInterval(async function () {
		// Fetch data ------------------------------
		let state_data;
		let indicators_data;
		await fetch("http://localhost:8111/state").then(function (response) {
			return response.json();

		}).then(function (data) {
			state_data = data;

		}).catch(async function (error) {
			console.log("error: " + error);
			clearInterval(interval);
		});

		await fetch("http://localhost:8111/indicators").then(function (response) {
			return response.json();

		}).then(function (data) {
			indicators_data = data;

		}).catch(async function (error) {
			console.log("error: " + error);
			clearInterval(interval);
		});
		// Validate data ---------------------------------

		if (!(state_data["valid"] && indicators_data["valid"])) {
			console.log("Invalid data");
			return;
		}

		// Transform data ---------------------------------
		let throttle = state_data["throttle 1, %"];

		// Sets fuel consumption
		let fuel = indicators_data["fuel"];
		let fuel_s = (last_fuel - fuel) / (timeout / 1000);
		last_fuel = fuel;
		avg_fuel.push(fuel_s);
		avg_fuel.splice(0, 1);
		let averaged = avg_fuel.reduce((partialSum, a) => partialSum + a, 0) / avg_fuel.length;
		console.log(averaged);

	}, timeout);
}




main()