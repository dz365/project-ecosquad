import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUser } from "../service/test.service";
import { useNavigate } from "react-router-dom";

const ProfileCard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { user, getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      getUser(token, user!.sub!).then((res) => {
        setName(res.name);
        setEmail(res.email);
      });
    });
  }, [user?.sub]);

  const onEditClick = () => {
    navigate("/updateprofile");
  };

  return (
    <div className="flex flex-col gap-3 bg-[#f3f6fc] p-2 rounded-lg w-72 shadow">
      <div className="bg-white rounded-lg p-2 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <img
            src={`${process.env.REACT_APP_API_SERVER_URL}/users/${user!
              .sub!}/avatar`}
            alt="avatar"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "/default_avatar.svg";
            }}
            className="w-14 h-14 rounded-full border"
          />
          <div>
            <div className="text-green-600">{name}</div>
            <div className="text-gray-500 text-sm font-light">{email}</div>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <div className="self-center w-11/12 h-1 border-t mb-1"></div>
          <button
            className="mx-6 flex items-center gap-8"
            onClick={onEditClick}
          >
            <div className="w-4 h-4 bg-pencil bg-contain bg-center bg-no-repeat"></div>
            <span className="text-sm text-blue-500 opacity-90">
              Edit your profile
            </span>
          </button>
        </div>
      </div>
      <button
        className="mx-8 flex items-center gap-8 opacity-75"
        onClick={() => logout()}
      >
        <div className="w-4 h-4 bg-logout bg-contain bg-center bg-no-repeat"></div>
        <span className="text-sm">Sign out</span>
      </button>
    </div>
  );
};

export default ProfileCard;
