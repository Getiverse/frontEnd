import { RATINGS_PAGEABLE_SIZE } from "./../../utils/constants";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { FIND_RATINGS_BY_POST_ID } from "../../graphql/query/rating";

function useRatingsFetch() {
  const [moreArticlesToLoad, setMoreArticlesToLoad] = useState(true);
  const [ratingPage, setRatingPage] = useState(1);
  const router = useRouter();
  const postId = router.query.postId;
  const postType = router.query.type;
  const {
    data: ratings,
    loading,
    refetch: refetchRatings,
    fetchMore: fetchMoreRatings,
  } = useQuery<FIND_RATINGS_BY_POST_ID>(FIND_RATINGS_BY_POST_ID, {
    skip: !postId || !postType,
    variables: {
      skip: !postId || !postType,
      postId: postId,
      postType: postType,
      page: {
        page: 0,
        size: RATINGS_PAGEABLE_SIZE,
      },
    },
  });

  async function loadMoreRatings() {
    if (loading) return;
    await fetchMoreRatings({
      variables: {
        postId: postId,
        postType: postType,
        page: {
          page: ratingPage,
          size: RATINGS_PAGEABLE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreArticlesToLoad) return previousResult;
        if (!previousResult.findRatingsByPostId) return fetchMoreResult;
        if (fetchMoreResult.findRatingsByPostId.data.length == 0) {
          setMoreArticlesToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          findRatingsByPostId: {
            count: previousResult.findRatingsByPostId.count,
            data: [
              ...previousResult.findRatingsByPostId.data,
              ...fetchMoreResult.findRatingsByPostId.data,
            ],
          },
        });
      },
    });

    setRatingPage((prev) => prev + 1);
  }

  return {
    loadMoreRatings,
    ratings: ratings?.findRatingsByPostId.data,
    loadingRatings: loading,
    ratingsCount: ratings?.findRatingsByPostId.count,
    refetchRatings,
  };
}

export default useRatingsFetch;
