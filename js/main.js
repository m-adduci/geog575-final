jQuery(document).ready(main)

function main(){
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

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
})
controlLayers.addBaseLayer(Esri_WorldImagery, 'Esri World Imagery');

//Polygon Overlay for Tourist Attractions from https://www.Michigan.org

$.getJSON("data/AttractionPoints.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, layer) {
      var attractionPhoto = feature.properties.location_photo_url;
      var styleForThisFeature = attractionStyle(feature);
      var featureForThisPoint = L.circleMarker(layer, styleForThisFeature);
      return featureForThisPoint.bindPopup("<a href=" + feature.properties.location_url + ">" + feature.properties.location_name + "</a>" + "\n" + "\n" +
       "<p>" + '<img src =' + attractionPhoto +  '>' + "</p>") //add thumbnail of photo URL within layer field
    }}).addTo(map);  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, "Top Attraction").bringToFront();  // insert your 'Title' to add to legend
  
});

//anchor the popup for the attraction popup

var myIcon = L.divIcon({ popupAnchor: [0,-30]});

function attractionStyle(feature) {
  return {
      radius: 1.5,
      fillColor: "#fbf001",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
  }
}

//Polygon Overlay for Top 20 Michigan AirBnB Destinations

TopCities = $.getJSON("data/geojson/Michigan_TopCities.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'red',
        'weight': 2,
        'fillOpacity': 0.7
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.NAME) // change to match your geojson property labels
      
    }
 
  }).addTo(map);  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, "Michigan's Top 20 AirBnB Markets");  // insert your 'Title' to add to legend
  
})

// Edit to upload GeoJSON data file from local directory
$.getJSON("data/cbsas_attractiveness_index.geojson", function (data) {
  geoJsonLayer = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
  controlLayers.addOverlay(geoJsonLayer, "CBSAS Attractiveness");
});



// Edit ranges and colors to match your data; see http://colorbrewer.org
// Any values not listed in the ranges below displays as the last color
function getColor(d) {
  return d > 4  ? '#08519c' :
         d > 3  ? '#3182bd' :
         d > 2  ? '#6baed6' :
         d > 1  ? '#bdd7e7' :
         d > 0  ? '#eff3ff' :
                   '#e6e6e6' ;
}

// Edit the getColor property to match data column header in GeoJson file
function style(feature) {
  return {
    fillColor: getColor(feature.properties.attractions_index),
    weight: 1,
    opacity: 1,
    color: 'black',
    fillOpacity: 1
  };
}

// Highlights the layer on hover, also for mobile
function highlightFeature(e) {
  resetHighlight(e);
  var layer = e.target;
  layer.setStyle({
    weight: 4,
    color: 'black',
    fillOpacity: 0.9
  });
  info.update(layer.feature.properties);
}

// Resets the highlight after hover moves away
function resetHighlight(e) {
  geoJsonLayer.setStyle(style);
  info.update();
}

// Instructs highlight and reset functions on hover movement
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: highlightFeature
  });
}

// Creates an info box on the map
var info = L.control({position: 'topright'});
info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

// Edit info box text and variables to match those in GeoJSON data
info.update = function (props) {
  this._div.innerHTML = '<h3>Number of Attractions by CBSA</h3>';

  var value = props && props.attractions_count ? 'Attractions present in CBSA: '+props.attractions_count: 'No data'

  this._div.innerHTML +=  (props
    ? '<b>' + props.NAME + '</b><br />' + value + '</b><br />'
      + (props.attractions_index ? 'Attractiveness Index Value: ' + props.attractions_index : '')
    : 'Hover over CBSA Boundaries');
};
info.addTo(map);

// Edit grades in legend to match the ranges cutoffs inserted above
var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    labels = ['<strong>Attractiveness Index Value</strong><br>'],
    categories = ['5','4','3','2','1'];
    for (var i = 0; i < categories.length; i++) {
      div.innerHTML += 
      labels.push(
          '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
      (categories[i] ? categories[i] : '+'));

  }
  div.innerHTML = labels.join('<br>');
return div;
};
legend.addTo(map);



/// Use in info.update if GeoJSON data contains null values, and if so, displays "--"
function checkNull(val) {
  if (val != null || val == "NaN") {
    return comma(val);
  } else {
    return "--";
  }
}

/// Use in info.update if GeoJSON data needs to be displayed as a percentage
function checkThePct(a,b) {
  if (a != null && b != null) {
    return Math.round(a/b*1000)/10 + "%";
  } else {
    return "--";
  }
}

/// Use in info.update if GeoJSON data needs to be displayed with commas (such as 123,456)
function comma(val){
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}
}


