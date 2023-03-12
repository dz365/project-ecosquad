import React, { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import PageLayout from "./PageLayout";
import { getUser } from "../service/test.service";
import { ProfileModel } from "../models/ProfileModel";
import { useNavigate } from "react-router-dom";
import MapLibre from "../components/MapLibre";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileModel>();
  const { user, getAccessTokenSilently } = useAuth0();
  const [hideProfile, setHideProfile] = useState(false);

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

  const onEditClick = () => {
    navigate("/updateprofile");
  };

  const toggleHideProfile = () => {
    setHideProfile(!hideProfile);
  };

  return (
    <PageLayout>
      <div className="w-full h-screen">
        {hideProfile && (
          <div className="absolute top-4 left-20 z-10 bg-gray-50 rounded-xl p-1 flex flex-col place-items-center">
            <img
              src={`${process.env.REACT_APP_API_SERVER_URL}/users/${user!
                .sub!}/avatar`}
              alt="avatar"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "./icons/default_avatar.svg";
              }}
              className="w-16 h-16 rounded-full border p-1"
            />
            <div
              className="w-5 h-5 cursor-pointer opacity-50 bg-no-repeat bg-center"
              style={{
                backgroundImage: "url('./icons/chevron-down-solid.svg')",
              }}
              onClick={toggleHideProfile}
            ></div>
          </div>
        )}
        {!hideProfile && (
          <div className="m-4 absolute top-10 left-0 z-10 bg-white px-4 py-2 rounded-lg max-w-sm">
            <button
              className="absolute top-1 right-3 text-sm text-blue-500"
              onClick={onEditClick}
            >
              edit
            </button>
            <div
              className="w-5 h-5 m-auto mb-4 cursor-pointer opacity-50 bg-no-repeat bg-center"
              style={{ backgroundImage: "url('./icons/chevron-up-solid.svg')" }}
              onClick={toggleHideProfile}
            ></div>
            <div className="flex flex-col items-center place-items-center">
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
            </div>
            <div className="text-sky-600">About</div>
            <div className="text-gray-500">{profile?.about}</div>
          </div>
        )}
        <MapLibre />
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
