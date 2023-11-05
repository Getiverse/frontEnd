import { NextPage } from "next";
import Container from "../components/container/Container";
import Text from "../components/Text";
import Title from "../components/Title";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import RecomandedAuthor from "../components/RecomandedAuthor";
import { useQuery } from "@apollo/client";
import { GET_ALL_AUTHORS } from "../graphql/query/author";
import RoutingGuard from "../components/RoutingGuard";
import { GET_MY_FOLLOW_USER_ID } from "../graphql/query/me";
import { FixedSizeList as List } from "react-window";
import { AUTHORS_PAGEABLE_PAGE_SIZE } from "../utils/constants";
import { CSSProperties, useRef, useState } from "react";
import InfiniteLoader from "react-window-infinite-loader";
import AvatarSkeleton from "../components/skeletons/AvatarSkeleton";
import TextSkeleton from "../components/skeletons/TextSkeleton";
import AutoSizer from "react-virtualized-auto-sizer";
import { toast } from "react-toastify";
import { checkIfAlreadyFollowed } from "../utils/functions";

const Authors: NextPage = () => {
  const router = useRouter();
  const parentRef = useRef(null);
  const [page, setPage] = useState(1);
  const [moreUsersToLoad, setMoreUsersToLoad] = useState(true);
  const {
    loading,
    error,
    data,
    fetchMore: fetchMoreAuthors,
  } = useQuery<GET_ALL_AUTHORS>(GET_ALL_AUTHORS, {
    variables: {
      page: {
        page: 0,
        size: AUTHORS_PAGEABLE_PAGE_SIZE,
      },
    },
  });

  const { data: authors, loading: authorsLoading } =
    useQuery<GET_MY_FOLLOW_USER_ID>(GET_MY_FOLLOW_USER_ID);

  async function loadMore() {
    await fetchMoreAuthors({
      variables: {
        page: {
          page: page,
          size: AUTHORS_PAGEABLE_PAGE_SIZE,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!moreUsersToLoad) return previousResult;
        if (!previousResult.findAllUsers) return fetchMoreResult;
        if (fetchMoreResult.findAllUsers.data.length == 0) {
          setMoreUsersToLoad(false);
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          findAllUsers: {
            count: previousResult.findAllUsers.count,
            data: [
              ...previousResult.findAllUsers.data,
              ...fetchMoreResult.findAllUsers.data,
            ],
          },
        });
      },
    });
    setPage((prev) => prev + 1);
  }

  const loadMoreItems = loading ? () => {} : loadMore;
  const isItemLoaded = (index: number) =>
    data?.findAllUsers != null &&
    index < data?.findAllUsers.data.length &&
    !loading;

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    return data?.findAllUsers.data[index] != null &&
      data?.findAllUsers.data[index] != undefined ? (
      <RecomandedAuthor
        disableRedirect
        style={style}
        isFollowed={checkIfAlreadyFollowed(
          authors?.me.follow,
          data?.findAllUsers.data[index].id
        )}
        key={data?.findAllUsers.data[index].id}
        id={data?.findAllUsers.data[index].id}
        src={data?.findAllUsers.data[index].profileImage}
        alt="profile image"
        author={data?.findAllUsers.data[index].userName}
        bio={data?.findAllUsers.data[index].bio}
      />
    ) : (
      <div className="flex items-center w-full justify-between" style={style}>
        <AvatarSkeleton height="h-10" width="w-10" />
        <div className="space-y-3">
          <TextSkeleton height="h-3" width="w-16" />
          <TextSkeleton height="h-2" width="w-40" />
        </div>
        <TextSkeleton height="h-8" className="rounded-xl" width="w-20" />
      </div>
    );
  };

  return (
    <RoutingGuard>
      <Container
        bg="bg-[url('/category_universe_bg.jpg')] bg-cover"
        className="flex flex-col items-center px-4"
      >
        <div className="mt-6 relative w-full">
          <IoIosArrowBack
            color="white"
            className="absolute"
            size={30}
            onClick={() => router.back()}
          />
          <Text
            className="text-center w-full"
            color="text-gray-50"
            size="text-lg"
            weight="font-base"
          >
            Welcome to Getiverse
          </Text>
        </div>
        <Title
          size="text-2xl"
          color="text-gray-300"
          className="text-center mt-8"
          weight="font-bold"
        >
          Recomanded For you
        </Title>
        <div className="flex-1 w-full pb-10">
          {data?.findAllUsers && (
            <AutoSizer>
              {({ height, width }: { height: number; width: number }) => (
                <InfiniteLoader
                  isItemLoaded={isItemLoaded}
                  itemCount={data.findAllUsers.count}
                  loadMoreItems={loadMoreItems}
                >
                  {({ onItemsRendered, ref }) => (
                    <List
                      className="List my-2 scrollbar-hide"
                      height={height}
                      itemCount={data.findAllUsers.count}
                      itemSize={70}
                      onItemsRendered={onItemsRendered}
                      ref={ref}
                      width={width}
                    >
                      {Row}
                    </List>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          )}
        </div>
        <div className="h-16 pb-6 w-full flex justify-end">
          <button
            className="bg-white rounded-2xl text-blue-500 px-6 "
            onClick={() =>
              handleAuthorsChecks(authors?.me.follow.length) &&
              router.push("/home")
            }
          >
            FINISH
          </button>
        </div>
      </Container>
    </RoutingGuard>
  );
};

function handleAuthorsChecks(authorsLength: number | undefined) {
  if (!authorsLength || authorsLength < 3) {
    toast.error("Please follow at least three authors");
    return false;
  }
  return true;
}

export default Authors;
