// Function to calculate the marker size based on earthquake magnitude
function getMarkerSize(magnitude) {
    return Math.sqrt(magnitude) * 5;
  }
  
  // Function to calculate the marker color based on earthquake depth
  function getMarkerColor(depth) {
    const colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026'];
    if (depth < 10) return colors[0];
    else if (depth < 30) return colors[1];
    else if (depth < 50) return colors[2];
    else if (depth < 70) return colors[3];
    else if (depth < 90) return colors[4];
    else if (depth < 150) return colors[5];
    else return colors[6];
  }
  
  // Fetch the GeoJSON earthquake data using D3
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
    .then(data => {
      // Create a new Leaflet map centered at New York City
      const map = L.map('map').setView([40.7128, -74.0060], 5);
  
      // Add the tile layer for the map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
  
      // Loop through the earthquake data and add markers to the map
  
      data.features.forEach(feature => {
        const latitude = feature.geometry.coordinates[1];
        const longitude = feature.geometry.coordinates[0];
        const magnitude = feature.properties.mag;
        const depth = feature.geometry.coordinates[2];
        const markerSize = getMarkerSize(magnitude);
        const markerColor = getMarkerColor(depth);

        // Check if latitude and longitude are valid numbers
      if (!isNaN(latitude) && !isNaN(longitude)) {
  
        // Create a marker for each earthquake
        const marker = L.circleMarker([latitude, longitude], {
          radius: markerSize,
          fillColor: markerColor,
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
        
        // Add a popup to display earthquake information 
        marker.bindPopup(
          `<b>Magnitude: ${magnitude}</b><br>Depth: ${depth} km`
        );
        
        // Add the marker to the map
        marker.addTo(map);
      }
    
    });
  
      // Create a legend control
      const legend = L.control({ position: 'bottomright' });
  
      // Add the legend to the map
      legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const depths = [0, 10, 30, 50, 70, 90, 150];
        const labels = [];
  
        // Loop through the depth intervals and generate a label with color for each interval
        for (let i = 0; i < depths.length; i++) {
          div.innerHTML +=
            '<i style="background:' + getMarkerColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }
        return div;
      };
  
      // Add the legend
      legend.addTo(map);

    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });

 

