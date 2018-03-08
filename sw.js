self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('v3').then(function(cache) {
			return cache.addAll([
				'/service-worker-test/index.html'
			]);
		})	
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(keys) {
			console.log('SW cache keys:', keys);
			return Promise.all(keys.map(function(key) {
				if (key != 'v3') return caches.delete(key);
			}));
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				console.log('In SW cache:', event.request.url);
				setTimeout(() => {
					// Wait 5 seconds and fetch a fresh version
					console.log('Fetching a fresh version and updating cache:', event.request.url);
					fetch(event.request).then(function(response) {
						caches.open('v3').then(function(cache) {
							cache.put(event.request, response.clone());
						});
					});
				}, 5000);
				return response;
			} else {
				console.log('NOT in SW cache, fetching:', event.request.url);
				return fetch(event.request);
			}
		})
	);
});