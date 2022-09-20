import {sleep} from "./util";
import {core_loop} from "../pkg";

async function main() {
	// Returns early when error, add else clause with warning later TODO
	if (!(await fetch("http://localhost:8111/state")).ok || !(await fetch("http://localhost:8111/indicators")).ok) {
		return;
	};

	let timeout = 250;

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

		core_loop(
			JSON.stringify(indicators_data),
			JSON.stringify(state_data),
			timeout
		);


	}, timeout);
}




main()