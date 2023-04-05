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

  const [userLocation, setUserLocation] = useState<LngLat>();
  const [currentDisplay, setCurrentDisplay] = useState(0);

  const [showPostInfo, setShowPostInfo] = useState(false);
  const [mockMapClick, setMockMapClick] = useState<LngLatLike>();
  const [selectedPostId, setSelectedPostId] = useState<number>();
  const [selectedPostUserId, setSelectedPostUserId] = useState<string>();

  const searchHandler = (searchData: any) => {
    setData({
      type: "FeatureCollection",
      features: searchData.hits,
    });
  };

  const displayPointData = (postId: number, postUserId: string) => {
    setSelectedPostId(postId);
    setSelectedPostUserId(postUserId);
    setCurrentDisplay(1);
    setSidebarState(true);
  };

  const pointClickHandler = (e: any) => {
    const postData = e.features[0];
    displayPointData(postData.id, postData.properties.user);
  };

  const mockPointClick = (
    postId: number,
    postUserId: string,
    coordinates: LngLat
  ) => {
    setMockMapClick(coordinates);
    displayPointData(postId, postUserId);
  };

  const deleteDataHandler = (id: number) => {
    if (data.features && data.type) {
      const deletedPostIndex = data.features.findIndex((feature: any) => {
        return feature.id === id;
      });

      data.features.splice(deletedPostIndex, 1);
    }

    setData({ type: data.type, features: data.features });
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(currentDisplay);
      setShowPostInfo(currentDisplay === 1);
    }
  }, [currentDisplay, sliderRef.current]);

  useEffect(() => {
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
            initialCenter={userLocation}
            data={data}
            pointClickHandler={pointClickHandler}
            mockMapClick={mockMapClick}
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
                      key={post.id}
                      className={`flex items-center gap-2 w-full h-8 py-8 px-2 ${
                        i % 2 == 0 && "bg-gray-50"
                      }`}
                      onClick={() =>
                        mockPointClick(
                          post.id,
                          post.properties.user,
                          new LngLat(
                            post.geometry.coordinates[0],
                            post.geometry.coordinates[1]
                          )
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
                {showPostInfo ? (
                  <div className="flex flex-col gap-2">
                    <a
                      className="cursor-pointer text-sm text-gray-500"
                      onClick={() => setCurrentDisplay(0)}
                    >
                      &#60; view posts
                    </a>
                    <DisplayPost
                      postId={selectedPostId!}
                      userId={selectedPostUserId!}
                      displayHandler={setCurrentDisplay}
                      deleteHandler={deleteDataHandler}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </Slider>
          }
        />
      </>
    </PageLayout>
  );
};

export default ExplorePage;
