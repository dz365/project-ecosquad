interface FileInput {
  multiple: boolean;
  name: string;
  onChangeHandler: (e: any) => void;
}
const FileInput: React.FC<FileInput> = ({
  multiple,
  name,
  onChangeHandler,
}) => {
  return (
    <label className="w-full h-28 bg-gray-200 opacity-80 rounded-lg flex flex-col items-center justify-center cursor-pointer">
      <div className="w-12 h-12 bg-upload bg-contain bg-center bg-no-repeat"></div>
      <span className="text-sm text-gray-600">Browse and upload files</span>
      <input
        type="file"
        multiple={multiple}
        name={name}
        onChange={(e) => onChangeHandler(e)}
        className="opacity-0 w-0 h-0"
      />
    </label>
  );
};

export default FileInput;
