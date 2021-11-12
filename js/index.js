

async function main() {
    const lib = await import ("../pkg/index.js").catch(console.error);
    let text = document.getElementById("start_calc").firstChild;
    text.data = "Start calculation";
}

main();