import maplibregl, { GeoJSONSource, NavigationControl } from "maplibre-gl";
import maplibreGl, { Map } from "maplibre-gl";
import { useEffect, useRef } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

const MapLibre = () => {
  const mapContainer = useRef(null);
  const map = useRef<Map>();

  useEffect(() => {
    if (map.current) return;
    const newMap = new maplibreGl.Map({
      container: mapContainer.current!,
      style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${process.env.REACT_APP_MAP_TILER_KEY}`,
      center: [0, 0],
      zoom: 0,
    });

    newMap.on("load", () => {
      newMap.dragRotate.disable();
      newMap.touchZoomRotate.disableRotation();
      newMap.addControl(
        new maplibreGl.NavigationControl({ visualizePitch: true })
      );

      new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([139.7525, 35.6846])
        .addTo(newMap);

      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      newMap.addSource("earthquakes", {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: "https://maplibre.org/maplibre-gl-js-docs/assets/earthquakes.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      newMap.addLayer({
        id: "clusters",
        type: "circle",
        source: "earthquakes",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://maplibre.org/maplibre-gl-js-docs/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      newMap.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      newMap.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // inspect a cluster on click
      newMap.on("click", "clusters", function (e: any) {
        var features: any = newMap.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        var clusterId = features[0].properties.cluster_id;
        const source: GeoJSONSource = newMap.getSource(
          "earthquakes"
        ) as GeoJSONSource;
        source.getClusterExpansionZoom(
          clusterId,
          function (err: any, zoom: any) {
            if (err) return;

            newMap.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          }
        );
      });

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      newMap.on("click", "unclustered-point", function (e: any) {
        var coordinates = e.features[0].geometry.coordinates;
        var mag = e.features[0].properties.mag;
        var tsunami;

        if (e.features[0].properties.tsunami === 1) {
          tsunami = "yes";
        } else {
          tsunami = "no";
        }

        // Ensure that if the newMap is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML("magnitude: " + mag + "<br>Was there a tsunami?: " + tsunami)
          .addTo(newMap);
      });

      newMap.on("mouseenter", "clusters", function () {
        newMap.getCanvas().style.cursor = "pointer";
      });
      newMap.on("mouseleave", "clusters", function () {
        newMap.getCanvas().style.cursor = "";
      });
    });

    map.current = newMap;
  }, []);

  return (
    <div className="relative overflow-hidden h-screen">
      <div ref={mapContainer} className="h-full"></div>
    </div>
  );
};

export default MapLibre;
