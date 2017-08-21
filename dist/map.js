var GoogleMapsLoader = require('google-maps');

GoogleMapsLoader.KEY = 'AIzaSyBZaOJg43CE7lM7V7wJXAsfBhLMmOc1YrI';
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
GoogleMapsLoader.load(function(google) {
  var osmMapType = new google.maps.ImageMapType({
    alt: 'OSM',
    getTileUrl: function(coord, zoom) {
      var tileBounds = getTileBounds(coord, zoom);
      var cityBoundTop = getTileBounds({
        x: 113.8074,
        y: 22.1238
      }, zoom);
      var cityBoundBottom = getTileBounds({
        x: 114.5407,
        y: 22.5887
      }, zoom);

      var cityBound = new google.maps.LatLngBounds(
          new google.maps.LatLng(22.1238, 113.8074),
          new google.maps.LatLng(22.5887, 114.5407)
      );

      if (zoom >= 10 && cityBound.intersects(tileBounds)) {
        return 'http://tile.openstreetmap.org/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
      }

      return "http://mt.google.com/vt/lyrs=m?" +
          "z=" + zoom + "&x=" + coord.x + "&y=" + coord.y;
    },
    maxZoom: 19,
    name: 'osm',
    opacity: 1,
    tileSize: new google.maps.Size(256, 256)
  });

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 22.285,
      lng: 114.15769
    },
    zoom: 12,
    mapTypeControlOptions: {
      mapTypeIds: ['OSM',google.maps.MapTypeId.ROADMAP],
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    },
  });

  map.mapTypes.set('OSM', osmMapType);
  map.setMapTypeId('OSM');
});

function getTileBounds(coord, zoom) {
  var mapSize = Math.pow(2, zoom);
  var west = ((coord.x * 360) / mapSize) - 180;
  var east = (((coord.x + 1) * 360) / mapSize) - 180;

  var efactor = Math.exp((0.5 - coord.y / mapSize) * 4 * Math.PI);
  var north = (Math.asin((efactor - 1) / (efactor + 1))) * (180 / Math.PI);

  efactor = Math.exp((0.5 - (coord.y + 1) / mapSize) * 4 * Math.PI);
  var south = (Math.asin((efactor - 1) / (efactor +1))) * (180/Math.PI);

  return new google.maps.LatLngBounds(new google.maps.LatLng(south, west), new google.maps.LatLng(north, east));
}