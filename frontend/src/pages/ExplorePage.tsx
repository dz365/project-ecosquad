import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/Maps/MapLibre";
import { useEffect, useState } from "react";
import { getPosts, searchPost } from "../service/test.service";
import SearchComponent from "../components/SearchComponent";
import Sidebar from "../components/SideBar";
import { SidebarState } from "../models/SidebarState";
import AddPostPage from "./AddPostPage";
import { LngLat } from "maplibre-gl";
import MapLibreAddMarker from "../components/Maps/MapLibreAddMarker";
import Navbar from "../navigation/Navbar";

const ExplorePage = () => {
  const [data, setData] = useState<any>();
  const [sidebarState, setSidebarState] = useState<SidebarState>("hide");
  const [sidebarContent, setSidebarContent] = useState<any>("");
  const [addPostMode, setAddPostMode] = useState(false);

  const [lngLat, setLngLat] = useState<LngLat>();

  const searchHandler = (searchQuery: string) => {
    searchPost(searchQuery).then((res) => {
      setData({
        type: "FeatureCollection",
        features: res.hits,
      });
    });
  };

  const addPostHandler = () => {
    if (addPostMode) {
      setSidebarContent("");
      setSidebarState("hide");
    } else {
      setLngLat(undefined);

      setSidebarState("expand");
    }
    setAddPostMode(!addPostMode);
  };

  const pointClickHandler = (e: any) => {
    setSidebarContent("");
    setSidebarState("expand");
  };

  const mapClickHandler = (e: any) => {
    if (addPostMode) return;
    setSidebarContent("");
    setSidebarState("hide");
  };

  useEffect(() => {
    getPosts().then((posts) => {
      setData({
        type: "FeatureCollection",
        features: posts.results,
      });
    });
  }, []);

  return (
    <div className="h-screen w-full">
      <div className="fixed top-2 left-4 z-20 w-full">
        <div className="w-11/12 md:w-96 h-12 flex items-center justify-around gap-4 bg-white rounded-lg px-4 py-2 shadow">
          <Navbar iconSize={"sm"} />
          <SearchComponent searchHandler={searchHandler} />
          <div className="w-px h-full border-l"></div>
          <button
            className={`rotate-45 ${!addPostMode && "bg-green-600 p-px"}`}
            onClick={addPostHandler}
          >
            <div
              className={`-rotate-45 w-4 h-4 bg-center bg-no-repeat ${
                addPostMode ? "bg-xmark-dark" : "bg-plus"
              }`}
            ></div>
          </button>
        </div>
      </div>
      {data && !addPostMode && (
        <MapLibre
          data={data}
          pointClickHandler={pointClickHandler}
          mapClickHandler={mapClickHandler}
        />
      )}
      {addPostMode && <MapLibreAddMarker setLngLat={setLngLat} />}
      <Sidebar
        show={sidebarState}
        showHandler={(state: SidebarState) => setSidebarState(state)}
        content={addPostMode ? <AddPostPage lnglat={lngLat} /> : sidebarContent}
      />
    </div>
  );
};

export default ExplorePage;
