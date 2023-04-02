import { useAuth0 } from "@auth0/auth0-react";
import { LngLat } from "maplibre-gl";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextAreaInput from "../components/controlled/TextareaInput";
import TextInput from "../components/controlled/TextInput";
import MapLibreAddMarker from "../components/Maps/MapLibreAddMarker";
import Navbar from "../navigation/Navbar";
import { createUser, getUser, updateUser } from "../service/test.service";
import { ToastContext } from "../ToastContext";
import TagListInput from "../components/TagListInput";

const UpdateProfilePage = () => {
  const { createToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [avatarURL, setAvatarURL] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [initLngLat, setInitLngLat] = useState<LngLat>();
  const [lngLat, setLngLat] = useState<LngLat>();
  const { user, getAccessTokenSilently } = useAuth0();
  const [preferences, setPreferences] = useState<string[]>([]);

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      getUser(token, user!.sub!)
        .then((res) => {
          setName(res.name);
          setAbout(res.about);
          const coordinates = res.geometry.coordinates;
          setInitLngLat(new LngLat(coordinates[0], coordinates[1]));
        })
        .catch(() => setIsNewUser(true));
    });
  }, [user?.sub]);

  const onAvatarUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const avatar = e.target.files;
    if (avatar && avatar[0]) {
      setAvatarURL(URL.createObjectURL(avatar[0]));
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (!lngLat) return;

    getAccessTokenSilently().then((token) => {
      const formData = new FormData(e.target);
      formData.set("id", user!.sub!);
      formData.set("email", user!.email!);
      formData.set("preferences", JSON.stringify(preferences));
      formData.set("coordinates", JSON.stringify(lngLat.toArray()));

      (isNewUser
        ? createUser(token, formData)
        : updateUser(token, formData, user!.sub!)
      )
        .then(() => {
          createToast("success", "Profile has been updated");
          navigate("/");
        })
        .catch(() => createToast("error", "Unable to update profile"));
    });
  };

  return (
    <div className="min-h-screen">
      <div className="z-50 fixed top-4 left-4">
        <Navbar />
      </div>
      <div className="bg-blue-gray min-h-screen px-2 py-8 flex items-center justify-center bg-center">
        <form
          onSubmit={onSubmit}
          className="w-full md:w-1/2 flex flex-col gap-4 rounded-lg bg-white p-8 drop-shadow-lg"
        >
          <div className="text-2xl text-green-600 self-center">
            Update Profile
          </div>
          <label className="px-4 relative place-self-center cursor-pointer flex flex-col items-center">
            <img
              src={
                avatarURL === ""
                  ? `${process.env.REACT_APP_API_SERVER_URL}/users/${user!
                      .sub!}/avatar`
                  : avatarURL
              }
              alt="avatar"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "/default_avatar.png";
              }}
              className="w-24 h-24 rounded-full bg-contain border"
            />
            <div className="absolute top-0 right-0 flex items-center gap-1">
              <div className="text-xs text-blue-500">edit</div>
            </div>

            <input
              type="file"
              name="avatar"
              onChange={onAvatarUpdate}
              className="hidden"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-green-900">Name</span>
            <TextInput
              name="name"
              value={name}
              onChangeHandler={setName}
              required={true}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-green-900">About</span>
            <TextAreaInput
              name="about"
              value={about}
              onChangeHandler={setAbout}
              required={false}
            />
          </label>
          <div>
            <span className="text-green-900">Location</span>
            <div className="w-full h-72 md:h-96">
              <MapLibreAddMarker
                setLngLat={setLngLat}
                initMarkerLngLat={initLngLat}
              />
            </div>
          </div>
          <div className="w-full">
            <span className="text-green-900">Preferences</span>
            <TagListInput tags={preferences} setTags={setPreferences} />
          </div>
          <input
            type="submit"
            value="Update"
            className="cursor-pointer self-center py-2 px-2 rounded-lg bg-green-600 text-green-50"
          />
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
