interface SubmitInput {
  text: string;
}
const SubmitInput: React.FC<SubmitInput> = ({ text }) => {
  return (
    <input
      type="submit"
      value={text}
      className="py-2 px-4 rounded-lg bg-green-600 text-green-50 cursor-pointer"
    />
  );
};

export default SubmitInput;
