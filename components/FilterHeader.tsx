import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { selectedFilter } from "../utils/atoms/selectedFilter";
import Filter from "./Filter";

function FilterHeader({ filters }: { filters: string[] }) {
  const [filter, setFilter] = useRecoilState(selectedFilter);
  const [effect, setEffect] = useState(false);

  useEffect(() => {
    setFilter(filters[0]);
  }, []);

  return (
    <div
      className={`flex space-x-4 py-4 overflow-x-scroll scrollbar-hide px-4`}
    >
      {filters.map((name, idx) => (
        <Filter
          text={name}
          key={idx}
          selectedFilter={filter}
          setSelectedFilter={setFilter}
        />
      ))}
    </div>
  );
}
export default FilterHeader;
