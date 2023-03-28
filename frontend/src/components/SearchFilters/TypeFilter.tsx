import { PostTypes } from "../../models/PostTypes";
interface TypeFilter {
  filteredTypes: string[];
  setFilteredTypes: (filters: string[]) => void;
}

const TypeFilter: React.FC<TypeFilter> = ({
  filteredTypes,
  setFilteredTypes,
}) => {
  const handleTypeFilterChange = (event: any) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setFilteredTypes([...filteredTypes, value]);
    } else {
      setFilteredTypes(filteredTypes.filter((type) => type !== value));
    }
  };

  return (
    <div className="flex flex-col">
      <span className="text-green-600">Types</span>
      {PostTypes.map((type) => (
        <label key={type.value + "-checkbox"} className="flex gap-2">
          <input
            type="checkbox"
            value={type.value}
            checked={filteredTypes.includes(type.value)}
            onChange={handleTypeFilterChange}
          />
          <span>{type.label}</span>
        </label>
      ))}
    </div>
  );
};

export default TypeFilter;
