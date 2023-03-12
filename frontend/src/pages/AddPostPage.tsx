import { useState } from "react";
import FileInput from "../components/FileInput";
import TextAreaInput from "../components/controlled/TextareaInput";
import TextInput from "../components/controlled/TextInput";
import MapLibre from "../components/MapLibre";
import PageLayout from "./PageLayout";
import SubmitInput from "../components/controlled/SubmitInput";

const AddPostPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInputText, setTagInputText] = useState("");
  interface LabelText {
    text: string;
  }
  const LabelText: React.FC<LabelText> = ({ text }) => {
    return <span className="text-xl text-green-600">{text}</span>;
  };

  const onSubmitForm = (e: any) => {
    e.preventDefault();
  };
  const preventEnterKeyAction = (e: any) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const tagInputKeyDown = (e: any) => {
    if (e.key !== "Enter" || e.target.value === "") return;
    addNewTag(e.target.value);
  };
  const addNewTag = (tag: string) => {
    setTags((prevTags) => [...prevTags, tag]);
    setTagInputText("");
  };

  const deleteTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <PageLayout>
      <div className="flex">
        <div className="w-8/12 h-screen">
          <MapLibre />
        </div>
        <div className="z-10 w-4/12 h-screen p-4 overflow-y-auto">
          <form
            className="flex flex-col gap-4"
            onKeyDown={preventEnterKeyAction}
            onSubmit={onSubmitForm}
          >
            <label className="flex flex-col gap-2">
              <LabelText text="Title" />
              <TextInput
                name="title"
                value={title}
                onChangeHandler={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <LabelText text="Description" />
              <TextAreaInput
                name="description"
                value={description}
                onChangeHandler={(e) => setDescription(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <LabelText text="Upload Files" />
              <FileInput
                multiple={true}
                name="files"
                onChangeHandler={(e) => setFiles(e.target.files)}
              />

              {files?.length! > 0 && (
                <div className="flex flex-col border rounded-lg p-2">
                  {Array.from(files!).map((file, i) => (
                    <span key={i + file.name} className="text-sm text-gray-500">
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </label>
            <label className="flex gap-4">
              <LabelText text="Time Recorded" />
              <input name="time" type="datetime-local" />
            </label>
            <label className="flex gap-4">
              <LabelText text="Post Type" />
              <select name="type" className="p-2 rounded-md bg-gray-100">
                <option value="animal">Animal</option>
                <option value="plant">Plant</option>
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
                      <span> {tag} </span>
                      <div
                        className="cursor-pointer"
                        onClick={() => deleteTag(i)}
                      >
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
              <SubmitInput text="Add Post" />
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default AddPostPage;
