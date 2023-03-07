import { useAuth0 } from "@auth0/auth0-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "./PageLayout";

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const [avatarURL, setAvatarURL] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [privateProfile, setPrivateProfile] = useState(true);

  const { user } = useAuth0();

  /*
  fetch(user!.picture!).then(res => {
      res.blob().then((data) => {
        let metadata = {
          type: 'image/jpeg'
        };
        const file = new File([data], "test.jpg", metadata);
      });
  */
  useEffect(() => {
    setAvatarURL(user?.picture ?? "");
  }, [user?.sub]);

  const onAvatarUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const avatar = e.target.files;
    if (avatar && avatar[0]) {
      console.log(avatar[0]);
      setAvatarURL(URL.createObjectURL(avatar[0]));
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target);
    navigate("/");
  };

  return (
    <PageLayout>
      <div
        className="bg-green-100 min-h-screen pt-8 flex items-center justify-center bg-center"
        style={{ backgroundImage: "url(/background.svg)" }}
      >
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-8 rounded-lg bg-white p-8 drop-shadow-lg"
        >
          <div className="text-2xl text-green-600 self-center">
            Update Profile
          </div>
          <label className="px-14 relative place-self-center cursor-pointer flex flex-col items-center">
            <img
              src={avatarURL}
              alt="avatar"
              className="w-24 h-24 rounded-full"
            />
            <div className="absolute top-0 right-0 flex items-center gap-1">
              <div
                className="w-4 h-4 bg-cover opacity-75"
                style={{ backgroundImage: "url(icons/pencil.png)" }}
              ></div>
              <div className="text-xs text-gray-700">edit</div>
            </div>

            <input
              type="file"
              name="avatar"
              onChange={onAvatarUpdate}
              className="hidden"
            />
          </label>
          <label className="flex flex-col">
            <div className="text-green-900">Name</div>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border outline-none focus:border-gray-700 text-gray-700 rounded-lg px-2 py-1"
            />
          </label>
          <label className="flex flex-col">
            <div className="text-green-900">About</div>
            <textarea
              name="bio"
              placeholder="Tell people who you are."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border outline-none focus:border-gray-700 text-gray-700 rounded-lg px-2 py-1"
            />
          </label>
          <input
            type="submit"
            value="Update"
            className="py-2 px-2 rounded-lg bg-green-600 text-green-50"
          />
        </form>
      </div>
    </PageLayout>
  );
};

export default UpdateProfilePage;
