import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_ARTICLES_BY_USER_ID } from "../../../graphql/query/article";
import { ARTICLE_PAGEABLE_PAGE_SIZE } from "../../../utils/constants";

function useAuthorArticleFetch() {
  const [moreArticlesToLoad, setMoreArticlesToLoad] = useState(true);
  const [articlePage, setArticlePage] = useState(1);
  const router = useRouter();
  const authorId = router.query.id;
  const [loadingState, setLoadingState] = useState(false);
  const {
    loading,
    error,
    data: articles,
    refetch: refetchArticles,
    fetchMore: fetchMoreArticles,
  } = useQuery<GET_ARTICLES_BY_USER_ID>(GET_ARTICLES_BY_USER_ID, {
    skip: !authorId,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    variables: {
      skip: !authorId,
      type: authorId,
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
        type: authorId,
        page: {
          page: articlePage,
          size: ARTICLE_PAGEABLE_PAGE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreArticlesToLoad) return previousResult;
        if (!previousResult.getArticlesByUserId) return fetchMoreResult;
        if (fetchMoreResult.getArticlesByUserId.data.length == 0) {
          setMoreArticlesToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          getArticlesByUserId: {
            count: previousResult.getArticlesByUserId.count,
            data: [
              ...previousResult.getArticlesByUserId.data,
              ...fetchMoreResult.getArticlesByUserId.data,
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
    articles: articles?.getArticlesByUserId.data,
    loadingArticles: loading && loadingState,
    articlesCount: articles?.getArticlesByUserId.count,
    refetchArticles,
  };
}

export default useAuthorArticleFetch;
