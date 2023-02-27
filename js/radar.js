import init, {main_js, render_table, run_proto} from "../pkg";

async function main() {
	render_table();


	let c = 0;
	const interval = setInterval(function() {
		for (const docElement of document.getElementsByClassName("canvas_scan")) {
			run_proto(c, docElement.id);
		}
		c++;
	}, 10);
}
init().finally(() => {
	main_js()
	main()
});