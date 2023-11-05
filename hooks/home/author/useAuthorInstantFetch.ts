import { useRouter } from "next/router";
import { INSTANTS_PAGEABLE_PAGE_SIZE } from "./../../../utils/constants";
import { GET_INSTANTS_BY_USER_ID } from "./../../../graphql/query/instant";
import { useState } from "react";
import { useQuery } from "@apollo/client";

function useAuthorInstantFetch() {
  const [moreInstantsToLoad, setMoreInstantsToLoad] = useState(true);
  const [instantPage, setInstantPage] = useState(1);
  const router = useRouter();
  const authorId = router.query.id;
  const [loadingState, setLoadingState] = useState(false);
  const {
    loading: instantsLoading,
    data: instants,
    fetchMore: fetchMoreInstants,
    refetch: refetchInstants,
  } = useQuery<GET_INSTANTS_BY_USER_ID>(GET_INSTANTS_BY_USER_ID, {
    skip: !authorId,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    variables: {
      skip: !authorId,
      type: authorId,
      page: {
        page: 0,
        size: INSTANTS_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  async function loadMoreInstants() {
    if (instantsLoading && loadingState) return;
    setLoadingState(true);
    await fetchMoreInstants({
      variables: {
        type: authorId,
        page: {
          page: instantPage,
          size: INSTANTS_PAGEABLE_PAGE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreInstantsToLoad) return previousResult;
        if (!previousResult.getInstantsByUserId) return fetchMoreResult;
        if (fetchMoreResult.getInstantsByUserId.data.length == 0) {
          setMoreInstantsToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          getInstantsByUserId: {
            count: previousResult.getInstantsByUserId.count,
            data: [
              ...previousResult.getInstantsByUserId.data,
              ...fetchMoreResult.getInstantsByUserId.data,
            ],
          },
        });
      },
    });
    setLoadingState(false);
    setInstantPage((prev) => prev + 1);
  }

  return {
    loadMoreInstants,
    instants: instants?.getInstantsByUserId.data,
    loadingInstants: instantsLoading && loadingState,
    instantsCount: instants?.getInstantsByUserId.count,
    instantPage: instantPage,
    refetchInstants: refetchInstants,
  };
}

export default useAuthorInstantFetch;
