async function main() {
	const rust = await import ("../pkg/index.js").catch(console.error);

		rust.test_bind();
}

main();