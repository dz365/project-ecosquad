import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/Maps/MapLibre";
import { useEffect, useState } from "react";
import { getPosts, searchPost } from "../service/test.service";
import SearchComponent from "../components/SearchComponent";
import Sidebar from "../components/SideBar";
import { SidebarState } from "../models/SidebarState";

const ExplorePage = () => {
  const [data, setData] = useState<any>();
  const [sidebarState, setSidebarState] = useState<SidebarState>("hide");

  const searchHandler = (searchQuery: string) => {
    searchPost(searchQuery).then((res) => {
      setData({
        type: "FeatureCollection",
        features: res.hits,
      });
    });
  };

  const pointClickHandler = (e: any) => {
    setSidebarState("expand");
  };

  const mapClickHandler = (e: any) => {
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
        <SearchComponent searchHandler={searchHandler} />
      </div>
      {data && (
        <MapLibre
          data={data}
          pointClickHandler={pointClickHandler}
          mapClickHandler={mapClickHandler}
        />
      )}
      <Sidebar
        show={sidebarState}
        showHandler={(state: SidebarState) => setSidebarState(state)}
        content={""}
      />
    </div>
  );
};

export default ExplorePage;
