
(function() {
  'use strict';

  var console   = {
    log:  function(msg,data){
      var node  = document.createElement('p');
      node.innerHTML  = msg + str(data);
      document.body.appendChild(node);
    }
  };

  // init global app vars
  var app   = {
    loading: true,
    api: "/sarah.json",
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('#plList'),
    data: [{
      title:  "Welcome Message",
      mp3:  "/audio/sarah.mp3"
    }],
  };

  app.random  = function(len=10,chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'){
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  /* Custom Functions */
  app.dates   = {
    month:  function(){
      var date  = new Date();
      var months  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      return months[date.getMonth()];
    }
  };

  app.card    = {

    // init card vars
    visible:  {},       // keys of currently visible cards

    clear:    function(){
      // iterate all current cards, and remove them
      for (var key in app.card.visible){
        app.card.visible[key].parentNode.removeChild(app.card.visible[key]);
      }
      // reset cards
      app.card.visible  = {};
    },

    // update the card
    update:   function(data){

      // grab current visible card
      var card  = app.card.visible[data.key];

      // if card doesn't already exist, create a new one (by cloning existing one)
      if ( ! card) {
        card  = app.cardTemplate.cloneNode(true);
        card.classList.remove('cardTemplate');
        //card.querySelector('.location').textContent = data.label;
        card.removeAttribute('hidden');
        app.container.appendChild(card);
        app.card.visible[data.key]  = card;
      }

      console.log('>> app.card.update',data);

      // remove hidden class
      card.className  = card.className.replace(/\bhidden\b/g, "");



      // update card details
      //card.querySelector('.day').textContent    = data.day;
      card.querySelector('.plTitle').textContent  = data.title;
      //card.querySelector('.desc').innerHTML     = data.desc;

      // onclick of img, send mp3 to audio player
      //card.setAttribute('data-mp3',data.mp3);


      // see if this mp3 has already been cached, if so - don't show download button
      caches.open("power-group-audio-v3.0").then(function(cache){
        
        // see if the requested audio file is already cached - if so, use it
        return cache.match(data.mp3).then(function(response){

          var image   = '';

          // see if this mp3 was already in cache
          if (response){ 
            // no download image
            image   = '<img src="/images/check6.png" height="30"/>';
          } else {
            // download image
            image   = '<img class="download" src="/images/dl-128.png" height="30"/>';
          }

          card.querySelector('.plLength').innerHTML   = image;

        });

      });



      // add event listener that will play mp3
      card.addEventListener('click',function(event){
        event   = event || window.event;
        var el  = event.target || event.srcElement;

        // if they clicked on download, then let's download the audio for later use
        // e.target is the clicked element
        if (event) {
          
          // if user clicked download button, let's download instead
          if (el.matches('IMG.download')){

            // we need to make a request for the mp3 (since our app automatically caches the request)
            app.audio.download(card,data.mp3);

          } else {

            // play mp3
            app.audio.play(data.mp3);

          }
        }

      });

      if (app.loading) {
        app.spinner.setAttribute('hidden', true);
        app.container.removeAttribute('hidden');
        app.loading = false;
      }
      
    }
  };

  app.workout   = {

    // list of workout mp3s to use for playback
    audio:  [], 

    // boolean to determine if network request is currently pending
    pending:  null,

    // get the workout
    // cache then network
    get: function(){

      // only if supported
      if ('caches' in window) {
        caches.match(app.api).then(function(response) {
          if (response) {
            response.json().then(function(json) {
              if (app.workout.pending){

                console.log('>> app.workout.get cache',json);

                // clear current cards
                app.card.clear();

                for (var i = 0; i < json.length; i++){
                  json[i].key   = i;
                  app.card.update(json[i]);
                }

              }
            });
          }
        });
      }

      // Make the XHR to get the data, then update the card
      app.workout.pending = true;
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            var response = JSON.parse(request.response);

            console.log('>> app.workout.get http',response);
            
            app.workout.pending = false;

            // clear current cards
            app.card.clear();

            for (var i = 0; i < response.length; i++){
              response[i].key   = i;
              app.card.update(response[i]);
            }

            // save
            app.workout.save(response);
            
          }
        }
      };
      request.open('GET', app.api);
      request.send();
    },

    save:   function(workout){
      window.localforage.setItem('workouts',workout);
    }
    
  }


  app.audio   = {
    element:  document.getElementById('audio-player'),
    play:   function(mp3){
      // if the audio element has a hidden class, remove it
      app.audio.element.className   = app.audio.element.className.replace(/\bhidden\b/g, "");
      app.audio.element.src         = mp3;
      app.audio.element.play();
    },
    download:   function(card,mp3){

      // load downloading icon
      card.querySelector('.plLength').innerHTML  = '<img src="/images/downloading.gif" height="30"/>';

      // we just need to make a request for the mp3 - our app will auto cache it
      app.audio.element.src         = mp3;

      // load resource
      app.audio.element.load(); // load so that the request for the audio will be made (and thus cached), but not played

      // mark as downloading
      app.audio.downloading(card,mp3);

    },
    downloading:  function(card,mp3){

      caches.open("power-group-audio-v3.0").then(function(cache){
        
        // see if the requested audio file is already cached - if so, use it
        return cache.match(mp3).then(function(response){

          var image   = '';

          // see if this mp3 was already in cache
          if (response){ 
            
            // download complete image
            image   = '<img src="/images/check6.png" height="30"/>';
            card.querySelector('.plLength').innerHTML   = image;
            return true;

          } else {
            // download image
            //image   = '<img class="download" src="/images/dl-128.png" height="30"/>';
            return app.audio.downloading(card,mp3);
          }

        });

      });

    }

  };

  /* Event listener for refresh button */
  document.getElementById('refresh').addEventListener('click', function() {
    app.workout.get();
  });

  /* Event listener for Account button */
  document.getElementById('butHome').addEventListener('click', function() {
    alert('this is where you will view your account information');
  });

  /* Event listener for FB */
  document.getElementById('butFacebook').addEventListener('click', function() {
    alert('this is where you will be redirected to Sarahs FB page');
  });

  document.addEventListener('DOMContentLoaded', function() {

    window.localforage.getItem('workouts', function(err, workouts) {

      if ( ! workouts) {
        
        // load initial data
        for (var i = 0; i < app.data.length; i++){
          app.data[i].key   = i;
          app.card.update(app.data[i]);
        }
        
        // save initial data
        app.workout.save(app.data);

      }

      // fetch workouts (cache, then network)
      app.workout.get();

    });

  });


  // start our service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('/service-worker.js')
     .then(function() { 
      alert('servis worker registered!');
        console.log('Service Worker Registered'); 
      });
  } else {
    alert('this browser is not compatible with this website');
  }

})();
