import { LngLat } from "maplibre-gl";
import { useState } from "react";
import MapLibreAddMarker from "../components/Maps/MapLibreAddMarker";
import PostForm from "../components/PostForm";
import Sidebar from "../components/SideBar";

import PageLayout from "./PageLayout";

const NewPostPage = () => {
  const [sidebarState, setSidebarState] = useState(true);
  const [markerLngLat, setMarkerLngLat] = useState<LngLat>();

  return (
    <PageLayout>
      <>
        <MapLibreAddMarker setLngLat={setMarkerLngLat} />
        <Sidebar
          show={sidebarState}
          showHandler={setSidebarState}
          content={<PostForm postLocation={markerLngLat} />}
        />
      </>
    </PageLayout>
  );
};

export default NewPostPage;
