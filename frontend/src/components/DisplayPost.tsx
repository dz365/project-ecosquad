import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { getPost } from "../service/test.service";
import { getUser } from "../service/test.service";

interface DisplayPost {
  postId: number;
  userId: string;
}

const DisplayPost: React.FC<DisplayPost> = ({ postId, userId }) => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState("");
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
      });
    });
  }, [user?.sub, postId, userId]);

  // depending on file type display different tag
  // {true && <p>true</p>}

  // display user of the post
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <img
          src={`${process.env.REACT_APP_API_SERVER_URL}/users/${userId}/avatar`}
          alt="avatar"
          className="w-12 h-12 rounded-full border"
        />
        <p className="text-green-600">{name}</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        {fileIndex <= files.length - 1 && fileIndex > 0 && (
          <div
            className="cursor-pointer bg-leftarrow bg-center bg-no-repeat w-12 h-6 sm:w-4 sm:h-10"
            onClick={() => {
              setFileIndex(fileIndex - 1);
            }}
          ></div>
        )}
        {files.length > 0 &&
          files[fileIndex].metadata.mimetype.startsWith("image/") && (
            <img
              src={`${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`}
              alt="file"
              className="w-4/5"
            />
          )}
        {files.length > 0 &&
          files[fileIndex].metadata.mimetype.startsWith("video/") && (
            <video className="w-4/5" controls>
              <source
                src={`${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`}
                type={files[fileIndex].metadata.mimetype}
              ></source>
              Your browser doesn't support this video format.
            </video>
          )}
        {files.length > 0 &&
          files[fileIndex].metadata.mimetype.startsWith("audio/") && (
            <audio className="w-4/5" controls>
              <source
                src={`${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`}
                type={files[fileIndex].metadata.mimetype}
              ></source>
              Your browser doesn't support this audio format.
            </audio>
          )}
        {fileIndex < files.length - 1 && fileIndex >= 0 && (
          <div
            className="cursor-pointer bg-rightarrow bg-center bg-no-repeat w-12 h-6 sm:w-4 sm:h-10"
            onClick={() => {
              setFileIndex(fileIndex + 1);
            }}
          ></div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <p>{description}</p>
        <div className="flex flex-col gap-2">
          <p>Type: {type}</p>
          <p>Location: {location}</p>
        </div>
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
    </div>
  );
};

export default DisplayPost;
