import { ARTICLE_PAGEABLE_PAGE_SIZE } from "../../utils/constants";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { FIND_ARTICLES_BY_IDS } from "../../graphql/query/article";
import { FIND_LIBRARY_BY_ID } from "../../graphql/query/library";

function useLibraryArticleFetch() {
  const [moreArticlesToLoad, setMoreArticlesToLoad] = useState(true);
  const [articlePage, setArticlePage] = useState(1);
  const router = useRouter();
  const libraryId = router.query.id as string;
  const [loadingState, setLoadingState] = useState(false);

  const { data } = useQuery<FIND_LIBRARY_BY_ID>(FIND_LIBRARY_BY_ID, {
    variables: {
      skip: !libraryId,
      type: libraryId,
    },
  });

  const {
    data: articles,
    loading,
    fetchMore: fetchMoreArticles,
    refetch,
  } = useQuery<FIND_ARTICLES_BY_IDS>(FIND_ARTICLES_BY_IDS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !data?.findLibraryById.articles,
    variables: {
      type: data?.findLibraryById ? data?.findLibraryById.articles : [],
      page: {
        page: 0,
        size: ARTICLE_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  async function loadMoreArticles() {
    if (loading && loadingState) return;
    await fetchMoreArticles({
      variables: {
        type: data?.findLibraryById ? data?.findLibraryById.articles : [],
        page: {
          page: articlePage,
          size: ARTICLE_PAGEABLE_PAGE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreArticlesToLoad) return previousResult;
        if (!previousResult.findArticlesByIds) return fetchMoreResult;
        if (fetchMoreResult.findArticlesByIds.data.length == 0) {
          setMoreArticlesToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          findArticlesByIds: {
            count: previousResult.findArticlesByIds.count,
            data: [
              ...previousResult.findArticlesByIds.data,
              ...fetchMoreResult.findArticlesByIds.data,
            ],
          },
        });
      },
    });
    setArticlePage((prev) => prev + 1);
  }

  return {
    loadMoreArticles,
    articles: articles?.findArticlesByIds.data,
    loadingArticles: loading,
    articlesCount: articles?.findArticlesByIds.count,
    articlePage: articlePage,
    refetchArticles: refetch,
  };
}

export default useLibraryArticleFetch;
