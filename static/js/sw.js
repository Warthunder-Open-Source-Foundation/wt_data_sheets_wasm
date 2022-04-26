importScripts('/workbox/workbox-v6.5.3/workbox-sw.js');


// Note: Ignore the error that Glitch raises about workbox being undefined.
workbox.setConfig({
	debug: true,
	modulePathPrefix: '/workbox/workbox-v6.5.3/',
});


workbox.routing.registerRoute(
	new RegExp('.*\\.(?:html|css|js|wasm)'),
	new workbox.strategies.NetworkFirst({
		cacheName: 'short_term',
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxAgeSeconds: 60 * 60,
			}),
		],
		networkTimeoutSeconds: 1,
	})
);

workbox.routing.registerRoute(
	new RegExp('.*\\.(?:svg|ico|png|ttf)'),
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'long_term',
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxAgeSeconds: 60 * 60 * 24,
			}),
		],
	})
);