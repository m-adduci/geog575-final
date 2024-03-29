//Call the function of the script
jQuery(document).ready(main)

function main(){

//script to sublement about button
  $("#about-btn").click(function() {
    $("#aboutModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });
  $("#nav-btn").click(function() {
    $(".navbar-collapse").collapse("toggle");
    return false;
  });

  
  // set up the map center and zoom level
var map = L.map('map', {
  center: [44.18, -85.1550],
  zoom: 8,
  zoomControl: true,
  scrollWheelZoom: true
});

// optional : customize link to view source code; add your own GitHub repository
map.attributionControl
.setPrefix('View <a href="https://github.com/m-adduci/geog575-final">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

//Add search elemnt to map
L.Control.geocoder({position: "topleft"}).addTo(map);

//Add a scale bar to the bottom of the map
L.control.scale().addTo(map);


// optional: add legend to toggle any baselayers and/or overlays
// global variable with (null, null) allows indiv layers to be added inside functions below
var controlLayers = L.control.layers( null, null, {
  position: "topright", // suggested: bottomright for CT (in Long Island Sound); topleft for Hartford region
  collapsed: false // false = open by default
}).addTo(map);

// Coordinate Control feature for off-the-grid attractions
var c = new L.Control.Coordinates();
c.addTo(map);
map.on('click', function(e) {
	c.setCoordinates(e);
});

///Add basemap layers
var EsriWorldGrayCanvas = new L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
}); // adds layer by default
controlLayers.addBaseLayer(EsriWorldGrayCanvas, 'Esri World Gray Canvas');

var Stamen_TerrainBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});
controlLayers.addBaseLayer(Stamen_TerrainBackground, 'Stamen TonerLite');

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map)
controlLayers.addBaseLayer(Esri_WorldImagery, 'Esri World Imagery');
//


///Input project geojsons//

//Polygon Overlay for Hotels & Motels from https://www.Michigan.org
$.getJSON("data/LodgingPoints.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, layer) {
      var lodgingPhoto = feature.properties.location_photo_url;
      var styleForThisFeature = lodgingStyle(feature);
      var featureForThisPoint = L.circleMarker(layer, styleForThisFeature);
      return featureForThisPoint.bindPopup("<a href=" + feature.properties.location_url + ">" + feature.properties.location_name + "</a>" + "\n" + "\n" +
       "<p>" + '<img src =' + lodgingPhoto +  '>' + "</p>") //add thumbnail of photo URL within layer field
    }}).addTo(map);  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, "Hotels & Motels") ;  // insert your 'Title' to add to legend ;
});

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
  controlLayers.addOverlay(geoJsonLayer, "Attractions") ;  // insert your 'Title' to add to legend
});

//Polygon Overlay for Top 20 Michigan Airbnb Destinations
topCities = $.getJSON("data/geojson/Michigan_TopCities.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'red',
        'weight': 2,
        'fillOpacity': 0.7
      }},
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.NAME) // change to match your geojson property label 
    }}) 
  controlLayers.addOverlay(geoJsonLayer, "Michigan's Top Markets for Airbnb Tax Revenue");  // insert your 'Title' to add to legend
})

//Polygon Overlay for Zones Without Lodging
opportunityZones = $.getJSON("data/ZonesWithoutLodging.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'green',
        'weight': 2,
        'fillOpacity': 0.7
      }
    },onEachFeature: function( feature, layer) { 
    }})
  controlLayers.addOverlay(geoJsonLayer, "Opportunity Zones: No Hotels & Motels (5 mi. radius)");  // insert your 'Title' to add to legend
})

// Edit to upload GeoJSON data file from local directory
cbsaAttractiveness = $.getJSON("data/cbsas_attractiveness_index.geojson", function (data) {
  var geoJsonLayer = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  })
  controlLayers.addOverlay(geoJsonLayer, "CBSAs");
});
//End of Geojson Data input

///Add functions and additional script variables
function attractionStyle(feature) {
  return {
      radius: 6,
      fillColor: "#fb5d01",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
  }
}

function lodgingStyle(feature) {
  return {
      radius: 6,
      fillColor: "#green",
      outlineColor: "#white",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
  }
}

// Creates an info box on the map
var info = L.control({position: 'topright'});
info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

// Edit grades in legend to match the ranges cutoffs inserted above
var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    labels = ['<strong>CBSA Attractiveness Index</strong><br>'],
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




// Edit info box text and variables to match those in GeoJSON data
info.update = function (props) {
  this._div.innerHTML = '<h4><b>Number of Attractions by CBSA<b></h4>';

  var value = props && props.attractions_count ? 'Attractions present in CBSA: '+props.attractions_count: 'No data'

  this._div.innerHTML +=  (props
    ? '<b>' + props.NAME + '</b><br />' + value + '</b><br />'
      + (props.attractions_index ? 'CBSA Attractiveness Index: ' + props.attractions_index : '')
    : "With CBSAs 'ON': Hover over CBSA Boundary");
};
info.addTo(map);




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
