import { useEffect, useState } from "react";
interface SearchComponent {
  searchHandler: (e: any) => void;
}

const SearchComponent: React.FC<SearchComponent> = ({ searchHandler }) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    searchHandler(searchQuery);
  }, [searchQuery]);

  return (
    <label className="flex gap-4">
      <input
        className="outline-none w-full text-sm px-2"
        placeholder="Search Ecosquad"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button>
        <div className="bg-search w-4 h-4 bg-center bg-no-repeat"></div>
      </button>
    </label>
  );
};

export default SearchComponent;
