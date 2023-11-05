import { useState } from "react";
import { useRouter } from "next/router";
import { INSTANTS_PAGEABLE_PAGE_SIZE } from "../utils/constants";
import { useQuery } from "@apollo/client";
import { GET_INSTANTS_BY_USER_ID } from "../graphql/query/instant";
import { GET_MY_INSTANTS } from "../graphql/query/me";

function useProfileInstantFetch() {
  const router = useRouter();
  const authorId = router.query.id as string;
  const [moreInstantsToLoad, setMoreInstantsToLoad] = useState(true);
  const [instantPage, setInstantPage] = useState(1);

  const {
    loading: myInstantsLoading,
    data: myInstants,
    fetchMore: fetchMoreMyInstants,
  } = useQuery<GET_MY_INSTANTS>(GET_MY_INSTANTS, {
    skip: authorId != null && authorId.length > 0,
    variables: {
      skip: authorId != null && authorId.length > 0,
      page: {
        page: 0,
        size: INSTANTS_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  const {
    data: instants,
    loading: loadingInstants,
    fetchMore: fetchMoreInstants,
  } = useQuery<GET_INSTANTS_BY_USER_ID>(GET_INSTANTS_BY_USER_ID, {
    skip: authorId === undefined,
    variables: {
      skip: authorId === undefined,
      type: authorId,
      page: {
        page: 0,
        size: INSTANTS_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  async function loadMoreInstants() {
    if (loadingInstants || myInstantsLoading) return;
    if (authorId) {
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
    } else {
      await fetchMoreMyInstants({
        variables: {
          page: {
            page: instantPage,
            size: INSTANTS_PAGEABLE_PAGE_SIZE,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!moreInstantsToLoad) return previousResult;
          if (!previousResult.getMyInstants) return fetchMoreResult;
          if (fetchMoreResult.getMyInstants.data.length == 0) {
            setMoreInstantsToLoad(false);
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            getMyInstants: {
              count: previousResult.getMyInstants.count,
              data: [
                ...previousResult.getMyInstants.data,
                ...fetchMoreResult.getMyInstants.data,
              ],
            },
          });
        },
      });
    }
    setInstantPage((prev) => prev + 1);
  }

  const data = authorId
    ? instants?.getInstantsByUserId.data
    : myInstants?.getMyInstants.data;
  const count = authorId
    ? instants?.getInstantsByUserId.count
    : myInstants?.getMyInstants.count;
  if (authorId)
    return {
      loadMoreInstants,
      instants: data,
      loadingInstants: loadingInstants,
      instantsCount: count,
      instantPage: instantPage,
    };
  return {
    loadMoreInstants,
    instants: data,
    loadingInstants: myInstantsLoading,
    instantsCount: count,
    instantPage: instantPage,
  };
}

export default useProfileInstantFetch;
