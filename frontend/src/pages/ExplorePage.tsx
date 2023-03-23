import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/Maps/MapLibre";
import AddPostButton from "../components/AddPostButton";
import { useEffect, useState } from "react";
import { getPosts, searchPost } from "../service/test.service";
import SearchComponent from "../components/SearchComponent";

const ExplorePage = () => {
  const [data, setData] = useState<any>();

  const searchHandler = (searchQuery: string) => {
    searchPost(searchQuery).then((res) => {
      setData({
        type: "FeatureCollection",
        features: res.hits,
      });
    });
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
      <div className="fixed top-2 left-4 z-20">
        <SearchComponent searchHandler={searchHandler} />
      </div>
      {data && <MapLibre data={data} />}
      <AddPostButton />
    </div>
  );
};

export default ExplorePage;
