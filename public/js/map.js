
let maptoken =mapToken;
console.log(maptoken);
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});


const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(coordinates)
.addTo(map);
const popup = new mapboxgl.Popup({offset: 25})
    .setLngLat(coordinates)
    .setHTML(`<h1>${title1}</h1>`)
    .setMaxWidth("300px")
    .addTo(map);
