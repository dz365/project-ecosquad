import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navigation/Navbar";

interface SearchComponent {
  searchHandler: (e: any) => void;
}
const SearchComponent: React.FC<SearchComponent> = ({ searchHandler }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    searchHandler(searchQuery);
  }, [searchQuery]);

  return (
    <div className="w-11/12 md:w-96 h-12 flex items-center justify-around gap-4 bg-white rounded-lg px-4 py-2 shadow">
      <Navbar iconSize={"sm"} />
      <input
        className="outline-none w-full text-sm px-2"
        placeholder="Search Ecosquad"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button>
        <div className="bg-search w-4 h-4 bg-center bg-no-repeat"></div>
      </button>
      <div className="w-px h-full border-l"></div>
      <button
        className="rotate-45 bg-green-600 p-px"
        onClick={() => navigate("/addpost")}
      >
        <div className="-rotate-45 bg-plus w-4 h-4 bg-center bg-no-repeat"></div>
      </button>
    </div>
  );
};

export default SearchComponent;
