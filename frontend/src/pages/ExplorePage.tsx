import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre from "../components/Maps/MapLibre";
import { useEffect, useRef, useState } from "react";
import { getUser } from "../service/test.service";
import SearchBarComponent from "../components/SearchBarComponent";
import Sidebar from "../components/SideBar";
import { LngLat, LngLatLike } from "maplibre-gl";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DisplayPost from "../components/DisplayPost";
import PageLayout from "./PageLayout";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ICON_IMAGES } from "../components/Maps/MapSymbols";

const settings = {
  arrows: false,
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: false,
  slideClass: "flex flex-col gap-8",
};

const socket = io(process.env.REACT_APP_API_SERVER_URL!);
const ExplorePage = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  // Map properties
  const [data, setData] = useState<any>();
  const [radius, setRadius] = useState<number>();
  // Sidebar properties
  const sliderRef = useRef<Slider>(null);
  const [sidebarState, setSidebarState] = useState(true);

  const [mapCenter, setMapCenter] = useState<LngLatLike>();
  const [userLocation, setUserLocation] = useState<LngLat>();
  const [currentDisplay, setCurrentDisplay] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState<number>();
  const [selectedPostUserId, setSelectedPostUserId] = useState<string>();

  const searchHandler = (searchData: any) => {
    setData({
      type: "FeatureCollection",
      features: searchData.hits,
    });
  };

  const displayPointData = (
    postId: number,
    postUserId: string,
    coordinate: LngLatLike
  ) => {
    setSelectedPostId(postId);
    setSelectedPostUserId(postUserId);
    setMapCenter(coordinate);
    setCurrentDisplay(1);
    setSidebarState(true);
  };

  const pointClickHandler = (e: any) => {
    const postData = e.features[0];
    const coordinates = postData.geometry.coordinates;
    displayPointData(postData.id, postData.properties.user, coordinates);
  };

  useEffect(() => {
    if (sliderRef.current) sliderRef.current.slickGoTo(currentDisplay);
  }, [currentDisplay, sliderRef.current]);

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      getUser(token, user!.sub!)
        .then((res) => {
          const coordinates = res.geometry.coordinates;
          setUserLocation(new LngLat(coordinates[0], coordinates[1]));
          setMapCenter(coordinates);
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
    <PageLayout showNavbar={false}>
      <>
        <ToastContainer />
        <SearchBarComponent searchHandler={searchHandler} />
        {data && (
          <MapLibre
            data={data}
            pointClickHandler={pointClickHandler}
            radiusChangeHander={setRadius}
            center={mapCenter!}
          />
        )}
        <Sidebar
          show={sidebarState}
          showHandler={setSidebarState}
          content={
            <Slider ref={sliderRef} {...settings}>
              <div>
                {data &&
                  data.features &&
                  data.features.map((post: any, i: number) => (
                    <div
                      className={`flex items-center gap-2 w-full h-8 py-8 px-2 ${
                        i % 2 == 0 && "bg-gray-50"
                      }`}
                      onClick={() =>
                        displayPointData(
                          post.id,
                          post.properties.user,
                          post.geometry.coordinates
                        )
                      }
                    >
                      <img
                        src={ICON_IMAGES[post.properties.type]}
                        className="w-8 h-8"
                      />
                      <p className="w-8/12 grow truncate whitespace-nowrap text-gray-600">
                        {post.properties.description}
                      </p>
                      <button>
                        <div className="w-4 h-4 bg-rightarrow bg-no-repeat bg-contain bg-center opacity-50"></div>
                      </button>
                    </div>
                  ))}
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <a
                    className="cursor-pointer text-sm text-gray-500"
                    onClick={() => setCurrentDisplay(0)}
                  >
                    &#60; view posts
                  </a>
                  <DisplayPost
                    postId={selectedPostId ?? -1}
                    userId={selectedPostUserId ?? ""}
                  />
                </div>
              </div>
            </Slider>
          }
        />
      </>
    </PageLayout>
  );
};

export default ExplorePage;
