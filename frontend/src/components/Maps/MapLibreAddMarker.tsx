import maplibregl, {
  GeoJSONSource,
  Marker,
  NavigationControl,
} from "maplibre-gl";
import maplibreGl, { Map } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

const MapLibreAddMarker = () => {
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

      let marker: Marker;
      newMap.on("click", (e) => {
        if (marker) return;
        marker = new maplibregl.Marker({ color: "#FF0000" })
          .setLngLat(e.lngLat)
          .setDraggable(true);
        marker.addTo(newMap);
      });
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
