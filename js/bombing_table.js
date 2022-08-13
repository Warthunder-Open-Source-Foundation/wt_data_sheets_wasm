import {render_bombs} from "../pkg";
import {sort_universal_number} from "./util";


async function main() {
	render_bombs();

	for (const element of document.getElementsByClassName("sortable_n")) {
		element.addEventListener("click", event => {
			sort_universal_number(event)
		})
	}
}

main()