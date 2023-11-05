import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import Button from "../buttons/Button";
import Category from "../Category";
import DropDown from "../DropDown";
import Text from "../Text";
import { ModalType } from "../types/Modal";
import Filter from "../Filter";
import { GET_ALL_CATEGORIES } from "../../graphql/query/category";
import { GraphqlCategory } from "../../graphql/types/category";
import { useQuery } from "@apollo/client";
import Modal from "../Modal";

type SelectedValues = {
  type: string;
  sortBy: string;
  date: string;
};

function SearchFilterModal({
  setFilterCategories,
  filterCategories,
  selectedValues,
  setSelectedValues,
}: {
  setFilterCategories: (val: any) => void;
  filterCategories: any[];
  selectedValues: SelectedValues;
  setSelectedValues: Dispatch<SetStateAction<SelectedValues>>;
}) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const {
    loading,
    error,
    data: allCategories,
  } = useQuery<{
    findAllCategories: GraphqlCategory[];
  }>(GET_ALL_CATEGORIES);

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <Modal
      open={openModal.open && openModal.type == ModalType.SEARCH_FILTER}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="border-b border-gray-300 dark:border-gray-700 shadow-md py-5">
        <div className="flex items-center w-full justify-between px-5 ">
          <Text color="text-gray-500" size="text-xl">
            Search Filter
          </Text>
          <AiOutlineClose
            className="text-gray-500 cursor-pointer"
            size="25"
            onClick={() => closeModal()}
          />
        </div>
      </div>
      <div className="w-full h-full overflow-y-scroll scrollbar-hide text-lg">
        <div className="border-b border-gray-300 dark:border-gray-700 px-8 flex items-center justify-between">
          <Text size="text-md">Type:</Text>
          <DropDown
            active={selectedValues.type}
            setActive={(val) =>
              setSelectedValues((prev) => ({ ...prev, type: val }))
            }
            id="type"
            items={["All", "Article", "Instant"]}
            Icon={BiChevronDown}
          />
        </div>
        <div className="border-b  border-gray-300 dark:border-gray-700 px-8 flex items-center justify-between">
          <Text size="text-md">Sort by:</Text>
          <DropDown
            active={selectedValues.sortBy}
            setActive={(val) =>
              setSelectedValues((prev) => ({ ...prev, sortBy: val }))
            }
            id="sortBy"
            items={[
              "Relevance",
              "View Count",
              "Minutes",
              "Writing Date",
              "A-Z",
            ]}
            Icon={BiChevronDown}
          />
        </div>
        <div className="border-b border-gray-300 dark:border-gray-700 px-8 flex items-center justify-between">
          <Text size="text-md">Date:</Text>
          <DropDown
            active={selectedValues.date}
            setActive={(val) =>
              setSelectedValues((prev) => ({ ...prev, date: val }))
            }
            id="date"
            items={[
              "Any Time",
              "Last Hour",
              "Today",
              "This Week",
              "This Month",
              "This Year",
            ]}
            Icon={BiChevronDown}
          />
        </div>
        <div className="border-b border-gray-300 dark:border-gray-700 py-4 px-8">
          <Text size="text-md">Rating:</Text>
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 mt-4 grid-flow-dense">
            {["1", "2", "3", "4"].map((val) => {
              return (
                <Filter
                  key={val}
                  text={val}
                  selectedFilter={filterCategories}
                  multiple={true}
                  setSelectedFilter={setFilterCategories}
                />
              );
            })}
          </div>
        </div>
        <div className="border-b border-gray-300 dark:border-gray-700 py-4 px-8">
          <Text size="text-md">Category:</Text>
          <div className="grid grid-flow-dense grid-cols-10 gap-2 w-full mt-4 pb-32">
            {allCategories?.findAllCategories.map(({ name, id, image }) => (
              <Category
                key={id}
                category={name}
                id={id}
                Icon={image}
                selectedCategories={filterCategories}
                setSelectedCategories={setFilterCategories}
              />
            ))}
          </div>
        </div>
      </div>
      {/*overflow scroll ends */}
      <div className="w-full flex justify-around fixed z-40 py-5 bottom-0 border-t-2 bg-white border-gray-300 dark:bg-slate-900 dark:border-gray-700">
        <button
          onClick={() => {
            setFilterCategories([]);
            closeModal();
          }}
          className="w-32 text-gray-500 bg-gray-100 dark:bg-slate-600 dark:text-white rounded-xl px-6 py-2"
        >
          Reset
        </button>
        <Button
          onClick={() => {
            closeModal();
          }}
          type="primary"
          text="Apply"
          className="w-32"
        />
      </div>
    </Modal>
  );
}
export default SearchFilterModal;
