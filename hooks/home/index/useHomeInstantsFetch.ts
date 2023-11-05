import { INSTANTS_PAGEABLE_PAGE_SIZE } from "./../../../utils/constants";
import { GET_INSTANTS_BY_USER_IDS } from "./../../../graphql/query/instant";
import { useState } from "react";
import { NetworkStatus, useQuery } from "@apollo/client";
import { GET_MY_FOLLOW_USER_ID } from "../../../graphql/query/me";
function useHomeInstantsFetch() {
  const [moreInstantsToLoad, setMoreInstantsToLoad] = useState(true);
  const [instantPage, setInstantPage] = useState(1);
  const { data: me } = useQuery<GET_MY_FOLLOW_USER_ID>(GET_MY_FOLLOW_USER_ID);
  const followsId = me?.me.follow;
  const [loadingState, setLoadingState] = useState(false);

  const {
    loading: instantsLoading,
    data: instants,
    refetch: refetchInstants,
    fetchMore: fetchMoreInstants,
  } = useQuery<GET_INSTANTS_BY_USER_IDS>(GET_INSTANTS_BY_USER_IDS, {
    variables: {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      skip: followsId?.length == 0,
      type: followsId,
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
        type: followsId,
        page: {
          page: instantPage,
          size: INSTANTS_PAGEABLE_PAGE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreInstantsToLoad) return previousResult;
        if (!previousResult.getInstantsByUserIds) return fetchMoreResult;
        if (fetchMoreResult.getInstantsByUserIds.data.length == 0) {
          setMoreInstantsToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          getInstantsByUserIds: {
            count: previousResult.getInstantsByUserIds.count,
            data: [
              ...previousResult.getInstantsByUserIds.data,
              ...fetchMoreResult.getInstantsByUserIds.data,
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
    instants: instants?.getInstantsByUserIds.data,
    loadingInstants: instantsLoading && loadingState,
    instantsCount: instants?.getInstantsByUserIds.count,
    instantPage: instantPage,
    refetchInstants: refetchInstants,
  };
}

export default useHomeInstantsFetch;
