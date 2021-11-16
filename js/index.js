async function main() {
	const rust = await import ("../pkg/index.js").catch(console.error);

	// 	rust.test_bind("test bindgen rust call");
	//
	// 	fetch_stuff();
	//
	// 	function fetch_stuff() {
	// 		fetch("http://localhost:8111/indicators").then(function (myJson) {
	// 			console.log(myJson);
	// 		})
	// 		fetch("http://localhost:8111/state").then(function (myJson) {
	// 			console.log(myJson);
	// 		})
	// 	}
	//
	// function sleep(ms) {
	// 	return new Promise(resolve => setTimeout(resolve, ms));
	// }
}

main();