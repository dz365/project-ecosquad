import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/Maps/MapLibre";
import { useEffect, useState } from "react";
import { getPosts, getUser, searchPost } from "../service/test.service";
import SearchComponent from "../components/SearchComponent";
import Sidebar from "../components/SideBar";
import { SidebarState } from "../models/SidebarState";
import PostForm from "../components/PostForm";
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
  const [postId, setPostId] = useState<number>();
  const [initLngLat, setInitLngLat] = useState<LngLat>();
  const [displayProfileCard, setDisplayProfileCard] = useState(false);
  const [lngLat, setLngLat] = useState<LngLat>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const resizeListener = () => {
    setIsMobile(window.innerWidth < 640);
  };

  const updateData = () => {
    getPosts().then((posts) => {
      setData({
        type: "FeatureCollection",
        features: posts.results,
      });
      console.log(posts.results);
    });
  };
  const searchHandler = (searchQuery: string) => {
    searchPost(searchQuery).then((res) => {
      setData({
        type: "FeatureCollection",
        features: res.hits,
      });
    });
  };

  const resetSidebar = () => {
    setSidebarContent("");
    setSidebarState("hide");
    setAddPostMode(false);
    setLngLat(undefined);
    setInitLngLat(undefined);
    setPostId(undefined);
    updateData();
  };

  const addPostHandler = () => {
    setLngLat(undefined);
    setInitLngLat(undefined);
    setPostId(undefined);
    if (addPostMode) {
      setSidebarContent("");
      setSidebarState("hide");
    } else {
      setSidebarState("expand");
    }
    setAddPostMode(!addPostMode);
  };

  const editPostForm = (pointData: any) => {
    setSidebarState("expand");
    setAddPostMode(true);
    setPostId(pointData.id);
    const coordinates = pointData.geometry.coordinates;
    setInitLngLat(new LngLat(coordinates[0], coordinates[1]));
  };

  const pointClickHandler = (e: any) => {
    let content: any = "";
    const pointData = e.features[0];
    if (pointData.properties.user === user?.sub) {
      content = (
        <button className="border" onClick={() => editPostForm(pointData)}>
          edit
        </button>
      );
    }
    setSidebarContent(content);
    setSidebarState("expand");
  };

  const mapClickHandler = (e: any) => {
    if (addPostMode) return;
    setSidebarContent("");
    setSidebarState("hide");
  };

  useEffect(() => {
    updateData();

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
            initMarkerLngLat={initLngLat}
          />
        )}
        <Sidebar
          show={sidebarState}
          showHandler={(state: SidebarState) => setSidebarState(state)}
          content={
            addPostMode ? (
              <PostForm
                lnglat={lngLat}
                postFormSubmitHandler={resetSidebar}
                postId={postId}
              />
            ) : (
              sidebarContent
            )
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
