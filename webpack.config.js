const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const dist = path.resolve(__dirname, "dist");

module.exports = {
	mode: "production",
	entry: {
		index: "./js/index.js"
	},
	output: {
		path: dist,
		filename: "[name].js"
	},
	devServer: {
		contentBase: dist,
		host: 'localhost',
		port: 8081,
	},
	plugins: [
		new CopyPlugin([
			{from: path.resolve(__dirname, "static/manifest.json"), to: ''},
			{from: path.resolve(__dirname, "static/metafiles"), to: ''},
			{from: path.resolve(__dirname, "static/css"), to: ''},
			{from: path.resolve(__dirname, "static/html"), to: ''},
			{from: path.resolve(__dirname, "static/roboto_mono"), to: ''},
			{from: path.resolve(__dirname, "node_modules/mathjax"), to: 'mathjax'},
			{from: path.resolve(__dirname, "static/js"), to: 'js'},
			{from: path.resolve(__dirname, "static/robots.txt"), to: ''},
			{from: path.resolve(__dirname, "static/js/sw.js"), to: ''},
			{from: path.resolve(__dirname, "static/workbox/"), to: 'workbox'},
			{from: path.resolve(__dirname, "static/img/"), to: 'img'},
		]),

		new WasmPackPlugin({
			crateDirectory: __dirname,
		}),
	]
};
