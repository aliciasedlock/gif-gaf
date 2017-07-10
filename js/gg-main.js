/**
  * Baseline constants
  */
var BASE_URL = 'https://api.giphy.com/v1/gifs/trending';
var LIGHTBOX = new ImageLightbox();
var QUERY_PARAMS = {
  api_key: 'a6a04743458b4a239bade3bea5c802b3',
  limit: 20,
  rating: 'g'
};


/**
  * Converts constant QUERY_PARAMS into a query string
  * @return {string} Query paramater string
  */
function getQueryParamString() {
  var paramArray = [];

  for (var param in QUERY_PARAMS) {
    paramArray.push(param + '=' + QUERY_PARAMS[param]);
  }

  return '?' + paramArray.join('&');
}


/**
  * Takes Giphy response data and coverts it to an object containing the information needed for lightbox display
  * @param {object} data The data from the endpoint response
  * @return {object} An object with gif URL and source information
  */
function createImageData(data) {
  var imageData = data.map(function(obj) {
    return {
      url: obj.images.downsized.url,
      source: obj.source_tld ? obj.source_tld : 'Unknown'
    }
  });
  return imageData;
}


/**
  * Makes a fetch request based on constants BASE_URL and QUERY_PARAMS,
  * opens the lightbox, and diplays the first response result.
  */
function displayTrendingGifs() {

  LIGHTBOX.openLightbox();

  var sessionStorageValid = function() {
    var timestamp = sessionStorage.getItem('gg_timestamp');
    var imageString = sessionStorage.getItem('gg_images');

    if (timestamp && imageString) {
      var fetchDate = new Date().setMilliseconds(timestamp);
      var fifteenMinutesAgo = 60 * 15 * 1000;

      if ((new Date() - fetchDate) < fifteenMinutesAgo) {
        return true;
      }
    }

    return false;
  };

  if (sessionStorageValid()) {
    var imageData = JSON.parse(sessionStorage.getItem('gg_images'));
    LIGHTBOX.setLightboxData(imageData);
    LIGHTBOX.pageLightbox(1);
  } else {
    var query = getQueryParamString();
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.open('GET', BASE_URL + query);
    xhr.onload = function() {
        if (xhr.status === 200) {
          var imageData = createImageData(xhr.response.data);

          LIGHTBOX.setLightboxData(imageData);
          LIGHTBOX.pageLightbox(1);

          setSessionStorage(imageData);
        }
        else {
          console.log('Uh-oh, something went wrong. Returned status of ' + xhr.status);
        }
    };
    
    xhr.send();
  }
}

function setSessionStorage(data) {
  var expireDate = new Date().setMinutes(15);

  sessionStorage.setItem('gg_timestamp', expireDate.toString());
  sessionStorage.setItem('gg_images', JSON.stringify(data));
}

/**
  * Add click handler for our only button!
  */
window.addEventListener('load', function() {
  var button = document.querySelector('.gg__button');

  button.addEventListener('click', function() {
    displayTrendingGifs();
  });
});
