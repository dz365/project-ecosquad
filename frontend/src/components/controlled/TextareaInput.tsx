import { InputModel } from "../../models/InputModel";

const TextAreaInput: React.FC<InputModel> = ({
  name,
  placeholder,
  value,
  onChangeHandler,
  required,
}) => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChangeHandler(e.target.value)}
      required={required}
      className="border text-gray-700 rounded-lg px-2 py-1"
    />
  );
};

export default TextAreaInput;
