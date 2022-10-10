import {render_bombs, render_calc, render_nations} from "../pkg";
import {sort_universal_number} from "./util";


async function main() {
	render_bombs("none");
	render_nations();
	const nation_select = document.getElementById("nation_select")
	nation_select.addEventListener("input", event => {
		render_bombs(nation_select.value);
		set_listeners_add();
	});

	for (const element of document.getElementsByClassName("sortable_n")) {
		element.addEventListener("click", event => {
			sort_universal_number(event)
		})
	}

	set_listeners_add();
}

function set_listeners_add() {
	for (const element of document.getElementsByClassName("add_btn")) {
		element.addEventListener("click", event => {
			console.log("called")
			render_calc(event.target.attributes.name.value);
		})
	}
}
main()