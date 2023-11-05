import Text from "../Text";
import { BsFilter } from "react-icons/bs";
import CategoryFilter from "./CategoryFilter";
import { moreModal } from "../../utils/atoms/moreModal";
import { useRecoilState } from "recoil";
import { ModalType } from "../types/Modal";
import { useEffect, useState } from "react";
import { convertIdToCategories } from "../../utils/functions";
import { useQuery } from "@apollo/client";
import { GraphqlCategory } from "../../graphql/types/category";
import { GET_ALL_CATEGORIES } from "../../graphql/query/category";
function SearchFilter({
  filterCategories,
  setFilterCategories,
  selectedType,
}: {
  filterCategories: any[];
  setFilterCategories: (val: any) => void;
  selectedType: string;
}) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const {
    loading,
    error,
    data: allCategories,
  } = useQuery<{
    findAllCategories: GraphqlCategory[];
  }>(GET_ALL_CATEGORIES);

  return (
    <div>
      <div className="bg-white dark:bg-slate-900 w-full py-3 border-b border-gray-300 dark:border-gray-700 shadow flex items-center px-4 justify-between">
        <Text size="text-md">{selectedType}</Text>
        <span className="flex items-center">
          <Text className="mr-2" size="text-md">
            Filter:
          </Text>
          <BsFilter
            className="cursor-pointer"
            onClick={() =>
              setOpenModal((prev) => ({
                ...prev,
                open: true,
                type: ModalType.SEARCH_FILTER,
              }))
            }
            size={23}
          />
        </span>
      </div>
      <div className="pr-6 pl-3 w-full">
        <div className="my-5 flex space-x-4 w-full  overflow-x-scroll scrollbar-hide">
          {convertIdToCategories(
            filterCategories,
            allCategories?.findAllCategories
              ? allCategories?.findAllCategories
              : []
          ).map(({ name, id, image }) => {
            return (
              <CategoryFilter
                key={id}
                category={name}
                id={id}
                Icon={image}
                setFilterCategories={setFilterCategories}
              />
            );
          })}

          {filterCategories.map(
            (val) =>
              !isNaN(val) && (
                <CategoryFilter
                  key={val}
                  category={val}
                  id={val}
                  isStar={true}
                  setFilterCategories={setFilterCategories}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
