import {main_js, render_table, run_proto} from "../pkg";

async function main() {
	render_table();


	let c = 0;
	const timer = 1000 / 30;
	const interval = setInterval(function() {
		for (const docElement of document.getElementsByClassName("canvas_scan")) {
			run_proto(c, docElement.id);
		}
		c++;
	}, timer);
}
main_js()
main()