import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
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
  const { user, getAccessTokenSilently } = useAuth0();
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<any>([]);
  const [fileIndex, setFileIndex] = useState(0);

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      getPost(token, postId).then((res) => {
        setDescription(res.post.description);
        setType(res.post.type);
        setTags(res.post.tags);
        setLocation(res.post.location);
        setFiles(res.files);
        console.log(res);
      });
      getUser(token, userId).then((res) => {
        setName(res.name);
        setEmail(res.email);
        console.log(res.id);
      });
    });
  }, [user?.sub, postId, userId]);

  // depending on file type display different tag
  // {true && <p>true</p>}

  // display user of the post
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center relative w-full sm:w-80 h-80">
        {files.length > 0 &&
          files[fileIndex].metadata.mimetype.startsWith("image/") && (
            <img
              src={`${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`}
              alt="file"
              className="w-full h-auto"
            />
          )}
        {files.length > 0 &&
          files[fileIndex].metadata.mimetype.startsWith("video/") && (
            <video className="w-full h-auto" controls>
              <source
                src={`${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`}
                type={files[fileIndex].metadata.mimetype}
              ></source>
              Your browser doesn't support this video format.
            </video>
          )}
        {files.length > 0 &&
          files[fileIndex].metadata.mimetype.startsWith("audio/") && (
            <audio className="w-full h-20" controls>
              <source
                src={`${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`}
                type={files[fileIndex].metadata.mimetype}
              ></source>
              Your browser doesn't support this audio format.
            </audio>
          )}
        <div className="absolute bottom-0 flex items-center justify-between self-center gap-2">
          <button
            onClick={() => {
              setFileIndex(fileIndex - 1);
            }}
            className={`cursor-pointer ${
              fileIndex <= 0 && files.length > 0 && "cursor-default opacity-0"
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
            className={`cursor-pointer ${
              fileIndex >= files.length - 1 && "cursor-default opacity-0"
            }`}
            disabled={fileIndex >= files.length - 1}
          >
            <div className="bg-rightarrow bg-center bg-no-repeat w-12 h-6 sm:w-4 sm:h-10"></div>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <LabelText text="Description" />
        <p>{description}</p>
        <LabelText text="Type" />
        <p>{type}</p>
        <LabelText text="Location" />
        <p>{location}</p>
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
    </div>
  );
};

export default DisplayPost;
