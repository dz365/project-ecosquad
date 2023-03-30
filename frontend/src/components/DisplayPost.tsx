import { useAuth0 } from "@auth0/auth0-react";
import { LngLat } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPost } from "../service/test.service";
import { getUser } from "../service/test.service";

interface DisplayPost {
  postId: number;
  userId: string;
}

interface LabelText {
  text: string;
}
const LabelText: React.FC<LabelText> = ({ text }) => {
  return <span className="text-xl text-green-600">{text}</span>;
};

const DisplayPost: React.FC<DisplayPost> = ({ postId, userId }) => {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  const [invalidPostId, setInvalidPostId] = useState(false);
  const [invalidUserId, setInvalidUserId] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Unable to determine location");
  const [files, setFiles] = useState<any>([]);
  const [fileIndex, setFileIndex] = useState(0);

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      getPost(token, postId)
        .then((res) => {
          setInvalidPostId(false);
          setDescription(res.post.description);
          setType(res.post.type);
          setTags(res.post.tags);
          setLocation(res.post.location);
          setFiles(res.files);
        })
        .catch(() => setInvalidPostId(true));
      getUser(token, userId)
        .then((res) => {
          setInvalidUserId(false);
          setName(res.name);
          setEmail(res.email);
        })
        .catch(() => setInvalidUserId(true));
    });
  }, [user?.sub, postId, userId]);

  if (invalidPostId || invalidUserId) return <></>;

  return (
    <div className="flex flex-col gap-4">
      {files && files.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 relative w-full sm:w-80 h-80">
          {files[fileIndex].metadata.mimetype.startsWith("image/") && (
            <img
              src={`${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`}
              alt="file"
              className="object-contain w-full h-full"
            />
          )}
          {files[fileIndex].metadata.mimetype.startsWith("video/") && (
            <video className="w-full h-auto" controls>
              <source
                src={`${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`}
                type={files[fileIndex].metadata.mimetype}
              ></source>
              Your browser doesn't support this video format.
            </video>
          )}
          {files[fileIndex].metadata.mimetype.startsWith("audio/") && (
            <audio className="w-full h-20 my-20" controls>
              <source
                src={`${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`}
                type={files[fileIndex].metadata.mimetype}
              ></source>
              Your browser doesn't support this audio format.
            </audio>
          )}
          <div className="flex items-center justify-between self-center gap-2">
            <button
              onClick={() => {
                setFileIndex(fileIndex - 1);
              }}
              className={`${
                fileIndex <= 0 &&
                files.length > 0 &&
                "cursor-default opacity-25"
              }`}
              disabled={fileIndex <= 0 && files.length > 0}
            >
              <div className="bg-leftarrow bg-center bg-no-repeat w-12 h-6 sm:w-4 sm:h-10"></div>
            </button>
            <p className="text-gray-500">
              {fileIndex + 1}/{files.length}
            </p>
            <button
              onClick={() => {
                setFileIndex(fileIndex + 1);
              }}
              className={`${
                fileIndex >= files.length - 1 && "cursor-default opacity-25"
              }`}
              disabled={fileIndex >= files.length - 1}
            >
              <div className="bg-rightarrow bg-center bg-no-repeat w-12 h-6 sm:w-4 sm:h-10"></div>
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <LabelText text="Description" />
        <p>{description}</p>
        <LabelText text="Type" />
        <p>{type}</p>
        <LabelText text="Location" />
        <div>
          <p>{location}</p>
        </div>
        <LabelText text="Tags" />
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <div
              key={tag + i}
              className="flex gap-2 bg-gray-100 text-gray-600 p-2 rounded-lg"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <img
          src={`${process.env.REACT_APP_API_SERVER_URL}/users/${userId}/avatar`}
          alt="avatar"
          className="w-12 h-12 rounded-full border"
        />
        <div className="flex flex-col">
          <p className="text-green-600">{name}</p>
          <p className="text-gray-500 text-sm font-light">{email}</p>
        </div>
      </div>
      {user!.sub === userId && (
        <button
          onClick={() => navigate(`/posts/${postId}/edit`)}
          className="bg-blue-500 opacity-95 rounded-lg text-gray-50 px-6 py-1 self-center my-2 flex items-center gap-3"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default DisplayPost;
