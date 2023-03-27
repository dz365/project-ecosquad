import { useEffect, useState } from "react";
import searchIndex from "../MeilisearchClient";
import DistanceFilter from "./SearchFilters/DistanceFilter";
import TypeFilter from "./SearchFilters/TypeFilter";

interface SearchComponent {
  searchHandler: (e: any) => void;
}

const SearchComponent: React.FC<SearchComponent> = ({ searchHandler }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [lng, setLng] = useState("");
  const [lat, setLat] = useState("");
  const [distanceFilter, setDistanceFilter] = useState<number>();

  useEffect(() => {
    let filter = "";
    if (typeFilters.length > 0)
      filter += `properties.type IN [${typeFilters}] `;
    if (lng && lat && distanceFilter) {
      if (filter !== "") filter += "AND ";
      filter += `_geoRadius(${lat}, ${lng}, ${distanceFilter})`;
    }

    searchIndex
      .search(searchQuery, {
        filter: filter,
      })
      .then((res) => searchHandler(res));
  }, [searchQuery, typeFilters, lng, lat, distanceFilter]);

  const resetFilters = () => {
    setTypeFilters([]);
    setLat("");
    setLng("");
    setDistanceFilter(undefined);
  };

  return (
    <div className="relative flex flex-col">
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
        <button onClick={() => setShowFilters(!showFilters)}>
          <div className="bg-vertical-dots w-4 h-4 bg-center bg-no-repeat"></div>
        </button>
      </label>
      {showFilters && (
        <div className="absolute top-10 bg-white rounded-lg p-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <span>Advanced Search</span>
            <button
              className="border text-sm px-2 py-1 rounded-lg"
              onClick={() => resetFilters()}
            >
              Clear filters
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <TypeFilter
              filteredTypes={typeFilters}
              setFilteredTypes={setTypeFilters}
            />
            <DistanceFilter
              lng={lng}
              lat={lat}
              setLng={setLng}
              setLat={setLat}
              distanceFilter={distanceFilter}
              setDistanceFilter={setDistanceFilter}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
