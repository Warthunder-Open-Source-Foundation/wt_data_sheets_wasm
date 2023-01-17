import {main_js, run_proto} from "../pkg";

async function main() {
	let c = 0;
	const timer = 1000 / 30;
	const interval = setInterval(function() {
		run_proto(c);
		c++;
	}, timer);
}
main_js()
main()