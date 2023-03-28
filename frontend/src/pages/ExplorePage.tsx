import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/Maps/MapLibre";
import { useEffect, useState } from "react";
import { getPosts, getUser, searchPost } from "../service/test.service";
import SearchBarComponent from "../components/SearchBarComponent";
import Sidebar from "../components/SideBar";
import { SidebarState } from "../models/SidebarState";
import PostForm from "../components/PostForm";
import { LngLat } from "maplibre-gl";
import MapLibreAddMarker from "../components/Maps/MapLibreAddMarker";
import Navbar from "../navigation/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileCard from "../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DisplayPost from "../components/DisplayPost";

const ExplorePage = () => {
  const socket = io(process.env.REACT_APP_API_SERVER_URL!);

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
  const [userLocation, setUserLocation] = useState<LngLat>();

  const resizeListener = () => {
    setIsMobile(window.innerWidth < 640);
  };

  const updateData = () => {
    getPosts().then((posts) => {
      setData({
        type: "FeatureCollection",
        features: posts.results,
      });
    });
  };
  const searchHandler = (searchData: any) => {
    setData({
      type: "FeatureCollection",
      features: searchData.hits,
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
    setSidebarContent(
      <DisplayPost
        postId={e.features[0].id}
        userId={e.features[0].properties.user}
      />
    );
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
      getUser(token, user!.sub!)
        .then((res) => {
          const coordinates = res.geometry.coordinates;
          setUserLocation(new LngLat(coordinates[0], coordinates[1]));
        })
        .catch(() => navigate("/updateprofile"));
    });
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    socket.on("new post", (postId, coordinates) => {
      const distanceInMeters = userLocation!.distanceTo(
        new LngLat(coordinates[0], coordinates[1])
      );
      const distanceInKm = Math.round(distanceInMeters / 1000);
      toast.info(
        <div>
          <p>A new post has been created {distanceInKm}km away from you</p>
          <button onClick={() => console.log("clicked")}>click here</button>
        </div>,
        {
          toastId: "new post",
          position: "top-center",
          autoClose: 30000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    });
  }, [userLocation]);
  return (
    <div className="h-screen w-full">
      <ToastContainer />
      <div
        className="h-screen w-full"
        onClick={() => setDisplayProfileCard(false)}
      >
        <SearchBarComponent
          addPostMode={addPostMode}
          addPostHandler={addPostHandler}
          searchHandler={searchHandler}
        />
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
