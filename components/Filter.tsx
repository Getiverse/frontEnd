import { AiFillStar } from "react-icons/ai";
import Text from "./Text";

function Filter({
  text,
  setSelectedFilter,
  selectedFilter,
  multiple = false,
}: {
  text: string;
  selected?: boolean;
  setSelectedFilter: (value: any) => void;
  selectedFilter: any;
  multiple?: boolean;
}) {
  function handleMultiple() {
    if (multiple) {
      let filteredList = [];
      if (!selectedFilter.includes(text)) {
        for (let i = 0; i < selectedFilter.length; i++) {
          if (typeof selectedFilter[i] !== "string") {
            filteredList.push(selectedFilter[i]);
          }
        }
        filteredList.push(text);
        setSelectedFilter(filteredList);
      } else {
        setSelectedFilter((prev: any[]) => prev.filter((val) => val !== text));
      }
    } else {
      setSelectedFilter(text);
    }
  }
  function isActive() {
    if (multiple) {
      return selectedFilter.includes(text);
    } else {
      return selectedFilter === text;
    }
  }
  return (
    <button
      onClick={() => handleMultiple()}
      className={
        isActive()
          ? "flex items-center bg-blue-500 text-gray-50 rounded-3xl text-center py-1 px-4 hover:shadow whitespace-nowrap"
          : "flex items-center bg-slate-300 dark:bg-slate-700 dark:text-gray-100 text-gray-500 rounded-3xl text-center py-1 px-4 hover:shadow whitespace-nowrap"
      }
    >
      {/^-?\d+$/.test(text) && (
        <>
          {multiple ? (
            <span className="flex items-center">
              <Text className="mr-1" color="text-yellow-500">
                {text}
              </Text>
              <AiFillStar
                key={text}
                size={"22"}
                className={`pr-1 text-yellow-500`}
              />
            </span>
          ) : (
            <AiFillStar size={"20"} className={`pr-1`} />
          )}
        </>
      )}
      {multiple ? "and more" : text}
    </button>
  );
}

export default Filter;
