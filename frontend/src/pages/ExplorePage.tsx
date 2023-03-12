import PageLayout from "./PageLayout";

import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/MapLibre";

const ExplorePage = () => {
  return (
    <PageLayout>
      <div>
        <MapLibre />
      </div>
    </PageLayout>
  );
};

export default ExplorePage;
