import { LngLat } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { search } from "../MeilisearchClient";
import Navbar from "../navigation/Navbar";
import DistanceFilter from "./SearchFilters/DistanceFilter";
import LocationSearch from "./SearchFilters/LocationSearch";
import SortBy from "./SearchFilters/SortBy";
import TypeFilter from "./SearchFilters/TypeFilter";

interface SearchComponent {
  searchHandler: (e: any) => void;
}

const SearchBarComponent: React.FC<SearchComponent> = ({ searchHandler }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState<LngLat>();

  const [distanceFilter, setDistanceFilter] = useState<number>();
  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    let filter = "";
    const lng = location?.lng;
    const lat = location?.lat;

    if (typeFilters.length > 0)
      filter += `properties.type IN [${typeFilters}] `;
    if (lng && lat && distanceFilter) {
      if (filter !== "") filter += "AND ";
      filter += `_geoRadius(${lat}, ${lng}, ${distanceFilter})`;
    }

    let sortBy = [];
    if (sort === "distance" && lat && lng) {
      sortBy.push(`_geoPoint(${lat}, ${lng}):asc`);
    }
    if (sort === "dateposted") {
      sortBy.push("properties.createdAt:desc");
    }

    search(searchQuery, filter, sortBy).then((res) => searchHandler(res));
  }, [searchQuery, typeFilters, location, distanceFilter, sort]);

  const resetFilters = () => {
    setTypeFilters([]);
    setDistanceFilter(undefined);
  };

  return (
    <div className="fixed top-2 left-4 z-20 w-full">
      <div className="w-11/12 sm:w-96 h-12 flex items-center justify-around gap-4 bg-white rounded-lg px-4 py-2 shadow">
        <Navbar iconSize={"sm"} />
        <div className="flex gap-4">
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
        </div>
        <div className="w-px h-full border-l"></div>
        <button
          className="rotate-45 bg-green-600"
          onClick={() => navigate("/posts/new")}
        >
          <div className="-rotate-45 w-4 h-4 bg-center bg-no-repeat bg-plus"></div>
        </button>
        {showFilters && (
          <div className="absolute top-16 left-0 bg-blue-gray rounded-lg p-4 flex flex-col gap-2 shadow">
            <div className="flex gap-8 justify-between">
              <span className="text-blue-600">Advanced Search</span>
              <button
                className="border text-sm px-2 py-1 rounded-lg"
                onClick={() => resetFilters()}
              >
                Clear filters
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-8">
              <LocationSearch setLocation={setLocation} />
              <TypeFilter
                filteredTypes={typeFilters}
                setFilteredTypes={setTypeFilters}
              />
              <DistanceFilter
                distanceFilter={distanceFilter}
                setDistanceFilter={setDistanceFilter}
              />
              <SortBy sort={sort} setSort={setSort} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBarComponent;
