
let maptoken =mapToken;
console.log(maptoken);
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
   
    center: coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});


const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(coordinates)
.addTo(map);





    const element = document.querySelector('.mapper');
    const screenWidth = window.innerWidth;
    console.log(screenWidth)
    if (screenWidth < 1024) {
        element.classList.remove('offset-3');
      } else{
        element.classList.add('offset-3');
      }