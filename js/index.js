async function main() {
    const lib = await import ("../pkg/index.js").catch(console.error);
}

main();