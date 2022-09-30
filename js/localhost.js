export function set_dialog_ready() {
	let done_bttn = document.getElementById("done");
	done_bttn.addEventListener("click", function () {
		location.reload();
	});
}


async function get_local(url) {
	let result = null;
	await fetch(url).then(async function (res) {
		result = await res.json();
	}).catch(function (err) {
		console.log(`Cannot request $url`);
		console.error(err);
		});
	return result;
}

export async function get_state() {
	let res = await get_local("http://localhost:8111/state");
	return is_valid(res);
}

export async function get_indicators() {
	let res = await get_local("http://localhost:8111/indicators");
	return is_valid(res)
}

function is_valid(data) {
	if (data === null || data === undefined) {
		console.error("Data is null or undefined!");
		return null;
	}
	if (data["valid"])  {
		return data;
	} else {
		console.error("Data is invalid!");
		return null;
	}
}