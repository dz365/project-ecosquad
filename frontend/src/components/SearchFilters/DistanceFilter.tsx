interface DistanceFilter {
  lng: string;
  lat: string;
  setLng: (lng: string) => void;
  setLat: (lat: string) => void;
  distanceFilter: number | undefined;
  setDistanceFilter: (distance: number | undefined) => void;
}

const DistanceFilter: React.FC<DistanceFilter> = ({
  lng,
  lat,
  setLat,
  setLng,
  distanceFilter,
  setDistanceFilter,
}) => {
  type lnglat = "lng" | "lat";
  const distances = [1000, 5000, 10000, 50000, 100000];

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
    <div className="flex flex-col gap-2">
      <span className="text-green-600">Distance</span>
      <div className="flex gap-2">
        <input
          name="lat"
          placeholder="Latitude"
          value={lat}
          maxLength={8}
          onChange={(e) => handleCoordinateChange("lat", e.target.value)}
          required={true}
          className="w-20 text-sm border px-1 py-px rounded-lg"
        />
        <input
          name="lng"
          placeholder="Longitude"
          maxLength={8}
          value={lng}
          onChange={(e) => handleCoordinateChange("lng", e.target.value)}
          required={true}
          className="w-20 text-sm border px-1 py-px rounded-lg"
        />
      </div>
      <div className="flex flex-col gap-2">
        {distances.map((distance) => (
          <label className="flex gap-2" key={`distance-filter-${distance}`}>
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
  );
};

export default DistanceFilter;
