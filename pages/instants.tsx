import { NextPage } from "next";
import Instant from "../components/Instant";
import Header from "../components/logged_in/layout/Header";
import TabBar from "../components/logged_in/layout/TabBar";
import PostModals from "../components/specialModals/PostModals";
import WriteModal from "../components/specialModals/WriteModal";
import { useQuery } from "@apollo/client";
import {
  FIND_INSTANTS_BY_IDS,
  FIND_INSTANT_BY_ID,
  GET_ALL_INSTANTS,
  GET_INSTANTS_BY_USER_ID,
} from "../graphql/query/instant";
import InstantSkeleton from "../components/skeletons/InstantSkeleton";
import { useEffect, useRef, useState } from "react";
import RoutingGuard from "../components/RoutingGuard";
import { useRouter } from "next/router";
import { PostType } from "../graphql/types/enums";
import { getHiddenPosts } from "../inMemoryData/utils/hiddenPosts";
import { FIND_LIBRARY_BY_ID } from "../graphql/query/library";
import InfiniteScroll from "react-infinite-scroller";
import { INSTANTS_PAGEABLE_PAGE_SIZE } from "../utils/constants";
import useUid from "../hooks/useUid";
import ForceLogin from "../components/specialModals/ForceLogin";
import { getInstantById } from "../utils/fetch/public/query";
import InstantSidebar from "../components/desktop/InstantSidebar";

