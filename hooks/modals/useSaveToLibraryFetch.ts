import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_MY_LIBRARIES } from "../../graphql/query/me";
import { LIBRARY_PAGEABLE_SIZE } from "../../utils/constants";

function useSaveToLibraryFetch() {
  const [moreLibrariesToLoad, setMoreLibrariesToLoad] = useState(true);
  const [page, setPage] = useState(1);
  const {
    data: libraries,
    refetch,
    loading,
    fetchMore: fetchMoreLibraries,
  } = useQuery<GET_MY_LIBRARIES>(GET_MY_LIBRARIES, {
    variables: {
      type: {
        page: 0,
        size: LIBRARY_PAGEABLE_SIZE,
      },
    },
  });

  async function loadMoreLibraries() {
    if (loading) return;

    await fetchMoreLibraries({
      variables: {
        type: {
          page: page,
          size: LIBRARY_PAGEABLE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreLibrariesToLoad) return previousResult;
        if (!previousResult.getMyLibraries) return fetchMoreResult;
        if (fetchMoreResult.getMyLibraries.data.length == 0) {
          setMoreLibrariesToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          getMyLibraries: {
            count: previousResult.getMyLibraries.count,
            data: [
              ...previousResult.getMyLibraries.data,
              ...fetchMoreResult.getMyLibraries.data,
            ],
          },
        });
      },
    });

    setPage((prev) => prev + 1);
  }

  return {
    loadMoreLibraries,
    libraries: libraries?.getMyLibraries.data,
    loadingLibraries: loading,
    librariesCount: libraries?.getMyLibraries.count,
    libraryPage: page,
    refetchLibraries: refetch,
  };
}

export default useSaveToLibraryFetch;
