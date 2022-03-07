const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const workboxPlugin = require('workbox-webpack-plugin');

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
		]),

		new WasmPackPlugin({
			crateDirectory: __dirname,
		}),

		new workboxPlugin.GenerateSW({
			swDest: 'sw.js',
			clientsClaim: true,
			cleanupOutdatedCaches: true,
			runtimeCaching: [{
				urlPattern: /\.(?:html|css|js|wasm|svg|json|ico|png|ttf)$/,
				handler: 'StaleWhileRevalidate',
				options: {
					cacheName: 'page',
					expiration: {
						maxEntries: 50,
						// caches no more than 1 day hour
						maxAgeSeconds: 60 * 60 * 24,
						purgeOnQuotaError: true,
					},
				},
			}],
		}),
	]
};
