async function main() {
	setInterval(async function () {
		await fetch("http://localhost:8111/state").then(function (response) {
			return response.json();

		}).then(function (data) {
			let target = document.getElementById("ul_input").getAttribute("selected");
			if (data["valid"] === true && !(target === "")) {
				let velocity = data["IAS, km/h"];
				let alt = data["H, m"];
			}

		}).catch(function (error) {
			console.log("error: " + error);
		});
		await sleep(16);
	});
}

main()