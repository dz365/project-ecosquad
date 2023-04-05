import { GeoJSONSource, LngLat, LngLatLike } from "maplibre-gl";
import maplibreGl, { Map } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAuth0 } from "@auth0/auth0-react";
import { IconSymbols } from "./MapSymbols";

type MapLibre = {
  initialCenter?: LngLat;
  data: any;
  pointClickHandler: (e: any) => void;
  mockMapClick?: LngLatLike;
};

const MapLibre: React.FC<MapLibre> = ({
  initialCenter,
  data,
  pointClickHandler,
  mockMapClick,
}) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    const map = new maplibreGl.Map({
      container: mapContainer.current!,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${process.env.REACT_APP_MAP_TILER_KEY}`,
      zoom: 0,
    });

    map.on("load", () => {
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
      map.addControl(new maplibreGl.NavigationControl({}), "bottom-right");

      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      map.addSource("data", {
        type: "geojson",
        data: data,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      Promise.all(
        IconSymbols.map(
          (icons) =>
            new Promise<void>((resolve, reject) => {
              map.loadImage(icons.icon, (err, image: any) => {
                map.addImage(icons.id, image);
                resolve();
              });
            })
        )
      ).then(() => {
        map.addLayer({
          id: "unclustered-point",
          type: "symbol",
          source: "data",
          minzoom: 0,
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": [
              "match",
              ["get", "type"],
              "lithosphere",
              "lithosphere",
              "atmosphere",
              "atmosphere",
              "hydrosphere",
              "hydrosphere",
              "biosphere",
              "biosphere",
              "weather",
              "weather",
              "space",
              "space",
              "other",
            ],
            "icon-overlap": "always",
          },
        });
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "data",
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

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "data",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
      });

      // inspect a cluster on click
      map.on("click", "clusters", function (e: any) {
        var features: any = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        var clusterId = features[0].properties.cluster_id;
        const source = map.getSource("data") as GeoJSONSource;
        source.getClusterExpansionZoom(
          clusterId,
          function (err: any, zoom: any) {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          }
        );
      });

      // When user clicks a point, show the info bar.
      map.on("click", "unclustered-point", (e: any) => {
        map.easeTo({
          center: e.features[0].geometry.coordinates,
          zoom: 12,
        });
        pointClickHandler(e);
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });
    });
    setMap(map);
  }, []);

  useEffect(() => {
    if (map && map.getSource("data")) {
      (map.getSource("data") as GeoJSONSource).setData(data);
    }
  }, [data, map]);

  useEffect(() => {
    if (mockMapClick && map) {
      map.easeTo({
        center: mockMapClick,
        zoom: 12,
      });
    }
  }, [mockMapClick, map]);

  useEffect(() => {
    if (initialCenter && map) {
      map.easeTo({
        center: initialCenter,
        zoom: 12,
      });
    }
  }, [initialCenter, map]);

  return (
    <div className="relative overflow-hidden w-full h-full">
      <div ref={mapContainer} className="h-full"></div>
    </div>
  );
};

export default MapLibre;
