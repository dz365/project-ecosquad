import "./ToggleSwitch.css";

interface ToggleSwitch {
  inputName: string;
  checked: boolean;
  onChangeHandler: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitch> = ({
  inputName,
  checked,
  onChangeHandler,
}) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        name={inputName}
        checked={checked}
        onChange={onChangeHandler}
      />
      <span className="slider"></span>
    </label>
  );
};

export default ToggleSwitch;
