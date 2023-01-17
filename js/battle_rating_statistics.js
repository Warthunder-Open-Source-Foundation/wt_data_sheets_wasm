import {sleep} from "./util";
import {display_br, main_js} from "../pkg";


async function main() {
	while (true) {
		await fetch("http://localhost:8111/hudmsg?lastEvt=0&lastDmg=0").then(function (response) {
			return response.json();

		}).then(function (data) {
			let reversed = data.damage.reverse();
			let highest = Number.MAX_VALUE;
			let remainder = [];
			for (const reversedElement of reversed) {
				if (reversedElement.time <= highest) {
					highest = reversedElement.time;
					remainder.push(reversedElement.msg);
				} else
					break;
			}
			let total = "";
			for (const msg of remainder) {
				if (msg.includes("(") && msg.includes(")")) {
					let aircraft = msg.split("(")[1].split(")")[0];
					total = total.concat(`${aircraft}\n`);
				}
			}
			display_br(total);
		}).catch(function (error) {
			console.log("error: " + error);
		});
		await sleep(1000);
	}
}
main_js()
main()