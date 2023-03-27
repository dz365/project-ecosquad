import { useEffect, useState } from "react";
import { PostTypes } from "../models/PostTypes";
import TextInput from "./controlled/TextInput";
interface SearchComponent {
  searchHandler: (e: any) => void;
}

const SearchComponent: React.FC<SearchComponent> = ({ searchHandler }) => {
  type lnglat = "lng" | "lat";
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [lng, setLng] = useState("");
  const [lat, setLat] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    searchHandler(searchQuery);
  }, [searchQuery]);

  const handleTypeFilterChange = (event: any) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setTypeFilter([...typeFilter, value]);
    } else {
      setTypeFilter(typeFilter.filter((type) => type !== value));
    }
  };

  const handleCoordinateChange = (type: lnglat, value: string) => {
    if (/^$|^\d+(\.\d+)?$/.test(value)) {
      type === "lat" ? setLat(value) : setLng(value);
    }
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
        <div className="absolute top-10 bg-white rounded-lg p-4 flex flex-col sm:flex-row gap-8">
          <div className="flex flex-col">
            <span className="text-green-600">Types</span>
            {PostTypes.map((type) => (
              <label key={type.value + "-checkbox"} className="flex gap-2">
                <input
                  type="checkbox"
                  value={type.value}
                  checked={typeFilter.includes(type.value)}
                  onChange={handleTypeFilterChange}
                />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-green-600">Distance</span>
            <div className="flex gap-2">
              <label className="flex gap-2">
                <input
                  name="lng"
                  placeholder="Longitude"
                  value={lng}
                  onChange={(e) =>
                    handleCoordinateChange("lng", e.target.value)
                  }
                  required={true}
                  className="w-20"
                />
                <input
                  name="lat"
                  placeholder="Latitude"
                  value={lat}
                  onChange={(e) =>
                    handleCoordinateChange("lat", e.target.value)
                  }
                  required={true}
                  className="w-20"
                />
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex gap-2">
                <input
                  type="radio"
                  value="1km"
                  checked={locationFilter === "1km"}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
                Within 1km
              </label>
              <label className="flex gap-2">
                <input
                  type="radio"
                  value="5km"
                  checked={locationFilter === "5km"}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
                Within 5km
              </label>
              <label className="flex gap-2">
                <input
                  type="radio"
                  value="10km"
                  checked={locationFilter === "10km"}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
                Within 10km
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
