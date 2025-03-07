document.addEventListener("DOMContentLoaded", function() {
    const titulo = document.querySelector("h1");
    titulo.style.opacity = "0";
    setTimeout(() => {
        titulo.style.transition = "opacity 2s";
        titulo.style.opacity = "1";
    }, 500);
});

document.addEventListener("DOMContentLoaded", function() {
    // Crear el primer mapa (izquierdo) con OpenStreetMap
    var mapLeft = L.map('map-left').setView([4.6735, -74.1423], 15);
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mapLeft);

    // Crear el segundo mapa (derecho) con Esri World Imagery
    var mapRight = L.map('map-right').setView([4.6735, -74.1423], 15);
    var esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, Maxar, Earthstar Geographics'
    }).addTo(mapRight);

    // Sincronizar ambos mapas (cuando se mueve uno, el otro también)
    mapLeft.sync(mapRight);
    mapRight.sync(mapLeft);

    // Cargar el polígono del barrio desde el archivo GeoJSON en ambos mapas
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

            // Añadir el polígono a ambos mapas
            L.geoJSON(data, { style: geojsonStyle }).addTo(mapLeft);
            L.geoJSON(data, { style: geojsonStyle }).addTo(mapRight);

            // Ajustar el zoom en ambos mapas al polígono
            var bounds = L.geoJSON(data).getBounds();
            mapLeft.fitBounds(bounds);
            mapRight.fitBounds(bounds);
        })
        .catch(error => console.error("Error al cargar el GeoJSON:", error));
});
