import {indexed_db} from "./util"

async function main() {
	let openRequest = window.indexedDB.open(indexed_db(), 1);
	openRequest.onupgradeneeded = function(e) {
		// the existing database version is less than 2 (or it doesn't exist)
		let db = openRequest.result;
		switch(e.oldVersion) { // existing db version
			case 0:
			let settings_db = db.createObjectStore("settings");
			let settings = {
				dark_mode: true,
			}
			settings_db.add(settings, "settings_object");
			db.close()
			break;
			case 1:
			break;
			default:
				console.error("Database version " + event.oldVersion + " is invalid")
		}
	};

	openRequest.onerror = function() {
		console.error("Error", openRequest.error);
		alert("Failed to load settings!");
	};

	openRequest.onsuccess = function() {
		let db = openRequest.result;
		// continue working with database using db object
	};
}

main()