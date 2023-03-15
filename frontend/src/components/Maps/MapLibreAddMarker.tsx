import maplibregl, {
  GeoJSONSource,
  LngLat,
  Marker,
  NavigationControl,
} from "maplibre-gl";
import maplibreGl, { Map } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

interface MapLibreAddMarker {
  setLngLat: (e: LngLat) => void;
}

const MapLibreAddMarker: React.FC<MapLibreAddMarker> = ({ setLngLat }) => {
  const mapContainer = useRef(null);
  const map = useRef<Map>();

  useEffect(() => {
    if (map.current) return;
    const newMap = new maplibreGl.Map({
      container: mapContainer.current!,
      style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${process.env.REACT_APP_MAP_TILER_KEY}`,
      center: [-79.3832, 43.6532],
      zoom: 15,
    });

    newMap.on("load", () => {
      newMap.dragRotate.disable();
      newMap.touchZoomRotate.disableRotation();
      newMap.addControl(new maplibreGl.NavigationControl({}));

      const marker = new maplibregl.Marker({
        color: "#FF0000",
        draggable: true,
      });

      newMap.on("click", (e) => {
        marker.setLngLat(e.lngLat);
        marker.addTo(newMap);
        setLngLat(e.lngLat);
      });

      marker.on("dragend", () => setLngLat(marker.getLngLat()));
    });

    map.current = newMap;
  }, []);

  return (
    <div className="relative overflow-hidden w-full h-full">
      <div ref={mapContainer} className="h-full"></div>
    </div>
  );
};

export default MapLibreAddMarker;
