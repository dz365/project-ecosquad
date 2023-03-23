import { useEffect, useState } from "react";
import Navbar from "../navigation/Navbar";

interface SearchComponent {
  searchHandler: (e: any) => void;
}
const SearchComponent: React.FC<SearchComponent> = ({ searchHandler }) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    searchHandler(searchQuery);
  }, [searchQuery]);

  return (
    <div className="w-96 h-12 flex items-center justify-between gap-4 bg-white rounded-lg px-4 py-2 shadow">
      <Navbar iconSize={"sm"} />
      <input
        className="outline-none grow text-sm px-2"
        placeholder="Search Ecosquad"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="w-4 h-4 bg-search" />
    </div>
  );
};

export default SearchComponent;
