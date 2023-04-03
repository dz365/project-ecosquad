import maplibregl, { LngLat, LngLatBounds } from "maplibre-gl";
import maplibreGl, { Map } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

interface MapLibreAddMarker {
  setLngLat: (e: LngLat) => void;
  initMarkerLngLat?: LngLat;
}

const MapLibreAddMarker: React.FC<MapLibreAddMarker> = ({
  setLngLat,
  initMarkerLngLat,
}) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    const map = new maplibreGl.Map({
      container: mapContainer.current!,
      style:
        "https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json",
      zoom: 0,
    });

    map.on("load", () => {
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
      map.addControl(new maplibreGl.NavigationControl({}), "bottom-right");

      map.addSource("osm-tiles", {
        type: "raster",
        tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
      });

      map.addLayer({
        id: "osm-layer",
        type: "raster",
        source: "osm-tiles",
      });

      const marker = new maplibregl.Marker({
        color: "#FF0000",
        draggable: true,
      });

      map.on("click", (e) => {
        marker.setLngLat(e.lngLat.wrap());
        setLngLat(e.lngLat.wrap());
        marker.addTo(map);
      });

      marker.on("dragend", () => setLngLat(marker.getLngLat().wrap()));
      setMap(map);
    });

    return () => map?.remove();
  }, []);

  useEffect(() => {
    if (initMarkerLngLat && map) {
      map.setCenter(initMarkerLngLat);
      map.fire("click", { lngLat: initMarkerLngLat });
    }
  }, [initMarkerLngLat, map]);

  return (
    <div className="relative overflow-hidden w-full h-full">
      <div ref={mapContainer} className="h-full"></div>
    </div>
  );
};

export default MapLibreAddMarker;
