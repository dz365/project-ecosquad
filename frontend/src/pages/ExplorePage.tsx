import PageLayout from "./PageLayout";

import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/MapLibre";
import { useNavigate } from "react-router-dom";

const ExplorePage = () => {
  const navigate = useNavigate();

  const showAddPostPage = () => {
    navigate("/addpost");
  };

  return (
    <PageLayout>
      <div className="w-full h-screen">
        <MapLibre />
        <div
          className="z-10 p-4 absolute bottom-6 right-4 rounded-full w-16 h-16 bg-green-600 cursor-pointer"
          onClick={showAddPostPage}
        >
          <div
            className="w-full h-full bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/icons/plus-solid.svg')" }}
          ></div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExplorePage;
