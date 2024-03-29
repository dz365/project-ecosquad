import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPost } from "../service/test.service";
import { getUser } from "../service/test.service";
import { deletePost } from "../service/test.service";
import ReactModal from "react-modal";

interface DisplayPost {
  postId: number;
  userId: string;
  displayHandler: (e: any) => void;
  deleteHandler: (e: number) => void;
}

const DisplayPost: React.FC<DisplayPost> = ({
  postId,
  userId,
  displayHandler,
  deleteHandler,
}) => {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  const [invalidPostId, setInvalidPostId] = useState(false);
  const [invalidUserId, setInvalidUserId] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Determining type...");
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Determining location...");
  const [files, setFiles] = useState<any>([]);
  const [fileIndex, setFileIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(true);

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
          setShowModal(false);
          setFileIndex(0);

          if (res.files.length > 0) {
            setIsFileLoading(true);
          } else {
            setIsFileLoading(false);
          }
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

  useEffect(() => {
    if (
      isFileLoading &&
      files.length > 0 &&
      fileIndex >= 0 &&
      fileIndex < files.length
    ) {
      if (files[fileIndex].metadata.mimetype.startsWith("image/")) {
        loadFileImage().then(() => {
          setIsFileLoading(false);
        });
      } else if (files[fileIndex].metadata.mimetype.startsWith("video/")) {
        setIsFileLoading(false);
      } else if (files[fileIndex].metadata.mimetype.startsWith("audio/")) {
        setIsFileLoading(false);
      }
    }
  }, [isFileLoading, fileIndex, files]);

  const deleteClickHandler = () => {
    getAccessTokenSilently().then((token) => {
      deletePost(token, postId)
        .then(() => {
          deleteHandler(postId);
          displayHandler(0);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const loadFileImage = () => {
    const loadingFile = new Image();
    const url = `${process.env.REACT_APP_API_SERVER_URL}/files/${files[fileIndex].id}`;
    const file = document.querySelector("#file-panel")?.querySelector("img");

    return new Promise((resolve) => {
      if (file) {
        file.src = "";
        file.alt = "loading image";
        loadingFile.onload = () => {
          file.src = loadingFile.src;
          file.alt = "image file";
          resolve(file);
        };
        loadingFile.src = url;
      }
    });
  };

  if (invalidPostId || invalidUserId) return <></>;

  return (
    <>
      <div className="flex flex-col gap-2 border rounded-lg shadow w-full">
        {files &&
          files.length > 0 &&
          fileIndex < files.length &&
          fileIndex >= 0 && (
            <div
              id="file-panel"
              className="flex flex-col justify-between bg-gray-100 w-full h-80"
            >
              {files[fileIndex].metadata.mimetype.startsWith("image/") && (
                <img
                  src=""
                  alt="image file"
                  className={`object-contain self-center max-w-max h-full my-6 ${
                    isFileLoading && "hidden"
                  }`}
                />
              )}
              {files[fileIndex].metadata.mimetype.startsWith("video/") && (
                <video className="w-full h-56 my-4" controls>
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
              <div className="flex items-center justify-center self-center gap-2 bg-white w-full pt-2">
                <button
                  onClick={() => {
                    setFileIndex(fileIndex - 1);
                    setIsFileLoading(true);
                  }}
                  className={`${
                    (isFileLoading || (fileIndex <= 0 && files.length > 0)) &&
                    "cursor-default opacity-25"
                  }`}
                  disabled={
                    isFileLoading || (fileIndex <= 0 && files.length > 0)
                  }
                >
                  <div className="bg-leftarrow bg-center bg-no-repeat w-12 h-6 sm:w-4 sm:h-10"></div>
                </button>
                <p className="text-gray-500">
                  {fileIndex + 1}/{files.length}
                </p>
                <button
                  onClick={() => {
                    setFileIndex(fileIndex + 1);
                    setIsFileLoading(true);
                  }}
                  className={`${
                    (isFileLoading || fileIndex >= files.length - 1) &&
                    "cursor-default opacity-25"
                  }`}
                  disabled={isFileLoading || fileIndex >= files.length - 1}
                >
                  <div className="bg-rightarrow bg-center bg-no-repeat w-12 h-6 sm:w-4 sm:h-10"></div>
                </button>
              </div>
            </div>
          )}
        <div className="flex flex-col gap-5 px-2 mt-2">
          <p className="font-light">{description}</p>
          <div>
            <div className="flex items-center">
              <div className="bg-locationpin w-5 h-5 bg-contain bg-center bg-no-repeat"></div>
              <p className="text-xs font-light px-2">{location}</p>
            </div>
            <div className="flex items-center pt-2">
              <div className="bg-telescope w-4 h-4 bg-contain bg-center bg-no-repeat"></div>
              <span className="text-xs font-light px-3">{type}</span>
            </div>
          </div>
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
        <div className="flex gap-4 px-2 my-2">
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
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 mb-2 px-2">
            <button
              onClick={() => navigate(`/posts/${postId}/edit`)}
              className="bg-blue-500 opacity-95 hover:opacity-75 rounded-lg text-gray-50 px-6 py-2 w-full"
            >
              Edit
            </button>
            <button
              onClick={openModal}
              className="bg-red-500 opacity-95 hover:opacity-75 rounded-lg text-gray-50 px-6 py-2 w-full"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <ReactModal
        isOpen={showModal}
        onRequestClose={closeModal}
        className={"fixed z-30 w-full sm:w-96 top-1/4 sm:right-1/3"}
        overlayClassName={
          "fixed top-0 z-20 w-screen h-screen bg-gray-50 opacity-95"
        }
      >
        <div className="flex flex-col gap-6 rounded-md bg-white p-10 drop-shadow-md">
          <p className="self-center">
            Are you sure you want to delete this post?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
            <button
              onClick={closeModal}
              className="bg-blue-500 opacity-95 hover:opacity-75 rounded-lg text-gray-50 px-6 py-2 w-full"
            >
              Cancel
            </button>
            <button
              onClick={deleteClickHandler}
              className="bg-red-500 opacity-95 hover:opacity-75 rounded-lg text-gray-50 px-6 py-2 w-full"
            >
              Delete
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default DisplayPost;
