const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const workboxPlugin = require('workbox-webpack-plugin');
const {GenerateSW} = require("workbox-webpack-plugin");

const dist = path.resolve(__dirname, "dist");

const inDev = process.env.NODE_ENV === "dev";

let wasm_arg;

if (inDev) {
	wasm_arg = "--debug";
} else {
	wasm_arg = "--release";
}

module.exports = {
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
	experiments: {
		asyncWebAssembly: true,
		syncWebAssembly: true
	},
	mode: "production",
	entry: {
		index: "./js/index.js",
		util: "./js/util.js",
		missile_ballistics: "./js/missile_ballistics.js",
		bombing_computer: "./js/bombing_computer.js",
		table: "./js/table.js",
		live_calc: "./js/live_calc.js",
		compare: "./js/compare.js",
		thermal_index: "./js/thermal_index.js",
		shell_index: "./js/shell_index.js",
		bombing_table: "./js/bombing_table.js",
		battle_rating_statistics: "./js/battle_rating_statistics.js",
		settings: "./js/settings.js",
	},
	output: {
		path: dist,
		filename: "[name].js",
		publicPath: ''
	},
	devServer: {
		static: {
			directory: path.join(__dirname, "dist")
		},
		host: 'localhost',
		compress: true,
		port: 8081,
		client: {
			overlay: false,
		},
		liveReload: false,
		hot: false,
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
			{from: path.resolve(__dirname, "static/img/"), to: 'img'},
		]),

		new WasmPackPlugin({
			crateDirectory: __dirname,
			extraArgs: wasm_arg,
		}),
		new workboxPlugin.GenerateSW({
			swDest: 'sw.js',
			// 4 Megabytes
			maximumFileSizeToCacheInBytes: 4194304,
			clientsClaim: true,
			cleanupOutdatedCaches: true,
			runtimeCaching: [
				{
					urlPattern: /\.(?:html|css|js|wasm)$/,
					handler: 'NetworkFirst',
					options: {
						cacheName: 'short_term',
						expiration: {
							// caches no more than 1 hour
							maxAgeSeconds: 60 * 60,
							purgeOnQuotaError: true,
						},
					},
				},
				{
					urlPattern: /\.(?:svg|ico|png|ttf)$/,
					handler: 'StaleWhileRevalidate',
					options: {
						cacheName: 'long_term',
						expiration: {
							// caches no more than 1 day
							maxAgeSeconds: 60 * 60 * 24,
							purgeOnQuotaError: true,
						},
					},
				}
			],
		}),
	]
};
