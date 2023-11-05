import { INSTANTS_PAGEABLE_PAGE_SIZE } from "./../../utils/constants";
import { useRecoilValue } from "recoil";
import { filterByCategoryState } from "./../../utils/atoms/filterByCategory";
import { useState } from "react";
import { NetworkStatus, useQuery } from "@apollo/client";
import {
  GET_INSTANTS_BY_CATEGORIES,
  GET_INSTANTS_BY_CATEGORY,
} from "../../graphql/query/instant";
import { extractIdFromCategories } from "../../utils/functions";
import { GET_MY_SELECTED_CATEGORIES } from "../../graphql/query/me";

function useExploreInstantFetch() {
  const [moreInstantsToLoad, setMoreInstantsToLoad] = useState(true);
  const [instantPage, setInstantPage] = useState(1);
  const [loadingState, setLoadingState] = useState(false);
  const filterByCategory = useRecoilValue(filterByCategoryState);
  const { data: categories, refetch: refetchCategories } =
    useQuery<GET_MY_SELECTED_CATEGORIES>(GET_MY_SELECTED_CATEGORIES);

  const {
    loading: instantsLoading,
    data: instantsByCategories,
    refetch: refetchInstantsByCategories,
    fetchMore: fetchMoreInstantsByCategories,
  } = useQuery<GET_INSTANTS_BY_CATEGORIES>(GET_INSTANTS_BY_CATEGORIES, {
    skip: categories?.getCategories.length == 0,
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: categories?.getCategories.length == 0,
      type: extractIdFromCategories(
        categories?.getCategories ? categories.getCategories : []
      ),
      page: {
        page: 0,
        size: INSTANTS_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  const {
    data: instantsByOneCategory,
    loading: instantsByOneCategoryLoading,
    refetch: refetchInstantsByCategory,
    fetchMore: fetchMoreInstantsByOneCategory,
  } = useQuery<GET_INSTANTS_BY_CATEGORY>(GET_INSTANTS_BY_CATEGORY, {
    skip: !filterByCategory,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    variables: {
      skip: !filterByCategory,
      type: filterByCategory,
      page: {
        page: instantPage,
        size: INSTANTS_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  async function loadMoreInstants() {
    if ((instantsLoading || instantsByOneCategoryLoading) && loadingState)
      return;
    setLoadingState(true);
    if (filterByCategory) {
      await fetchMoreInstantsByOneCategory({
        variables: {
          type: filterByCategory,
          page: {
            page: instantPage,
            size: INSTANTS_PAGEABLE_PAGE_SIZE,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!moreInstantsToLoad) return previousResult;
          if (!previousResult.getInstantsByCategory) return fetchMoreResult;
          if (fetchMoreResult.getInstantsByCategory.data.length == 0) {
            setMoreInstantsToLoad(false);
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            getInstantsByCategory: {
              count: previousResult.getInstantsByCategory.count,
              data: [
                ...previousResult.getInstantsByCategory.data,
                ...fetchMoreResult.getInstantsByCategory.data,
              ],
            },
          });
        },
      });
    } else {
      await fetchMoreInstantsByCategories({
        variables: {
          type: extractIdFromCategories(
            categories?.getCategories ? categories.getCategories : []
          ),
          page: {
            page: instantPage,
            size: INSTANTS_PAGEABLE_PAGE_SIZE,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!moreInstantsToLoad) return previousResult;
          if (!previousResult.getInstantsByCategories) return fetchMoreResult;
          if (fetchMoreResult.getInstantsByCategories.data.length == 0) {
            setMoreInstantsToLoad(false);
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            getInstantsByCategories: {
              count: previousResult.getInstantsByCategories.count,
              data: [
                ...previousResult.getInstantsByCategories.data,
                ...fetchMoreResult.getInstantsByCategories.data,
              ],
            },
          });
        },
      });
    }
    setLoadingState(false);
    setInstantPage((prev) => prev + 1);
  }

  const instants = filterByCategory
    ? instantsByOneCategory?.getInstantsByCategory.data
    : instantsByCategories?.getInstantsByCategories.data;
  const loading = filterByCategory
    ? instantsByOneCategoryLoading
    : instantsLoading;
  const count = filterByCategory
    ? instantsByOneCategory?.getInstantsByCategory.count
    : instantsByCategories?.getInstantsByCategories.count;
  const refetch = filterByCategory
    ? refetchInstantsByCategory
    : refetchInstantsByCategories;

  return {
    loadMoreInstants,
    instants: instants,
    loadingInstants:
      (instantsLoading || instantsByOneCategoryLoading) && loadingState,
    instantsCount: count,
    instantPage: instantPage,
    refetchInstants: refetch,
  };
}

export default useExploreInstantFetch;
