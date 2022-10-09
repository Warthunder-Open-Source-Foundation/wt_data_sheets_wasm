import {render_bombs, render_calc} from "../pkg";
import {sort_universal_number} from "./util";


async function main() {
	render_bombs();

	for (const element of document.getElementsByClassName("sortable_n")) {
		element.addEventListener("click", event => {
			sort_universal_number(event)
		})
	}

	for (const element of document.getElementsByClassName("add_btn")) {
		element.addEventListener("click", event => {
			render_calc(event.target.attributes.name.value);
		})
	}
}

main()