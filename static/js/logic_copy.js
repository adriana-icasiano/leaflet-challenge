function getRadius(magnitude_rad) {
  if (magnitude_rad === 0) {
    return 1;
    }
  return magnitude_rad *30000;
  }

// A function to determine the marker size based on the magnitude
function markerSize(magnitude) {
  return Math.sqrt(magnitude) * 30000;
}

// A function to determine the marker size based on the magnitude
function getColor(depth) {
  return (depth) > 90 ? "rgb(232,0,0)": //red
         (depth) <= 90 && (depth) > 70 ? "rgb(255, 98, 0)": //dark orange
         (depth) <= 70 && (depth) > 50? "rgb(255, 142, 0)": // light orange
         (depth) <= 50 && (depth) > 30 ? "rgb(255, 181, 0)": //orange
         (depth) <= 30 && (depth) >= 10 ? "rgb(255, 255, 0)": //yellow
         (depth) < 10 ? "rgb(0, 235, 0)": //light green
         "rgb(0, 235, 0)"; //light green
}

// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

  let earthquake = data.features; 
  
  console.log(earthquake);
  
// Define arrays to hold the created earthquake markers.
var earthquakeMarkers = [];


// Loop through locations, and create the earthquake markers.
for (var i = 0; i < earthquake.length; i++) {
  // Setting the marker radius for the state by passing magnitude into the markerSize function
  magnitude_rad = earthquake[i].properties.mag;
  

  earthquakeMarkers.push(
    L.circle([earthquake[i].geometry.coordinates[1], earthquake[i].geometry.coordinates[0]], {
      stroke: false,
      fillOpacity: 0.75,
      stroke: true,                                                                                                                                                                                                                                    
      color: "black",
      fillColor: getColor(earthquake[i].geometry.coordinates[2]),
      weight: .5,
      radius: getRadius(magnitude_rad),
    }).bindPopup(`<h3>${earthquake[i].properties.title}</h3> <hr>
    <h3> Magnitude: ${earthquake[i].properties.mag} </h3>
    <h3> Depth: ${earthquake[i].geometry.coordinates[2]} </h3>`)
  );

}

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create two separate layer groups: one for the earthquake markers.
var earthquakes = L.layerGroup(earthquakeMarkers);

// Create a baseMaps object.
var baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};

// Create an overlay object.
var overlayMaps = {
  "Earthquakes": earthquakes,

};

// Define a map object.
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [street, earthquakes]
});

// Pass our map layers to our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);




});

  