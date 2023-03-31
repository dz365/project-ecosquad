import { useAuth0 } from "@auth0/auth0-react";
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
          setFileIndex(0);
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
    <div className="flex flex-col gap-4 border rounded-lg shadow w-full">
      <div>
        <div className="flex items-center pt-2 px-2">
          <div className="bg-locationpin w-5 h-5 bg-contain bg-center bg-no-repeat"></div>
          <p className="text-xs font-light px-2">{location}</p>
        </div>
        <div className="flex items-center pt-2 px-2">
          <div className="bg-telescope w-4 h-4 bg-contain bg-center bg-no-repeat"></div>
          <span className="text-xs font-light px-3">{type}</span>
        </div>
      </div>
      {files &&
        files.length > 0 &&
        fileIndex < files.length &&
        fileIndex >= 0 && (
          <div className="flex flex-col justify-between bg-gray-100 w-full h-80">
            {files[fileIndex].metadata.mimetype.startsWith("image/") && (
              <img
                src={`${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`}
                alt="file"
                className="object-contain self-center max-w-max h-full"
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
            <div className="flex items-center justify-center self-center gap-2 bg-white w-full">
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
      <div className="flex flex-col gap-5 px-2">
        <p className="font-light">{description}</p>
        <div className="flex flex-wrap gap-2 drop-shadow">
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
      <div className="flex gap-4 px-2 mb-2">
        <img
          src={`${process.env.REACT_APP_API_SERVER_URL}/users/${userId}/avatar`}
          alt="avatar"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "/default_avatar.png";
          }}
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
          className="bg-blue-500 opacity-95 rounded-lg text-gray-50 px-6 py-1 self-center mb-2"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default DisplayPost;
