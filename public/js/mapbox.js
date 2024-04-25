/**
 * ?Map Module
 * Displays the map to the UI
 */

export const displayMap = function (locations) {
    mapboxgl.accessToken =
        "pk.eyJ1IjoidGV5ZGRpZSIsImEiOiJjbDh2Mnpxa3owOHN5M3NvZDg5aWMwZ2VtIn0.H2tfNaw2NKsdXb1PrH-JhA";

    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((location) => {
        //* Create marker
        const el = document.createElement("div");

        el.className = "marker";

        //* Add marker

        new mapboxgl.Marker({
            element: el,
            anchor: "bottom",
        })
            .setLngLat(location.coordinates)
            .addTo(map);

        //Pop-up addition.

        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(location.coordinates)
            .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
            .addTo(map);

        //Extending to current locations
        bounds.extend(location.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 100,
            bottom: 100,
            left: 100,
            right: 100,
        },
    });
};
