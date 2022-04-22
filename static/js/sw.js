importScripts('/static/workbox/workbox-v6.5.3/workbox-sw.js');

workbox.setConfig({
	modulePathPrefix: '/third_party/workbox-vX.Y.Z/',
});

// Note: Ignore the error that Glitch raises about workbox being undefined.
workbox.setConfig({
	debug: true,
});


workbox.routing.registerRoute(
	new RegExp('.*\\.(?:html|css|js|wasm)'),
	new workbox.strategies.NetworkFirst({
		cacheName: 'core_items',
		networkTimeoutSeconds: 1,
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxAgeSeconds: 60 * 60,
			}),
		],
	})
);

workbox.routing.registerRoute(
	new RegExp('.*\\.(?:svg|ico|png|ttf)'),
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'images_or_large',
		networkTimeoutSeconds: 1,
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxAgeSeconds: 60 * 60 * 24,
			}),
		],
	})
);