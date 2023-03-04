import { VisLeafletMap } from "@unovis/react";
import { useCallback } from "react";
import Navbar from "../navigation/Navbar";

import { MapPointDataRecord, data } from "./SampleData";

const ExplorePage = () => {
  const style = `https://api.maptiler.com/maps/outdoor-v2/style.json?key=S045gSdAQ3IN2GgxxGWu`;
  const attribution = [
    `<a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>`,
    `<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>`,
  ];

  const pointLatitude = useCallback((d: MapPointDataRecord) => d.latitude, []);
  const pointLongitude = useCallback(
    (d: MapPointDataRecord) => d.longitude,
    []
  );
  const pointBottomLabel = useCallback((d: MapPointDataRecord) => d.id, []);
  const pointColor = "#286e47";

  return (
    <div className="min-h-screen bg-green-100">
      <Navbar />
      <div className="relative w-full h-screen">
        <VisLeafletMap
          style={style}
          attribution={attribution}
          data={data}
          pointLatitude={pointLatitude}
          pointLongitude={pointLongitude}
          pointBottomLabel={pointBottomLabel}
          pointColor={pointColor}
          clusterExpandOnClick={false}
        />
      </div>
    </div>
  );
};

export default ExplorePage;
