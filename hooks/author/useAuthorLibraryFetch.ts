import { LIBRARY_PAGEABLE_SIZE } from "./../../utils/constants";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { ModalType } from "../../components/types/Modal";
import { GET_MY_LIBRARIES } from "../../graphql/query/me";
import { moreModal } from "../../utils/atoms/moreModal";
import { FIND_LIBRARIES_BY_USER_ID } from "../../graphql/query/library";
import useUid from "../useUid";

function useAuthorLibraryFetch() {
  const [moreLibrariesToLoad, setMoreLibrariesToLoad] = useState(true);
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const userId = router.query.id;
  const uid = useUid();
  const [loadingState, setLoadingState] = useState(false);

  const {
    data: libraries,
    refetch,
    loading,
    fetchMore: fetchMoreLibraries,
  } = useQuery<FIND_LIBRARIES_BY_USER_ID>(FIND_LIBRARIES_BY_USER_ID, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    variables: {
      page: {
        page: 0,
        size: LIBRARY_PAGEABLE_SIZE,
      },
      uid: userId ? userId : uid,
    },
  });

  async function loadMoreLibraries() {
    if (loading && loadingState) return;
    setLoadingState(true);
    await fetchMoreLibraries({
      variables: {
        type: {
          page: page,
          size: LIBRARY_PAGEABLE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreLibrariesToLoad) return previousResult;
        if (!previousResult.findLibrariesByUserId) return fetchMoreResult;
        if (fetchMoreResult.findLibrariesByUserId.data.length == 0) {
          setMoreLibrariesToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          findLibrariesByUserId: {
            count: previousResult.findLibrariesByUserId.count,
            data: [
              ...previousResult.findLibrariesByUserId.data,
              ...fetchMoreResult.findLibrariesByUserId.data,
            ],
          },
        });
      },
    });
    setLoadingState(false);
    setPage((prev) => prev + 1);
  }

  return {
    loadMoreLibraries,
    libraries: libraries?.findLibrariesByUserId.data,
    loadingLibraries: loading && loadingState,
    librariesCount: libraries?.findLibrariesByUserId.count,
    libraryPage: page,
    refetchLibraries: refetch,
  };
}

export default useAuthorLibraryFetch;
