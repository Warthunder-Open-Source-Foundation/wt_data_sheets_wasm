import {core_loop} from "../pkg";
import {get_indicators, get_state} from "./localhost";

async function main() {
	// fetching at faster intervals causes averages to become jumpy as small increments near 0 thanks to rounding
	let timeout = 1000;

	let interval = setInterval(async function () {
		const indicators_data = await get_indicators();
		const state_data = await get_state();

		if (indicators_data === null || state_data === null) {
			clearInterval(interval);
			console.log(indicators_data, state_data);
			document.getElementById("err_dialog").showModal();
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