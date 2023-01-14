import {main_js} from "../pkg";


async function main() {
	while (true) {
		await fetch("http://localhost:8111/map_obj.json").then(function (response) {
			return response.json();

		}).then(function (data) {
			let base_count = document.getElementById("base_count");
			let string_data = JSON.stringify(data);
			base_count.innerText = (string_data.split("bombing_point").length - 1) / 2;

		}).catch(function (error) {
			console.log("error: " + error);
		});
		await sleep(1000);
	}
}
main_js()
main()