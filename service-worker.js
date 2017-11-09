var config 	= {
	api: 		"/sarah.json",  // api url
	caches: 	[
		"power-group-v3.1", // app shell
		"power-group-workouts-v3.1",   // app data
    "power-group-audio-v3.0"  // audio data
	],
	files: 		[
		'/',
		'/index.html',
		//'/scripts/app.js',
		'/scripts/localforage-1.4.0.js',
		//'/styles/style.css',
	]
};


self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(config.caches[0]).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(config.files);
    })
  );
  e.waitUntil(
    caches.open(config.caches[2]).then(function(cache) {
      console.log('[ServiceWorker] Viewing what is in storage',cache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {

      	// iterate all current caches to see if we need to delete any old ones
      	var old 	= true;
      	for (var i = 0; i < config.caches.length; i++){
      		if (key == config.caches[i]){
      			old 	= false;
      		}
      	}

        if (old) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }

      }));
    })
  );
});

self.addEventListener('fetch', function(e) {

  if (e.request.url.startsWith(config.api)) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          return caches.open(config.caches[1]).then(function(cache) {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched & Cached', e.request.url);
            return response;
          });
        })
    );

    // if user is requesting an mp3, let's first check to see if we have any downloaded
  } else if (e.request.url.endsWith('mp3')) {
    
    // check to see if a downloaded version of this mp3 exists - if so use that - else, use network
    e.respondWith(

      // open the cache storing all downloaded audio files
      caches.open(config.caches[2]).then(function(cache){
        
        // see if the requested audio file is already cached - if so, use it
        return cache.match(e.request.url).then(function(response){

          console.log('[Service Worker] Fetching audio from cache ..');

          // if cache is found, return it - else, fetch the audio
          return response || fetch(e.request.url).then(function(response){

            // make sure caache is max 3 items, else remove from bottom

            // add to cache here
            cache.put(e.request.url, response.clone());
            console.log('[Service Worker] Unable to fetch from cache, instead we fetched from network then cached ..');
            return response;

          });

        });

      })

    );


  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        console.log('[ServiceWorker] Fetch Only', e.request.url);
        return response || fetch(e.request);
      })
    );
  }
});