const Instants: NextPage = () => {
  const router = useRouter();
  // const outsideInstant = useRecoilValue(outsideInstantData);
  const id = router.query.instantId as string;
  const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);
  const uid = router.query.uid;
  const indexQuery = Number(router.query.index);
  const page = Number(router.query.page);
  const scrollParentRef = useRef(null);
  const videoRefs = useRef([]);
  const libId = router.query.libId;
  const myUserId = useUid();
  const [startToSuggestInstants, setStartToSuggestInstants] = useState(
    libId || uid ? false : true
  );
  const [publicInstant, setPublicInstant] = useState<{
    categories: string[];
    createdAt: string;
    ratingsNumber: number;
    id: string;
    image: string;
    ratingSum: number;
    content: string;
    views: number;
    userId: string;
    title: string;
  }>();

  const [initInstantSkeleton, setInitInstantSkeleton] = useState(
    indexQuery % (INSTANTS_PAGEABLE_PAGE_SIZE + 1) == 2
  );
  const [currentActiveInstant, setCurrentActiveInstant] = useState<Instant>();
  const [active, setActive] = useState({
    id: "",
    userId: "",
  });
  const [pageable, setPageable] = useState(page ? page + 1 : 1);

  useEffect(() => {
    if (window) window.scrollTo(0, 0);
  }, []);

  const {
    data: userInstants,
    loading: loadingUserInstants,
    fetchMore: fetchMoreUserInstants,
  } = useQuery<GET_INSTANTS_BY_USER_ID>(GET_INSTANTS_BY_USER_ID, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    skip: !uid || !myUserId,
    variables: {
      skip: !uid || !myUserId,
      type: uid,
      page: {
        page: page ? page : 0,
        size: INSTANTS_PAGEABLE_PAGE_SIZE + 1,
      },
    },
  });
  const filterType = id
    ? "INSTANT_ID"
    : uid
    ? "USER_ID"
    : libId
    ? "LIBRARY_ID"
    : null;
  const filterValue = id ? id : uid ? uid : libId ? libId : null;
  const {
    loading,
    error,
    data,
    fetchMore: fetchMoreAllInstants,
  } = useQuery<GET_ALL_INSTANTS>(GET_ALL_INSTANTS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    skip: !myUserId,
    variables: {
      skip: !myUserId,
      filterType: filterType,
      filterValue: filterValue,
      page: {
        page: 0,
        size: INSTANTS_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  const {
    loading: loadingCurrentLibrary,
    error: libraryError,
    data: library,
  } = useQuery<FIND_LIBRARY_BY_ID>(FIND_LIBRARY_BY_ID, {
    skip: !libId || !myUserId,
    variables: {
      skip: !libId || !myUserId,
      type: libId,
    },
  });

  const {
    data: instantsLibraries,
    loading: loadingInstantsLibraries,
    fetchMore: fetchMoreInstantsLibraries,
  } = useQuery<FIND_INSTANTS_BY_IDS>(FIND_INSTANTS_BY_IDS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    skip: !libId || !library || !myUserId,
    variables: {
      skip: !libId || !library || !myUserId,
      page: {
        page: page ? page : 0,
        size: INSTANTS_PAGEABLE_PAGE_SIZE + 1,
      },
      type: library?.findLibraryById.instants,
    },
  });

  const {
    data: instantOutside,
    refetch: refetchInstantOutside,
    loading: loadingInstantOutside,
  } = useQuery<FIND_INSTANT_BY_ID>(FIND_INSTANT_BY_ID, {
    skip: !id,
    variables: {
      skip: !id,
      type: id,
    },
  });

  const handleVideoRef = (index: number) => (ref: any) => {
    /**@ts-ignore */
    videoRefs.current[index] = ref;
  };

  useEffect(() => {
    if (!myUserId && id && !publicInstant)
      getInstantById(id).then((val) => setPublicInstant(val));
  }, [id]);

  const handleLoad = async (index: number) => {
    if (
      loadingUserInstants ||
      loadingCurrentLibrary ||
      loadingInstantOutside ||
      loadingInstantsLibraries ||
      loading ||
      !myUserId
    )
      return;
    if (
      instantsLibraries?.findInstantsByIds.count &&
      libId != undefined &&
      index + indexQuery < instantsLibraries?.findInstantsByIds.count
    ) {
      await fetchMoreInstantsLibraries({
        variables: {
          type: library?.findLibraryById.instants,
          page: { page: pageable, size: INSTANTS_PAGEABLE_PAGE_SIZE + 1 },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            findInstantsByIds: {
              count: instantsLibraries?.findInstantsByIds.count,
              data: [
                ...previousResult.findInstantsByIds.data,
                ...fetchMoreResult.findInstantsByIds.data,
              ],
            },
          };
        },
      });
    }
    if (
      userInstants?.getInstantsByUserId.count &&
      uid != undefined &&
      index < userInstants?.getInstantsByUserId.count
    ) {
      await fetchMoreUserInstants({
        variables: {
          type: uid,
          page: { page: pageable, size: INSTANTS_PAGEABLE_PAGE_SIZE + 1 },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (previousResult.getInstantsByUserId) {
            return {
              getInstantsByUserId: {
                count: userInstants?.getInstantsByUserId.count,
                data: [
                  ...previousResult.getInstantsByUserId.data,
                  ...fetchMoreResult.getInstantsByUserId.data,
                ],
              },
            };
          }
          return {
            getInstantsByUserId: {
              count: userInstants?.getInstantsByUserId.count,
              data: [...fetchMoreResult.getInstantsByUserId.data],
            },
          };
        },
      });
    }

    if (
      (userInstants?.getInstantsByUserId.count &&
        pageable >= userInstants?.getInstantsByUserId.count - 1) ||
      (instantsLibraries?.findInstantsByIds.count &&
        pageable >= instantsLibraries?.findInstantsByIds.count - 1)
    ) {
      setPageable(0);
      setStartToSuggestInstants(true);
    }
    //suggest instant has no end, is infinite
    if (startToSuggestInstants) {
      await fetchMoreAllInstants({
        variables: {
          filterType: filterType,
          filterValue: filterValue,
          page: { page: pageable, size: INSTANTS_PAGEABLE_PAGE_SIZE + 1 },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (previousResult.findAllInstants) {
            return {
              findAllInstants: {
                count: previousResult.findAllInstants.count,
                data: [
                  ...previousResult.findAllInstants.data,
                  ...fetchMoreResult.findAllInstants.data,
                ],
              },
            };
          }
          return {
            findAllInstants: {
              count: fetchMoreResult.findAllInstants.count,
              data: [...fetchMoreResult.findAllInstants.data],
            },
          };
        },
      });
    }
    if (initInstantSkeleton) setInitInstantSkeleton(false);
    setPageable((prev) =>
      prev == 0 && startToSuggestInstants ? prev : prev + 1
    );
  };

  const instantOutsideUserId = myUserId
    ? instantOutside?.findInstantById.userId
    : publicInstant?.userId;

  const instantOutsideRatingSum = myUserId
    ? instantOutside?.findInstantById.ratingSum
    : publicInstant?.ratingSum;

  const instantOutsideRatingNumber = myUserId
    ? instantOutside?.findInstantById.ratingsNumber
    : publicInstant?.ratingsNumber;

  const instantOutsideImage = myUserId
    ? instantOutside?.findInstantById.image
    : publicInstant?.image;

  const instantOutsideTitle = myUserId
    ? instantOutside?.findInstantById.title
    : publicInstant?.title;

  const instantOutsideContent = myUserId
    ? instantOutside != undefined && instantOutside.findInstantById.content
    : publicInstant?.content;

  const instantOutsideCreatedAt = myUserId
    ? instantOutside?.findInstantById.createdAt
    : publicInstant?.createdAt;

  function handleInstantScroll(currentTarget: EventTarget & HTMLElement) {
    const availablePages =
      currentTarget.scrollHeight / currentTarget.clientHeight;
    const currentIndex = currentTarget.scrollTop / currentTarget.clientHeight;
    if (
      libId &&
      instantsLibraries != undefined &&
      currentIndex < instantsLibraries?.findInstantsByIds.data.length
    ) {
      setCurrentActiveInstant(
        instantsLibraries?.findInstantsByIds.data[currentIndex]
      );
    }
    if (
      uid &&
      userInstants != undefined &&
      currentIndex < userInstants?.getInstantsByUserId.data.length
    ) {
      setCurrentActiveInstant(
        userInstants?.getInstantsByUserId.data[currentIndex]
      );
    }

    if (id && currentIndex == 0) {
      setCurrentActiveInstant({
        /**@ts-ignore */
        userId: instantOutsideUserId,
        rating:
          instantOutsideRatingNumber != undefined &&
          instantOutsideRatingSum != undefined &&
          instantOutsideRatingNumber > 0
            ? instantOutsideRatingSum / instantOutsideRatingNumber
            : 0,

        image: instantOutsideImage,
        title: instantOutsideTitle ? instantOutsideTitle : "",
        content: instantOutsideContent ? JSON.parse(instantOutsideContent) : [],
        createdAt: instantOutsideCreatedAt,
      });
    }
    if (
      uid &&
      userInstants != undefined &&
      currentIndex >= userInstants?.getInstantsByUserId.data.length
    ) {
      setCurrentActiveInstant(
        data?.findAllInstants.data[
          currentIndex - userInstants?.getInstantsByUserId.data.length
        ]
      );
    }
    if (
      libId &&
      instantsLibraries != undefined &&
      currentIndex >= instantsLibraries?.findInstantsByIds.data.length
    ) {
      setCurrentActiveInstant(
        instantsLibraries?.findInstantsByIds.data[
          currentIndex - instantsLibraries?.findInstantsByIds.data.length
        ]
      );
    }
    if (currentIndex >= availablePages - 1) {
      handleLoad(currentIndex);
    }
  }
  useEffect(() => {
    async function getHidden() {
      const hiddenPostsData = await getHiddenPosts();
      if (!hiddenPostsData) return;
      const serializeHiddenPosts: { postId: string; postType: PostType }[] =
        JSON.parse(hiddenPostsData);
      let result = [];
      for (let i = 0; i < serializeHiddenPosts.length; i++) {
        if (serializeHiddenPosts[i].postType === PostType.INSTANT) {
          result.push(serializeHiddenPosts[i].postId);
        }
      }
      setHiddenPosts(result);
    }
    getHidden();
    if (id) {
      setCurrentActiveInstant({
        /**@ts-ignore */
        userId: instantOutsideUserId,
        rating:
          instantOutsideRatingNumber != undefined &&
          instantOutsideRatingSum != undefined &&
          instantOutsideRatingNumber > 0
            ? instantOutsideRatingSum / instantOutsideRatingNumber
            : 0,

        image: instantOutsideImage,
        title: instantOutsideTitle ? instantOutsideTitle : "",
        content: instantOutsideContent ? JSON.parse(instantOutsideContent) : [],
        createdAt: instantOutsideCreatedAt,
      });
    }
    if (uid && userInstants != undefined) {
      setCurrentActiveInstant(data?.findAllInstants.data[0]);
    }
    if (libId && instantsLibraries != undefined) {
      setCurrentActiveInstant(instantsLibraries?.findInstantsByIds.data[0]);
    }
  }, []);

  return (
    <RoutingGuard skipValidation>
      {/* <Container bg="bg-gray-50"> */}
      <PostModals />
      <WriteModal />
      <ForceLogin />
      {myUserId && <TabBar instant={true} />}
      <Header
        postType={PostType.INSTANT}
        instants={true}
        authorId={active.userId}
        postId={active?.id}
      />
      <main className="lg:flex bg-gray-950">
        {/**Instants Vertical List */}
        <div
          ref={scrollParentRef}
          onScroll={({ currentTarget }) => handleInstantScroll(currentTarget)}
          className="relative w-full overflow-x-hidden overflow-y-scroll h-screen snap-y snap-mandatory scrollbar-hide max-w-5xl 2xl:mx-36"
        >
          <InfiniteScroll
            pageStart={page ? page : 0}
            loadMore={() => null}
            hasMore={true}
            loader={<div />}
            className="h-full"
            useWindow={true}
            /**@ts-ignore */
            getScrollParent={() => scrollParentRef}
          >
            {libId &&
              instantsLibraries?.findInstantsByIds.data
                ?.filter(
                  (props, idx) =>
                    idx >= indexQuery - (INSTANTS_PAGEABLE_PAGE_SIZE + 1) * page
                )
                .map((instant, idx) => {
                  return (
                    <Instant
                      setActive={setActive}
                      id={instant.id}
                      key={idx}
                      userId={instant.userId}
                      rating={
                        instant.ratingsNumber > 0
                          ? instant.ratingSum / instant.ratingsNumber
                          : 0
                      }
                      image={instant?.image}
                      title={instant.title}
                      content={JSON.parse(instant?.content)}
                      createdAt={instant?.createdAt}
                      altImage="instant background image"
                      setVideoRef={handleVideoRef}
                    />
                  );
                })}
            {uid &&
              userInstants?.getInstantsByUserId.data
                ?.filter(
                  (props, idx) =>
                    idx >= indexQuery - (INSTANTS_PAGEABLE_PAGE_SIZE + 1) * page
                )
                .map((instant, idx) => {
                  return (
                    <Instant
                      setActive={setActive}
                      id={instant.id}
                      key={idx}
                      userId={instant.userId}
                      rating={
                        instant.ratingsNumber > 0
                          ? instant.ratingSum / instant.ratingsNumber
                          : 0
                      }
                      image={instant?.image}
                      title={instant.title}
                      content={JSON.parse(instant?.content)}
                      createdAt={instant?.createdAt}
                      altImage="instant background image"
                      setVideoRef={handleVideoRef}
                    />
                  );
                })}
            {id && instantOutsideUserId != null && (
              <Instant
                setActive={setActive}
                userId={instantOutsideUserId}
                rating={
                  instantOutsideRatingNumber != undefined &&
                  instantOutsideRatingSum != undefined &&
                  instantOutsideRatingNumber > 0
                    ? instantOutsideRatingSum / instantOutsideRatingNumber
                    : 0
                }
                id={id}
                key={id}
                image={instantOutsideImage}
                title={instantOutsideTitle ? instantOutsideTitle : ""}
                content={
                  instantOutsideContent ? JSON.parse(instantOutsideContent) : []
                }
                createdAt={instantOutsideCreatedAt}
                altImage="mountain"
                setVideoRef={handleVideoRef}
              />
            )}
            {!initInstantSkeleton &&
              startToSuggestInstants &&
              data?.findAllInstants.data.map((instant, idx) => {
                return (
                  <Instant
                    setActive={setActive}
                    id={instant.id}
                    key={idx}
                    userId={instant.userId}
                    rating={
                      instant.ratingsNumber > 0
                        ? instant.ratingSum / instant.ratingsNumber
                        : 0
                    }
                    image={instant?.image}
                    title={instant.title}
                    content={JSON.parse(instant?.content)}
                    createdAt={instant?.createdAt}
                    setVideoRef={handleVideoRef}
                    altImage="instant background image"
                  />
                );
              })}
            {(loadingUserInstants ||
              loadingCurrentLibrary ||
              loadingInstantOutside ||
              loadingInstantsLibraries ||
              loading ||
              initInstantSkeleton) && <InstantSkeleton />}
          </InfiniteScroll>
        </div>
        {/**Instant description only for desktop */}
        <InstantSidebar instant={currentActiveInstant} />
      </main>
      {/* </Container> */}
    </RoutingGuard>
  );
  {
    /*</RoutingGuard>*/
  }
};

export default Instants;
