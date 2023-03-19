import maplibregl, { GeoJSONSource } from "maplibre-gl";
import maplibreGl, { Map } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

const MapLibre = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef<Map>();
  const [infoBarState, setInfoBarState] = useState<"" | "show" | "hide">("");

  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibreGl.Map({
      container: mapContainer.current!,
      style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${process.env.REACT_APP_MAP_TILER_KEY}`,
      center: [-79.3832, 43.6532],
      zoom: 15,
    });

    map.on("load", () => {
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
      map.addControl(new maplibreGl.NavigationControl({}));

      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      map.addSource("earthquakes", {
        type: "geojson",
        data: "https://maplibre.org/maplibre-gl-js-docs/assets/earthquakes.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
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

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 8,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // inspect a cluster on click
      map.on("click", "clusters", function (e: any) {
        var features: any = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        var clusterId = features[0].properties.cluster_id;
        const source: GeoJSONSource = map.getSource(
          "earthquakes"
        ) as GeoJSONSource;
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
        e.preventDefault();
        setInfoBarState("show");
      });

      // When user clicks the map not on a point, hide the info bar.
      map.on("click", (e: any) => {
        // Make sure click was not from a point.
        if (!e.defaultPrevented) {
          setInfoBarState("hide");
        }
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

    mapRef.current = map;
  }, []);

  return (
    <div className="relative overflow-hidden w-full h-full">
      <div ref={mapContainer} className="h-full"></div>
      <div
        className={`fixed z-10 w-full h-4/6 top-full md:top-0 md:-left-96 md:w-96 md:h-screen bg-white ${
          infoBarState === "show" && "animate-slideup md:animate-slidein"
        } ${
          infoBarState === "hide" && "animate-slidedown md:animate-slideout"
        }`}
      >
        <button
          className="absolute -top-8 right-[calc(50%-32px)] md:top-[calc(50%-32px)] md:-right-8 w-16 h-16 bg-white rounded-full text-right"
          onClick={() => {
            setInfoBarState(infoBarState === "show" ? "hide" : "show");
          }}
        >
          <div
            className={`m-auto mb-6 md:mb-0 md:ml-6 w-8 h-8 bg-contain bg-center bg-no-repeat ${
              infoBarState === "show"
                ? "bg-downarrow md:bg-leftarrow"
                : "bg-uparrow md:bg-rightarrow"
            }`}
          ></div>
        </button>
      </div>
    </div>
  );
};

export default MapLibre;
