import { useMutation } from "@apollo/client";
import Image from "next/image";
import React, { useState } from "react";
import { SELECT_CATEGORY } from "../graphql/mutation/category";
import { GET_ALL_CATEGORIES } from "../graphql/query/category";
import { GET_MY_SELECTED_CATEGORIES } from "../graphql/query/me";
import { GraphqlCategory } from "../graphql/types/category";
import { handleImageType } from "../utils/functions";
import Text from "./Text";
import { Category } from "./types/Category";

function Category({
  category,
  Icon,
  className = "",
  id,
  selectedCategories,
  setSelectedCategories,
  filter = false,
}: Category) {
  const [selectCategory] = useMutation<String[]>(SELECT_CATEGORY, {
    update: (cache, { data, errors }) => {
      const categoriesList = cache.readQuery<{
        findAllCategories: GraphqlCategory[];
      }>({
        query: GET_ALL_CATEGORIES,
      });

      const mySelectedCategories = cache.readQuery<GET_MY_SELECTED_CATEGORIES>({
        query: GET_MY_SELECTED_CATEGORIES,
      });

      if (categoriesList?.findAllCategories && data && mySelectedCategories) {
        cache.writeQuery({
          query: GET_MY_SELECTED_CATEGORIES,
          data: {
            getCategories: [
              ...mySelectedCategories?.getCategories,
              ...categoriesList.findAllCategories.filter((val) => val.id == id),
            ],
          },
        });
      }
    },
  });

  const [loading, setLoading] = useState(true);
  function checkIfCategorySelected(categoryId: string, filter: boolean) {
    if (selectedCategories === undefined) return false;
    if (!filter) {
      for (let i = 0; i < selectedCategories.length; i++) {
        if (selectedCategories[i] == categoryId) {
          return true;
        }
      }
      return false;
    } else {
      if (!selectedCategories) return false;
      return id === selectedCategories;
    }
  }

  function configureColSpan(textSize: number) {
    if (textSize <= 3) {
      return "col-span-3 lg:col-span-2";
    } else if (textSize <= 7) {
      return "col-span-4 lg:col-span-3";
    } else if (textSize <= 10) {
      return "col-span-5 lg:col-span-3";
    } else if (textSize <= 13) {
      return "col-span-6 lg:col-span-4";
    } else if (textSize <= 16) {
      return "col-span-7 lg:col-span-5";
    } else if (textSize <= 19) {
      return "col-span-8 lg:col-span-6";
    } else if (textSize <= 29) {
      return "col-span-9 lg:col-span-7";
    } else {
      return "col-span-10 lg:col-span-8";
    }
  }
  return (
    <button
      key={id}
      disabled={selectedCategories === undefined}
      onClick={() => {
        if (!setSelectedCategories) return;
        if (!filter) {
          selectCategory({
            variables: {
              type: id,
            },
          });

          if (checkIfCategorySelected(id, filter)) {
            setSelectedCategories((prev) =>
              prev && prev instanceof Array
                ? [...prev.filter((category: any) => category != id)]
                : []
            );
          } else {
            setSelectedCategories((prev) =>
              prev && prev instanceof Array ? [...prev, id] : []
            );
          }
        } else if (setSelectedCategories !== undefined) {
          if (!selectedCategories || selectedCategories != id) {
            setSelectedCategories(id);
          } else {
            setSelectedCategories("");
          }
        }
      }}
      className={`flex  items-center max-h-10 ${
        loading ? "col-span-3 " : " " + configureColSpan(category.length)
      } py-1 pl-1 pr-2 rounded-full duration-300 ${
        loading ? "animate-pulse" : ""
      }
                ${
                  loading
                    ? "bg-gray-300 dark:bg-gray-600"
                    : checkIfCategorySelected(id, filter)
                    ? "bg-blue-500 text-gray-100"
                    : "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-300"
                }  ${className}`}
    >
      <div
        className={`${
          loading
            ? "w-12 h-8"
            : checkIfCategorySelected(id, filter)
            ? "bg-blue-800"
            : "bg-gray-200 dark:bg-gray-950"
        } relative rounded-full mr-1 w-8 h-8 flex items-center justify-center`}
      >
        {Icon && (
          <Image
            onLoadingComplete={() => setLoading(false)}
            fill
            className="rounded-full object-contain"
            src={handleImageType(Icon)}
            alt={category + " category"}
            loading="lazy"
          />
        )}
      </div>
      {!loading && (
        <Text
          size="text-lg"
          weight="font-base"
          color={
            checkIfCategorySelected(id, filter)
              ? "text-gray-200"
              : "text-gray-500"
          }
          className="whitespace-nowrap"
        >
          {category}
        </Text>
      )}
    </button>
  );
}

export default Category;
