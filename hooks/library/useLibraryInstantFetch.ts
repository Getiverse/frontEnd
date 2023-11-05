import { INSTANTS_PAGEABLE_PAGE_SIZE } from "../../utils/constants";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { FIND_LIBRARY_BY_ID } from "../../graphql/query/library";
import { useRouter } from "next/router";
import { FIND_INSTANTS_BY_IDS } from "../../graphql/query/instant";

function useLibraryInstantFetch() {
  const [moreInstantsToLoad, setMoreInstantsToLoad] = useState(true);
  const [instantPage, setInstantPage] = useState(1);
  const router = useRouter();
  const libraryId = router.query.id as string;
  const [loadingState, setLoadingState] = useState(false);
  const { data, loading: loadingLibraries } = useQuery<FIND_LIBRARY_BY_ID>(
    FIND_LIBRARY_BY_ID,
    {
      skip: !libraryId,
      variables: {
        skip: !libraryId,
        type: libraryId,
      },
    }
  );

  const {
    data: instants,
    loading,
    refetch,
    fetchMore: fetchMoreInstants,
  } = useQuery<FIND_INSTANTS_BY_IDS>(FIND_INSTANTS_BY_IDS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip:
      !data ||
      !data?.findLibraryById ||
      data?.findLibraryById.instants.length == 0,
    variables: {
      skip:
        !data ||
        !data?.findLibraryById ||
        data?.findLibraryById.instants.length == 0,
      type: data?.findLibraryById ? data?.findLibraryById.instants : [],
      page: {
        page: 0,
        size: INSTANTS_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  async function loadMoreInstants() {
    if ((loading || loadingLibraries) && loadingState) return;
    setLoadingState(true);
    await fetchMoreInstants({
      variables: {
        type: data?.findLibraryById ? data?.findLibraryById.instants : [],
        page: {
          page: instantPage,
          size: INSTANTS_PAGEABLE_PAGE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreInstantsToLoad) return previousResult;
        if (!previousResult.findInstantsByIds) return fetchMoreResult;
        if (fetchMoreResult.findInstantsByIds.data.length == 0) {
          setMoreInstantsToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          findInstantsByIds: {
            count: previousResult.findInstantsByIds.count,
            data: [
              ...previousResult.findInstantsByIds.data,
              ...fetchMoreResult.findInstantsByIds.data,
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
    instants: instants?.findInstantsByIds.data,
    loadingInstants: (loading || loadingLibraries) && loadingState,
    instantsCount: instants?.findInstantsByIds.count,
    instantPage: instantPage,
    refetchInstants: refetch,
  };
}

export default useLibraryInstantFetch;
