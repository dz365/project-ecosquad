import { useState } from "react";

interface ITagListInput {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagListInput: React.FC<ITagListInput> = ({ tags, setTags }) => {
  const [tagInputText, setTagInputText] = useState("");

  const tagInputKeyDown = (e: any) => {
    if (e.key !== "Enter") return;
    if (e.target.value.trim() === "") return;
    e.preventDefault();
    addNewTag(e.target.value);
  };
  const addNewTag = (tag: string) => {
    if (tag.trim() === "") return;
    setTags([...tags, tag]);
    setTagInputText("");
  };

  const deleteTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
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

      <div className="self-start flex gap-2 items-center bg-gray-100 p-2 rounded-lg">
        <input
          name="tags"
          onKeyDown={tagInputKeyDown}
          value={tagInputText}
          onChange={(e) => setTagInputText(e.target.value)}
          className="bg-gray-50 border rounded-lg p-1"
        />
        <span
          className="cursor-pointer text-sm text-gray-600"
          onClick={() => addNewTag(tagInputText)}
        >
          Add
        </span>
      </div>
    </div>
  );
};

export default TagListInput;
