import init, {detect_input, main_js} from "../pkg";
async function main() {
	document.getElementById("dialog").showModal();
	document.getElementById("raw_blk_upload").addEventListener("input", async (e) => {
		let buff = await e.target.files[0].arrayBuffer()
		let arr = new Uint8Array(buff)
		detect_input(e.target.files[0].name, arr);
	})


}

init().finally(() => {
	main_js()
	main()
});