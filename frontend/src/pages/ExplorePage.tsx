import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/Maps/MapLibre";
import { useEffect, useState } from "react";
import { getPosts, getUser } from "../service/test.service";
import SearchBarComponent from "../components/SearchBarComponent";
import Sidebar from "../components/SideBar";
import PostForm from "../components/PostForm";
import { LngLat } from "maplibre-gl";
import MapLibreAddMarker from "../components/Maps/MapLibreAddMarker";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DisplayPost from "../components/DisplayPost";
import PageLayout from "./PageLayout";

const socket = io(process.env.REACT_APP_API_SERVER_URL!);
const ExplorePage = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  // Map properties
  const [data, setData] = useState<any>();
  const [radius, setRadius] = useState<number>();

  // Sidebar properties
  const [sidebarState, setSidebarState] = useState(true);
  const [sidebarContent, setSidebarContent] = useState<any>("");

  const [addPostMode, setAddPostMode] = useState(false);
  const [postId, setPostId] = useState<number>();
  const [initLngLat, setInitLngLat] = useState<LngLat>();
  const [lngLat, setLngLat] = useState<LngLat>();

  const [userLocation, setUserLocation] = useState<LngLat>();

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
    } else {
      setSidebarState(true);
    }
    setAddPostMode(!addPostMode);
  };

  const editPostForm = (postId: number, lngLat: LngLat) => {
    setSidebarState(true);
    setAddPostMode(true);
    setPostId(postId);
    setInitLngLat(lngLat);
  };

  const pointClickHandler = (e: any) => {
    setSidebarContent(
      <DisplayPost
        postId={e.features[0].id}
        userId={e.features[0].properties.user}
        editPostHandler={editPostForm}
      />
    );
    setSidebarState(true);
  };

  useEffect(() => {
    updateData();

    getAccessTokenSilently().then((token) => {
      getUser(token, user!.sub!)
        .then((res) => {
          const coordinates = res.geometry.coordinates;
          setUserLocation(new LngLat(coordinates[0], coordinates[1]));
        })
        .catch(() => navigate("/profile/update"));
    });
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    socket.on("new post", (postId: any, coordinates: any) => {
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
    <PageLayout>
      <>
        <ToastContainer />
        <SearchBarComponent
          addPostMode={addPostMode}
          addPostHandler={addPostHandler}
          searchHandler={searchHandler}
        />
        {data && !addPostMode && (
          <MapLibre
            data={data}
            pointClickHandler={pointClickHandler}
            radiusChangeHander={setRadius}
            center={userLocation!}
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
          showHandler={setSidebarState}
          content={
            addPostMode ? (
              <PostForm postLocation={lngLat} postId={postId} />
            ) : (
              sidebarContent
            )
          }
        />
      </>
    </PageLayout>
  );
};

export default ExplorePage;
