async function main() {
	const _ = await import ("../pkg/index.js").catch(console.error);
}

main();