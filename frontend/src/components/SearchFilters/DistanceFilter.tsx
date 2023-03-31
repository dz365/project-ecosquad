interface DistanceFilter {
  distanceFilter: number | undefined;
  setDistanceFilter: (distance: number | undefined) => void;
}

const DistanceFilter: React.FC<DistanceFilter> = ({
  distanceFilter,
  setDistanceFilter,
}) => {
  const distances = [1000, 5000, 10000, 50000, 100000, 1000000];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-green-600">Distance</span>
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
        <label className="flex gap-2">
          <input
            type="radio"
            value={undefined}
            checked={!distanceFilter}
            onChange={() => setDistanceFilter(undefined)}
          />
          <span>All</span>
        </label>
      </div>
    </div>
  );
};

export default DistanceFilter;
