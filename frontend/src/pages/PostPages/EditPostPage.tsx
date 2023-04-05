import { useAuth0 } from "@auth0/auth0-react";
import { LngLat } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapLibreAddMarker from "../../components/Maps/MapLibreAddMarker";
import PostForm from "../../components/PostForm";
import Sidebar from "../../components/SideBar";
import { getPost } from "../../service/test.service";
import NotExistingPage from "../NotExistingPage";
import PageLayout from "../PageLayout";
import UnauthorizedPage from "../UnauthorizedPage";

const EditPostPage = () => {
  const { id } = useParams();
  const [postExist, setPostExist] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const { user, getAccessTokenSilently } = useAuth0();
  const [sidebarState, setSidebarState] = useState(true);
  const [markerLngLat, setMarkerLngLat] = useState<LngLat>();
  const [initMarkerLocation, setInitMarkerLocation] = useState<LngLat>();

  useEffect(() => {
    if (id && !isNaN(+id)) {
      getAccessTokenSilently().then((token) => {
        getPost(token, +id)
          .then((res) => {
            setPostExist(true);
            if (res.post.UserId === user?.sub) {
              // Current user is post owner and can edit.
              setCanEdit(true);
              const coordinates = res.post.geometry.coordinates;
              setInitMarkerLocation(new LngLat(coordinates[0], coordinates[1]));
            }
          })
          .catch(() => setPostExist(false));
      });
    }
  }, []);

  if (!postExist) return <NotExistingPage />;
  if (!canEdit) return <UnauthorizedPage />;

  return (
    <PageLayout>
      <>
        <MapLibreAddMarker
          setLngLat={setMarkerLngLat}
          initMarkerLngLat={initMarkerLocation}
        />
        <Sidebar
          show={sidebarState}
          showHandler={setSidebarState}
          content={<PostForm postLocation={markerLngLat} postId={+id!} />}
        />
      </>
    </PageLayout>
  );
};

export default EditPostPage;
