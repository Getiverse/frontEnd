import { NetworkStatus, useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_ARTICLES_BY_USER_IDS } from "../../../graphql/query/article";
import { GET_MY_FOLLOW_USER_ID } from "../../../graphql/query/me";
import { ARTICLE_PAGEABLE_PAGE_SIZE } from "../../../utils/constants";

function useHomeArticlesFetch() {
  const [moreArticlesToLoad, setMoreArticlesToLoad] = useState(true);
  const [articlePage, setArticlePage] = useState(1);
  const { data: me } = useQuery<GET_MY_FOLLOW_USER_ID>(GET_MY_FOLLOW_USER_ID);
  const followsId = me?.me.follow;
  const [loadingState, setLoadingState] = useState(false);

  const {
    loading,
    error,
    data: articles,
    refetch: refetchArticles,
    fetchMore: fetchMoreArticles,
  } = useQuery<GET_ARTICLES_BY_USER_IDS>(GET_ARTICLES_BY_USER_IDS, {
    skip: followsId?.length == 0,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    variables: {
      skip: followsId?.length == 0,
      type: followsId,
      page: {
        page: 0,
        size: ARTICLE_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  async function loadMoreArticles() {
    if (loading && loadingState) return;
    setLoadingState(true);
    await fetchMoreArticles({
      variables: {
        type: followsId,
        page: {
          page: articlePage,
          size: ARTICLE_PAGEABLE_PAGE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreArticlesToLoad) return previousResult;
        if (!previousResult.getArticlesByUserIds) return fetchMoreResult;
        if (fetchMoreResult.getArticlesByUserIds.data.length == 0) {
          setMoreArticlesToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          getArticlesByUserIds: {
            count: previousResult.getArticlesByUserIds.count,
            data: [
              ...previousResult.getArticlesByUserIds.data,
              ...fetchMoreResult.getArticlesByUserIds.data,
            ],
          },
        });
      },
    });
    setLoadingState(false);
    setArticlePage((prev) => prev + 1);
  }

  return {
    loadMoreArticles,
    articles: articles?.getArticlesByUserIds.data,
    loadingArticles: loading && loadingState,
    articlesCount: articles?.getArticlesByUserIds.count,
    refetchArticles,
  };
}

export default useHomeArticlesFetch;
