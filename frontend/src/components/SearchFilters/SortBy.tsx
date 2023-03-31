interface SortBy {
  sort: string;
  setSort: (sort: string) => void;
}

const SortBy: React.FC<SortBy> = ({ sort, setSort }) => {
  return (
    <div>
      <span className="text-green-600">Sort by</span>
      <label className="flex gap-2">
        <input
          type="radio"
          value="relevance"
          checked={sort === "relevance"}
          onChange={() => setSort("relevance")}
        />
        <span>Relevance</span>
      </label>
      <label className="flex gap-2">
        <input
          type="radio"
          value="distance"
          checked={sort === "distance"}
          onChange={() => setSort("distance")}
        />
        <span>Distance</span>
      </label>
      <label className="flex gap-2">
        <input
          type="radio"
          value="dateposted"
          checked={sort === "dateposted"}
          onChange={() => setSort("dateposted")}
        />
        <span>Date Posted</span>
      </label>
    </div>
  );
};

export default SortBy;
