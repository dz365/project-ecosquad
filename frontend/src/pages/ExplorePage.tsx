import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/Maps/MapLibre";
import { useEffect, useState } from "react";
import { getPosts, getUser, searchPost } from "../service/test.service";
import SearchComponent from "../components/SearchComponent";
import Sidebar from "../components/SideBar";
import { SidebarState } from "../models/SidebarState";
import AddPostForm from "../components/AddPostForm";
import { LngLat } from "maplibre-gl";
import MapLibreAddMarker from "../components/Maps/MapLibreAddMarker";
import Navbar from "../navigation/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileCard from "../components/ProfileCard";
import { useNavigate } from "react-router-dom";

const ExplorePage = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [data, setData] = useState<any>();
  const [sidebarState, setSidebarState] = useState<SidebarState>("hide");
  const [sidebarContent, setSidebarContent] = useState<any>("");
  const [addPostMode, setAddPostMode] = useState(false);
  const [displayProfileCard, setDisplayProfileCard] = useState(false);
  const [lngLat, setLngLat] = useState<LngLat>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const resizeListener = () => {
    setIsMobile(window.innerWidth < 640);
  };
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

    getAccessTokenSilently().then((token) => {
      getUser(token, user!.sub!).catch(() => navigate("/updateprofile"));
    });
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  return (
    <div className="h-screen w-full">
      <div
        className="h-screen w-full"
        onClick={() => setDisplayProfileCard(false)}
      >
        <div className="fixed top-2 left-4 z-20 w-full">
          <div className="w-11/12 sm:w-96 h-12 flex items-center justify-around gap-4 bg-white rounded-lg px-4 py-2 shadow">
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
        {addPostMode && (
          <MapLibreAddMarker
            setLngLat={setLngLat}
            initMarkerLngLat={undefined}
          />
        )}
        <Sidebar
          show={sidebarState}
          showHandler={(state: SidebarState) => setSidebarState(state)}
          content={
            addPostMode ? <AddPostForm lnglat={lngLat} /> : sidebarContent
          }
        />
      </div>

      <button
        className={`z-20 fixed ${
          isMobile ? "bottom-2 left-4" : "top-2 right-4"
        } bg-white rounded-full cursor-pointer shadow`}
        onClick={() => setDisplayProfileCard(!displayProfileCard)}
      >
        <img
          src={`${process.env.REACT_APP_API_SERVER_URL}/users/${user!
            .sub!}/avatar`}
          alt="avatar"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "/default_avatar.svg";
          }}
          className="w-12 h-12 rounded-full border"
        />
      </button>

      {displayProfileCard && (
        <div
          className={`z-20 fixed ${
            isMobile ? "bottom-20 left-4" : "top-20 right-4"
          }`}
        >
          <ProfileCard />
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
