
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
  
    maptilersdk.config.apiKey = mapToken;
    const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element in which the SDK will render the map
    style: maptilersdk.MapStyle.STREETS,
    center: geometry.coordinates, // starting position [lng, lat]
    zoom: 14 // starting zoom
});
    const marker = new maptilersdk.Marker({
        color: "#f13d3d",
        draggable: true
    }).setLngLat(geometry.coordinates)
    .addTo(map);