import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/Maps/MapLibre";
import { useEffect, useState } from "react";
import { getPosts, getUser } from "../service/test.service";
import SearchBarComponent from "../components/SearchBarComponent";
import Sidebar from "../components/SideBar";
import { LngLat } from "maplibre-gl";
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

  const pointClickHandler = (e: any) => {
    setSidebarContent(
      <DisplayPost
        postId={e.features[0].id}
        userId={e.features[0].properties.user}
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
        <SearchBarComponent searchHandler={searchHandler} />
        {data && (
          <MapLibre
            data={data}
            pointClickHandler={pointClickHandler}
            radiusChangeHander={setRadius}
            center={userLocation!}
          />
        )}
        <Sidebar
          show={sidebarState}
          showHandler={setSidebarState}
          content={sidebarContent}
        />
      </>
    </PageLayout>
  );
};

export default ExplorePage;
