document.addEventListener("DOMContentLoaded", function() {
    const titulo = document.querySelector("h1");
    titulo.style.opacity = "0";
    setTimeout(() => {
        titulo.style.transition = "opacity 2s";
        titulo.style.opacity = "1";
    }, 500);
});

document.addEventListener("DOMContentLoaded", function() {
    var mapLeft = L.map('map-left').setView([4.6735, -74.1423], 15);
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapLeft);

    var mapRight = L.map('map-right').setView([4.6735, -74.1423], 15);
    var esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, Maxar, Earthstar Geographics'
    }).addTo(mapRight);

    mapLeft.sync(mapRight);
    mapRight.sync(mapLeft);

    fetch('capellania.geojson')
        .then(response => response.json())
        .then(data => {
            var geojsonStyle = {
                color: "#FF0000",
                weight: 2,
                opacity: 1,
                fillColor: "#FF0000",
                fillOpacity: 0.3
            };

            L.geoJSON(data, { style: geojsonStyle }).addTo(mapLeft);
            L.geoJSON(data, { style: geojsonStyle }).addTo(mapRight);

            var bounds = L.geoJSON(data).getBounds();
            mapLeft.fitBounds(bounds);
            mapRight.fitBounds(bounds);

            // Cálculos con Turf.js
            var polygon = turf.featureCollection(data.features);
            var area = turf.area(polygon);  // Área en metros cuadrados
            var perimeter = turf.length(turf.polygonToLine(polygon), { units: "meters" });
            var centroid = turf.centroid(polygon).geometry.coordinates;
            var bbox = turf.bbox(polygon);
            var vertices = data.features[0].geometry.coordinates[0].length;

            // Mostrar los datos en la página
            document.getElementById("area").textContent = area.toFixed(2);
            document.getElementById("perimeter").textContent = perimeter.toFixed(2);
            document.getElementById("centroid").textContent = `[${centroid[1].toFixed(6)}, ${centroid[0].toFixed(6)}]`;
            document.getElementById("bbox").textContent = `[${bbox.map(coord => coord.toFixed(6)).join(", ")}]`;
            document.getElementById("vertices").textContent = vertices;
        })
        .catch(error => console.error("Error al cargar el GeoJSON:", error));
});
