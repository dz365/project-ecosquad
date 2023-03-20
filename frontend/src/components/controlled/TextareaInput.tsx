import { InputModel } from "../../models/InputModel";

const TextAreaInput: React.FC<InputModel> = ({
  name,
  placeholder,
  value,
  onChangeHandler,
}) => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChangeHandler(e)}
      className="border text-gray-700 rounded-lg px-2 py-1"
    />
  );
};

export default TextAreaInput;
