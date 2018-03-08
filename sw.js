self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('test-cache').then(function(cache) {
			return cache.addAll([
				'/service-worker-test/index.html'
			]);
		})	
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				console.log('In SW cache:', event.request.url);
				return response;
			} else {
				console.log('NOT in SW cache, fetching:', event.request.url);
				return fetch(event.request);
			}
		})
	);
});