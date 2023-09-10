const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const workboxPlugin = require('workbox-webpack-plugin');

const dist = path.resolve(__dirname, "dist");

const inDev = process.env.NODE_ENV === "dev";

let wasm_arg;
let webpack_arg;
let watch = false;

if (inDev) {
	wasm_arg = "--debug";
	webpack_arg = "development";
} else {
	wasm_arg = "--release";
	webpack_arg = "production"
}

wasm_arg += " --target web";

module.exports = {
	optimization: {
		minimize: false
	},
	target: 'web',
	performance: {
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
	experiments: {
		asyncWebAssembly: true,
		syncWebAssembly: true,
		topLevelAwait: true,
	},
	mode: webpack_arg,
	watchOptions: {
		aggregateTimeout: 200,
		poll: 1000,
	},
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
		fm: "./js/fm.js",
		localhost: "./js/localhost.js",
		radar: "./js/radar.js",
		blk_proto: "./js/blk_proto.js"
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
		port: 8081,
		client: {
			progress: true,
			overlay: false,
		},
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{from: path.resolve(__dirname, "static/manifest.json"), to: ''},
				{from: path.resolve(__dirname, "static/metafiles"), to: ''},
				{from: path.resolve(__dirname, "static/css"), to: ''},
				{from: path.resolve(__dirname, "static/html"), to: ''},
				{from: path.resolve(__dirname, "static/font/roboto_mono"), to: ''},
				{from: path.resolve(__dirname, "node_modules/mathjax"), to: 'mathjax'},
				{from: path.resolve(__dirname, "static/js"), to: 'js'},
				{from: path.resolve(__dirname, "static/robots.txt"), to: ''},
				{from: path.resolve(__dirname, "static/img/"), to: 'img'},
			],
			options: {
				concurrency: 1,
			},
		}),

		new WasmPackPlugin({
			crateDirectory: __dirname,
			extraArgs: wasm_arg,
			target: "web",
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
