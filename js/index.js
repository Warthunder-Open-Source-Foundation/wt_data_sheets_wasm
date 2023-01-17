import {load_goatcounter} from "./util";

async function main() {
	let refreshing;
	navigator.serviceWorker.addEventListener('controllerchange',
		function () {
			if (refreshing) return;
			refreshing = true;
			window.location.reload();
		}
	);

	let url = window.location.href.split("/").at(-1);

	if (window.location.href.includes("https://wt.flareflo.dev")) {
		await load_goatcounter();
	}

	if (window.location.href.includes("nightly")) {
		console.info("ENABLING NIGHTLY MODE");
		document.querySelector("html").style.setProperty("--background-image-red", "linear-gradient(120deg, #8d8d8d, #343434)");
		document.querySelector("html").style.setProperty("--color-background", "url(WIP.png)");
	}

	// main_js();
}

main();