import PageLayout from "./PageLayout";

import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/Maps/MapLibre";
import AddPostButton from "../components/AddPostButton";

const ExplorePage = () => {
  return (
    <PageLayout>
      <div className="w-full h-screen">
        <MapLibre />
        <AddPostButton />
      </div>
    </PageLayout>
  );
};

export default ExplorePage;
