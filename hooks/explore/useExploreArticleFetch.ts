import { ARTICLE_PAGEABLE_PAGE_SIZE } from "./../../utils/constants";
import { NetworkStatus, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  GET_ARTICLES_BY_CATEGORIES,
  GET_ARTICLES_BY_CATEGORY,
} from "../../graphql/query/article";
import { extractIdFromCategories } from "../../utils/functions";
import { GET_MY_SELECTED_CATEGORIES } from "../../graphql/query/me";
import { filterByCategoryState } from "../../utils/atoms/filterByCategory";
import { useRecoilValue } from "recoil";

function useExploreArticleFetch() {
  const [moreArticlesToLoad, setMoreArticlesToLoad] = useState(true);
  const [articlePage, setArticlePage] = useState(1);
  const filterByCategory = useRecoilValue(filterByCategoryState);
  const [loadingState, setLoadingState] = useState(false);
  const { data: categories } = useQuery<GET_MY_SELECTED_CATEGORIES>(
    GET_MY_SELECTED_CATEGORIES
  );
  const {
    data: articlesByOneCategory,
    refetch: refetchArticlesByOneCategory,
    loading: articlesLoadingByOneCategory,
    fetchMore: fetchMoreArticlesByOneCategory,
    networkStatus: articlesNetworkByOneCategory,
  } = useQuery<GET_ARTICLES_BY_CATEGORY>(GET_ARTICLES_BY_CATEGORY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !filterByCategory,
    variables: {
      skip: !filterByCategory,
      type: filterByCategory,
      page: {
        page: 0,
        size: ARTICLE_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  const {
    loading: articlesLoading,
    data: articlesByCategories,
    refetch: refetchArticles,
    fetchMore: fetchMoreArticlesByCategories,
  } = useQuery<GET_ARTICLES_BY_CATEGORIES>(GET_ARTICLES_BY_CATEGORIES, {
    skip: categories?.getCategories.length == 0,
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: categories?.getCategories.length == 0,
      type: extractIdFromCategories(
        categories?.getCategories ? categories.getCategories : []
      ),
      page: {
        page: 0,
        size: ARTICLE_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  async function loadMoreArticles() {
    if ((loading || articlesLoading) && loadingState) return;
    setLoadingState(true);
    if (filterByCategory) {
      await fetchMoreArticlesByOneCategory({
        variables: {
          type: filterByCategory,
          page: {
            page: articlePage,
            size: ARTICLE_PAGEABLE_PAGE_SIZE,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!moreArticlesToLoad) return previousResult;
          if (!previousResult.getArticlesByCategory) return fetchMoreResult;
          if (fetchMoreResult.getArticlesByCategory.data.length == 0) {
            setMoreArticlesToLoad(false);
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            getArticlesByCategory: {
              count: previousResult.getArticlesByCategory.count,
              data: [
                ...previousResult.getArticlesByCategory.data,
                ...fetchMoreResult.getArticlesByCategory.data,
              ],
            },
          });
        },
      });
    } else {
      await fetchMoreArticlesByCategories({
        variables: {
          type: extractIdFromCategories(
            categories?.getCategories ? categories.getCategories : []
          ),
          page: {
            page: articlePage,
            size: ARTICLE_PAGEABLE_PAGE_SIZE,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!moreArticlesToLoad) return previousResult;
          if (!previousResult.getArticlesByCategories) return fetchMoreResult;
          if (fetchMoreResult.getArticlesByCategories.data.length == 0) {
            setMoreArticlesToLoad(false);
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            getArticlesByCategories: {
              count: previousResult.getArticlesByCategories.count,
              data: [
                ...previousResult.getArticlesByCategories.data,
                ...fetchMoreResult.getArticlesByCategories.data,
              ],
            },
          });
        },
      });
    }
    setLoadingState(false);
    setArticlePage((prev) => prev + 1);
  }

  const articles = filterByCategory
    ? articlesByOneCategory?.getArticlesByCategory.data
    : articlesByCategories?.getArticlesByCategories.data;
  const loading = filterByCategory
    ? articlesLoadingByOneCategory
    : articlesLoading;
  const count = filterByCategory
    ? articlesByOneCategory?.getArticlesByCategory.count
    : articlesByCategories?.getArticlesByCategories.count;
  const refetch = filterByCategory
    ? refetchArticlesByOneCategory
    : refetchArticles;

  return {
    loadMoreArticles,
    articles: articles,
    loadingArticles: (loading || articlesLoading) && loadingState,
    articlesCount: count,
    articlePage: articlePage,
    refetchArticles: refetch,
  };
}

export default useExploreArticleFetch;
