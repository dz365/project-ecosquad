import { useNavigate } from "react-router-dom";

const AddPostButton = () => {
  const navigate = useNavigate();

  return (
    <div
      className="z-10 p-4 absolute bottom-6 right-4 rounded-full w-16 h-16 bg-green-600 cursor-pointer"
      onClick={() => navigate("/addpost")}
    >
      <div className="w-full h-full bg-center bg-no-repeat bg-plus"></div>
    </div>
  );
};

export default AddPostButton;
