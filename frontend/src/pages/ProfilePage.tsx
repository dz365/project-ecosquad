import React, { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import PageLayout from "./PageLayout";
import { getUser } from "../service/test.service";
import { data, MapPointDataRecord } from "./SampleData";
import { VisLeafletMap } from "@unovis/react";
import { ProfileModel } from "../models/ProfileModel";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileModel>();
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      getUser(token, user!.sub!).then((res) => {
        setProfile({
          name: res.name,
          email: res.email,
          about: res.about,
        });
      });
    });
  }, [user?.sub]);

  const style = `https://api.maptiler.com/maps/outdoor-v2/style.json?key=S045gSdAQ3IN2GgxxGWu`;
  const attribution = [
    `<a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>`,
    `<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>`,
  ];

  const pointLatitude = useCallback((d: MapPointDataRecord) => d.latitude, []);
  const pointLongitude = useCallback(
    (d: MapPointDataRecord) => d.longitude,
    []
  );
  const pointBottomLabel = useCallback((d: MapPointDataRecord) => d.id, []);
  const pointColor = "#286e47";

  const onEditClick = () => {
    navigate("/updateprofile");
  };

  return (
    <PageLayout>
      <div>
        <div className="absolute top-4 left-20 z-10 bg-white p-4 rounded-lg">
          <button
            className="absolute top-1 right-2 text-sm"
            onClick={onEditClick}
          >
            edit
          </button>
          <img
            src={`${process.env.REACT_APP_API_SERVER_URL}/users/${user!
              .sub!}/avatar`}
            alt="avatar"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "./icons/default_avatar.svg";
            }}
            className="w-20 h-20 rounded-full border p-1"
          />
          <div className="text-green-600 text-lg">{profile?.name}</div>
          <div className="text-gray-500">{profile?.email}</div>
          <div className="text-sky-600">About</div>
          <div className="text-gray-500">{profile?.about}</div>
        </div>
        <VisLeafletMap
          style={style}
          attribution={attribution}
          data={data}
          pointLatitude={pointLatitude}
          pointLongitude={pointLongitude}
          pointBottomLabel={pointBottomLabel}
          pointColor={pointColor}
          clusterExpandOnClick={false}
        />
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
