// set up the map center and zoom level
var map = L.map('map', {
  center: [44.0165, -85.1550],
  zoom: 7,
  zoomControl: true,
  scrollWheelZoom: true
});

// optional : customize link to view source code; add your own GitHub repository
map.attributionControl
.setPrefix('View <a href="https://github.com/m-adduci/geog575-final">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

L.Control.geocoder({position: "topleft"}).addTo(map);

L.control.scale().addTo(map);



// optional: add legend to toggle any baselayers and/or overlays
// global variable with (null, null) allows indiv layers to be added inside functions below
var controlLayers = L.control.layers( null, null, {
  position: "topright", // suggested: bottomright for CT (in Long Island Sound); topleft for Hartford region
  collapsed: false // false = open by default
}).addTo(map);

// optional Coordinate Control for map construction
var c = new L.Control.Coordinates();
c.addTo(map);
map.on('click', function(e) {
	c.setCoordinates(e);
});

/* BASELAYERS */
// use common baselayers below, delete, or add more with plain JavaScript from http://leaflet-extras.github.io/leaflet-providers/preview/
// .addTo(map); -- suffix displays baselayer by default
// controlLayers.addBaseLayer (variableName, 'label'); -- adds baselayer and label to legend; omit if only one baselayer with no toggle desired
var EsriWorldGrayCanvas = new L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
}).addTo(map); // adds layer by default
controlLayers.addBaseLayer(EsriWorldGrayCanvas, 'Esri World Gray Canvas');

var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
})
controlLayers.addBaseLayer(Stamen_TonerLite, 'Stamen TonerLite');





//Polygon Overlay for Top 20 Michigan AirBnB Destinations

$.getJSON("data/geojson/Michigan_TopCities.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'blue',
        'weight': 2,
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.NAME) // change to match your geojson property labels
      
    }
 
  }).addTo(map);  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, "Michigan's Top 20 AirBnB Markets");  // insert your 'Title' to add to legend
  
});

$.getJSON("data/geojson/counties.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'red',
        'weight': 2,
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.NAME) // change to match your geojson property labels
      
    }
 
  }).addTo(map);  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, "County Data (can add attributes later)");  // insert your 'Title' to add to legend
  
});