import { useEffect, useState } from "react";
import FileInput from "./FileInput";
import TextAreaInput from "./controlled/TextareaInput";
import SubmitInput from "./controlled/SubmitInput";
import { useAuth0 } from "@auth0/auth0-react";
import { LngLat } from "maplibre-gl";
import { createPost, getPost, updatePost } from "../service/test.service";
import { ToastContainer, toast } from "react-toastify";

type PostForm = {
  lnglat: LngLat | undefined;
  postFormSubmitHandler: () => void;
  postId?: number;
};

const PostForm: React.FC<PostForm> = ({
  lnglat,
  postFormSubmitHandler,
  postId = undefined,
}) => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList>();
  const [tags, setTags] = useState<string[]>([]);
  const [type, setType] = useState("");
  const [tagInputText, setTagInputText] = useState("");

  const { user, getAccessTokenSilently } = useAuth0();

  interface LabelText {
    text: string;
  }
  const LabelText: React.FC<LabelText> = ({ text }) => {
    return <span className="text-xl text-green-600">{text}</span>;
  };

  useEffect(() => {
    if (!postId) return;
    getAccessTokenSilently().then((token) => {
      getPost(token, postId).then((res) => {
        setDescription(res.post.description);
        setTags(res.post.tags);
        setType(res.post.type);
      });
    });
  }, [postId]);

  const onSubmitForm = (e: any) => {
    e.preventDefault();

    getAccessTokenSilently().then((token) => {
      if (!lnglat) return;

      const formData = new FormData(e.target);
      formData.set("tags", JSON.stringify(tags));
      formData.set("coordinates", JSON.stringify(lnglat.toArray()));

      if (postId) {
        updatePost(token, postId, formData)
          .then(() => {
            toast.success("Successfully updated post", {
              toastId: "updated post",
              position: "top-center",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            postFormSubmitHandler();
          })
          .catch((err) => console.log(err));
      } else {
        formData.set("userId", user!.sub!.toString());
        createPost(token, formData)
          .then(() => {
            toast.success("Successfully created post", {
              toastId: "create post",
              position: "top-center",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            postFormSubmitHandler();
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const preventEnterKeyAction = (e: any) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const tagInputKeyDown = (e: any) => {
    if (e.key !== "Enter") return;
    if (e.target.value.trim() === "") return;
    addNewTag(e.target.value);
  };
  const addNewTag = (tag: string) => {
    if (tag.trim() === "") return;
    setTags((prevTags) => [...prevTags, tag]);
    setTagInputText("");
  };

  const deleteTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <>
      <ToastContainer />
      <form
        className="flex flex-col gap-4"
        onKeyDown={preventEnterKeyAction}
        onSubmit={onSubmitForm}
      >
        {postId && (
          <p>
            Unfortunately we don't currently support editing your post files
            after upload. If you do wish to do so, you must create a new post.
          </p>
        )}
        {!postId && (
          <label className="flex flex-col gap-2">
            <LabelText text="Upload Files" />
            <FileInput
              accept="image/*,video/*,audio/*"
              multiple={true}
              name="files"
              onChangeHandler={(e) => setFiles(e.target.files)}
            />

            {files?.length! > 0 && (
              <div className="flex flex-col border rounded-lg p-2">
                {Array.from(files!).map((file, i) => (
                  <span
                    key={i + file.name}
                    className={`text-sm text-gray-500 ${
                      i % 2 == 1 && "text-gray-400"
                    }`}
                  >
                    {i + 1}: {file.name}
                  </span>
                ))}
              </div>
            )}
          </label>
        )}
        <label className="flex flex-col gap-2">
          <LabelText text="Description" />
          <TextAreaInput
            name="description"
            value={description}
            onChangeHandler={setDescription}
            required={true}
          />
        </label>
        <label className="flex gap-4">
          <LabelText text="Post Type" />
          <select
            name="type"
            className="p-2 rounded-md bg-gray-100"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option disabled hidden value="">
              - Select a type -
            </option>
            <option value="lithosphere">Lithosphere</option>
            <option value="hydrosphere">Hydrosphere</option>
            <option value="biosphere">Biosphere</option>
            <option value="atmosphere">Atmosphere</option>
            <option value="weather">Weather</option>
            <option value="space">Space</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <LabelText text="Post Tags" />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <div
                  key={i + tag}
                  className="flex gap-2 bg-gray-100 text-gray-600 p-2 rounded-lg"
                >
                  <span>{tag}</span>
                  <div className="cursor-pointer" onClick={() => deleteTag(i)}>
                    &#10005;
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="self-center mt-4 flex gap-2 items-center bg-gray-100 text-gray-600 p-2 rounded-lg">
            <input
              name="tags"
              onKeyDown={tagInputKeyDown}
              value={tagInputText}
              onChange={(e) => setTagInputText(e.target.value)}
              className="bg-gray-50 border rounded-lg p-1"
            />
            <span
              className="cursor-pointer"
              onClick={() => addNewTag(tagInputText)}
            >
              Enter
            </span>
          </div>
        </label>
        <div className="flex justify-center mt-16">
          <SubmitInput text={postId ? "Update post" : "Add post"} />
        </div>
      </form>
    </>
  );
};

export default PostForm;
