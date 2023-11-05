import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { GET_ARTICLES_BY_USER_ID } from "../graphql/query/article";
import { GET_MY_ARTICLES } from "../graphql/query/me";
import { ARTICLE_PAGEABLE_PAGE_SIZE } from "../utils/constants";

function useProfileArticleFetch() {
  const [moreArticlesToLoad, setMoreArticlesToLoad] = useState(true);
  const [articlePage, setArticlePage] = useState(1);
  const router = useRouter();
  const authorId = router.query.id as string;

  const {
    loading: loadingMyArticles,
    error,
    data: myArticles,
    fetchMore: fetchMoreMyArticles,
  } = useQuery<GET_MY_ARTICLES>(GET_MY_ARTICLES, {
    skip: authorId != null && authorId.length > 0,
    variables: {
      skip: authorId != null && authorId.length > 0,
      page: {
        page: 0,
        size: ARTICLE_PAGEABLE_PAGE_SIZE,
      },
    },

  });
  const {
    data: articles,
    loading: loadingArticles,
    fetchMore: fetchMoreArticles,
  } = useQuery<GET_ARTICLES_BY_USER_ID>(GET_ARTICLES_BY_USER_ID, {
    skip: authorId == undefined,
    variables: {
      skip: authorId == undefined,
      type: authorId,
      page: {
        page: 0,
        size: ARTICLE_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  async function loadMoreArticles() {
    if (loadingArticles || loadingMyArticles) return;
    if (authorId) {
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
    } else {
      await fetchMoreMyArticles({
        variables: {
          page: {
            page: articlePage,
            size: ARTICLE_PAGEABLE_PAGE_SIZE,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!moreArticlesToLoad) return previousResult;
          if (!previousResult.getMyArticles) return fetchMoreResult;
          if (fetchMoreResult.getMyArticles.data.length == 0) {
            setMoreArticlesToLoad(false);
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            getMyArticles: {
              count: previousResult.getMyArticles.count,
              data: [
                ...previousResult.getMyArticles.data,
                ...fetchMoreResult.getMyArticles.data,
              ],
            },
          });
        },
      });
    }
    setArticlePage((prev) => prev + 1);
  }
  const data = authorId
    ? articles?.getArticlesByUserId.data
    : myArticles?.getMyArticles.data;
  const count = authorId
    ? articles?.getArticlesByUserId.count
    : myArticles?.getMyArticles.count;
  if (authorId)
    return {
      loadMoreArticles,
      articles: data,
      loadingArticles: loadingArticles,
      articlesCount: count,
    };
  return {
    loadMoreArticles,
    articles: data,
    loadingArticles: loadingMyArticles,
    articlesCount: count,
  };
}

export default useProfileArticleFetch;
