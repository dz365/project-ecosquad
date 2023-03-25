import { InputModel } from "../../models/InputModel";

const TextInput: React.FC<InputModel> = ({
  name,
  placeholder,
  value,
  onChangeHandler,
}) => {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChangeHandler(e.target.value)}
      className="border text-gray-700 rounded-lg px-2 py-1"
    />
  );
};

export default TextInput;
