import { FIND_REPLIES_BY_RATING_ID } from "./../../graphql/query/reply";
import { REPLIES_PAGEABLE_SIZE } from "../../utils/constants";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useState } from "react";

function useReplyFetch() {
  const [moreRepliesToLoad, setMoreRepliesToLoad] = useState(true);
  const [replyPage, setReplyPage] = useState(1);
  const router = useRouter();

  const {
    data: replies,
    loading: repliesLoading,
    refetch: refetchReplies,
    fetchMore: fetchMoreReplies,
  } = useQuery<FIND_REPLIES_BY_RATING_ID>(FIND_REPLIES_BY_RATING_ID, {
    variables: {
      skip: !router.query.ratingId,
      type: router.query.ratingId,
      page: {
        page: 0,
        size: REPLIES_PAGEABLE_SIZE,
      },
    },
  });

  async function loadMoreReplies() {
    if (repliesLoading) return;
    await fetchMoreReplies({
      variables: {
        postId: router.query.ratingId,
        page: {
          page: replyPage,
          size: REPLIES_PAGEABLE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreRepliesToLoad) return previousResult;
        if (!previousResult.findRepliesByRatingId) return fetchMoreResult;
        if (fetchMoreResult.findRepliesByRatingId.data.length == 0) {
          setMoreRepliesToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          findRepliesByRatingId: {
            count: previousResult.findRepliesByRatingId.count,
            data: [
              ...previousResult.findRepliesByRatingId.data,
              ...fetchMoreResult.findRepliesByRatingId.data,
            ],
          },
        });
      },
    });

    setReplyPage((prev) => prev + 1);
  }

  return {
    loadMoreReplies,
    replies: replies?.findRepliesByRatingId.data,
    repliesLoading: repliesLoading,
    repliesCount: replies?.findRepliesByRatingId.count,
    refetchReplies,
  };
}

export default useReplyFetch;
