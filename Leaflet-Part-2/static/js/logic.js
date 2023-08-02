    // Create separate layer groups for earthquakes and tectonic plates
    const earthquakeLayer = L.layerGroup().addTo(map);
    const tectonicPlateLayer = L.layerGroup().addTo(map);

    // Fetch earthquake data using D3
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
      .then(data => {
        // Function to calculate the marker size based on earthquake magnitude
        function getMarkerSize(magnitude) {
          return Math.sqrt(magnitude) * 5;
        }

        // Function to calculate the marker color based on earthquake depth
        function getMarkerColor(depth) {
          // Implementation of your color scale logic here
          // Replace the return statement with your own logic
          return "#FF0000";
        }

        // Loop through the earthquake data and add markers to the map
        data.features.forEach(feature => {
          const latitude = feature.geometry.coordinates[1];
          const longitude = feature.geometry.coordinates[0];
          const magnitude = feature.properties.mag;
          const depth = feature.geometry.coordinates[2];
          const markerSize = getMarkerSize(magnitude);
          const markerColor = getMarkerColor(depth);

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
          marker.bindPopup(`<b>Magnitude: ${magnitude}</b><br>Depth: ${depth} km`);

          // Add the marker to the earthquake layer group
          marker.addTo(earthquakeLayer);
        });
      })
      .catch(error => {
        console.error("Error fetching earthquake data:", error);
      });

    // Fetch tectonic plate data using D3
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
      .then(data => {
        // Function to create polygon for each tectonic plate
        function createTectonicPlatePolygon(coordinates) {
          // Create a polygon with the given coordinates
          return L.polygon(coordinates, {
            color: "#FFA500", // Orange color for tectonic plates
            weight: 2
          });
        }

        // Loop through the tectonic plate data and add polygons to the map
        data.features.forEach(feature => {
          const coordinates = feature.geometry.coordinates;
          const tectonicPlatePolygon = createTectonicPlatePolygon(coordinates);

          // Add the polygon to the tectonic plate layer group
          tectonicPlatePolygon.addTo(tectonicPlateLayer);
        });
      })
      .catch(error => {
        console.error("Error fetching tectonic plate data:", error);
      });

    