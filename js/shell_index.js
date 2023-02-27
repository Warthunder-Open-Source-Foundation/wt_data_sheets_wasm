import init, {main_js, make_rows_from_shell, make_shell_options} from "../pkg";
import {sort_universal_number, sort_universal_string} from "./util";

async function main() {
	make_shell_options();
	make_rows_from_shell("ApFsDs");

	document.getElementById("select_ammo_type").addEventListener("input", function () {
		document.getElementById("tbody").innerHTML = "";
		make_rows_from_shell(document.getElementById("select_ammo_type").value);
	})

	for (const element of document.getElementsByClassName("sortable_str")) {
		element.addEventListener("click", event => {
			sort_universal_string(event, "tbody")
		})
	}
	for (const element of document.getElementsByClassName("sortable_n")) {
		element.addEventListener("click", event => {
			sort_universal_number(event)
		})
	}
}
init().finally(() => {
	main_js()
	main()
});