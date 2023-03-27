import { useEffect, useState } from "react";
import searchIndex from "../MeilisearchClient";
import { PostTypes } from "../models/PostTypes";

interface SearchComponent {
  searchHandler: (e: any) => void;
}

const SearchComponent: React.FC<SearchComponent> = ({ searchHandler }) => {
  type lnglat = "lng" | "lat";
  const distances = [1000, 5000, 10000, 50000, 100000];

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [lng, setLng] = useState("");
  const [lat, setLat] = useState("");
  const [distanceFilter, setDistanceFilter] = useState<number>();

  useEffect(() => {
    console.log(distanceFilter);
    let filter = "";

    if (typeFilter.length > 0) filter += `properties.type IN [${typeFilter}] `;
    if (lng && lat && distanceFilter) {
      if (filter !== "") filter += "AND ";
      filter += `_geoRadius(${lat}, ${lng}, ${distanceFilter})`;
    }

    searchIndex
      .search(searchQuery, {
        filter: filter,
      })
      .then((res) => searchHandler(res));
  }, [searchQuery, typeFilter, lng, lat, distanceFilter]);

  const resetFilters = () => {
    setTypeFilter([]);
    setLat("");
    setLng("");
    setDistanceFilter(undefined);
  };

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
    if (!isNaN(+value)) {
      if (value === "" || value.endsWith(".")) {
        return type === "lat" ? setLat(value) : setLng(value);
      }
      let intValue = +value;
      if (type === "lat") {
        if (intValue < -90) intValue = -90;
        if (intValue > 90) intValue = 90;
      } else {
        if (intValue < -180) intValue = -180;
        if (intValue > 180) intValue = 180;
      }
      type === "lat" ? setLat("" + intValue) : setLng("" + intValue);
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
                    maxLength={8}
                    value={lng}
                    onChange={(e) =>
                      handleCoordinateChange("lng", e.target.value)
                    }
                    required={true}
                    className="w-20 text-sm border px-1 py-px rounded-lg"
                  />
                  <input
                    name="lat"
                    placeholder="Latitude"
                    value={lat}
                    maxLength={8}
                    onChange={(e) =>
                      handleCoordinateChange("lat", e.target.value)
                    }
                    required={true}
                    className="w-20 text-sm border px-1 py-px rounded-lg"
                  />
                </label>
              </div>
              <div className="flex flex-col gap-2">
                {distances.map((distance) => (
                  <label
                    className="flex gap-2"
                    key={`distance-filter-${distance}`}
                  >
                    <input
                      type="radio"
                      value={distance}
                      checked={distanceFilter === distance}
                      onChange={() => setDistanceFilter(distance)}
                    />
                    <span>Within {distance / 1000}km</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
