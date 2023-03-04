import { VisLeafletMap } from "@unovis/react";
import Navbar from "../navigation/Navbar";

const ExplorePage = () => {
  const style = `https://api.maptiler.com/maps/outdoor-v2/style.json?key=S045gSdAQ3IN2GgxxGWu`;
  const attribution = [
    `<a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>`,
    `<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>`,
  ];

  return (
    <div className="min-h-screen bg-green-100">
      <Navbar />
      <div className="relative w-full h-screen">
        <VisLeafletMap style={style} attribution={attribution} />
      </div>
    </div>
  );
};

export default ExplorePage;
