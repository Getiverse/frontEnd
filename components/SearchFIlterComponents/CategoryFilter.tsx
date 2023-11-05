import Text from "../Text";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import { handleImageType } from "../../utils/functions";

function CategoryFilter({
  category,
  className,
  Icon,
  id,
  isStar = false,
  setFilterCategories,
}: {
  category: string;
  className?: string;
  Icon?: string;
  id: string;
  isStar?: boolean;
  setFilterCategories: (val: any) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between py-1 pl-1 pr-2 rounded-full duration-300
                bg-blue-500 text-gray-100 ${className}`}
    >
      <div className="flex items-center">
        <div
          className={
            !isStar
              ? `bg-blue-800 rounded-full mr-1 w-8 h-8 flex items-center justify-center`
              : "pl-2"
          }
        >
          {isStar ? (
            <span className="flex items-center">
              <Text className="mr-1" color="text-yellow-500">
                {category}
              </Text>
              <AiFillStar
                key={category}
                size={"22"}
                className={`pr-1 text-yellow-500`}
              />
            </span>
          ) : (
            Icon && (
              <Image
                src={handleImageType(Icon)}
                alt="alt"
                width={23}
                height={23}
              />
            )
          )}
        </div>
        <Text
          size="text-lg"
          weight="font-base"
          color="text-gray-200"
          className="whitespace-nowrap"
        >
          {isStar ? "and more" : category}
        </Text>
      </div>
      <IoClose
        className="text-white ml-2 cursor-pointer"
        size={26}
        onClick={() =>
          setFilterCategories((prev: any[]) => prev.filter((val) => val !== id))
        }
      />
    </div>
  );
}

export default CategoryFilter;
