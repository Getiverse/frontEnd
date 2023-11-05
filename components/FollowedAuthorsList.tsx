import { useRouter } from "next/router";
import { FOLLOWED_AUTHORS_PAGE_SIZE, RoutesName } from "../utils/constants";
import Avatar from "./Avatar";
import AvatarSkeleton from "./skeletons/AvatarSkeleton";
import Text from "./Text";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useQuery } from "@apollo/client";
import { GET_MY_FOLLOW } from "../graphql/query/me";
import { CSSProperties, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import TextSkeleton from "./skeletons/TextSkeleton";

function FollowedAuthorsList() {
  const router = useRouter();
  const selectedAuthor = router.query;
  const [followedAuthorsPage, setFollowedAuthorsPage] = useState(1);
  const [moreUsersToLoad, setMoreUsersToLoad] = useState(true);

  const {
    data: authors,
    loading,
    fetchMore: fetchMoreAuthors,
  } = useQuery<GET_MY_FOLLOW>(GET_MY_FOLLOW, {
    variables: {
      page: {
        page: 0,
        size: FOLLOWED_AUTHORS_PAGE_SIZE,
      },
    },
  });
  const Column = ({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties;
  }) => {
    return authors?.getFollow.data[index] != null &&
      authors?.getFollow.data[index] != undefined ? (
      <div
        style={style}
        key={index}
        onClick={() =>
          selectedAuthor.id == authors?.getFollow.data[index].id
            ? router.push("/home")
            : router.push(
                "/home/" +
                  authors?.getFollow.data[index].userName +
                  "?id=" +
                  authors?.getFollow.data[index].id
              )
        }
        className={`cursor-pointer ${
          authors?.getFollow.data[index].id == selectedAuthor?.id
            ? "bg-blue-200 dark:bg-blue-900 rounded-xl "
            : ""
        } py-2 px-2 flex flex-col justify-center items-center`}
      >
        {!loading ? (
          <Avatar
            src={authors?.getFollow.data[index].profileImage}
            width="w-10"
            height="h-10"
            active={false}
          />
        ) : (
          <AvatarSkeleton width="w-10" height="h-10" />
        )}
        <Text
          size="text-xs"
          className="pt-1 leading-none text-center"
          weight={"font-base"}
        >
          {authors?.getFollow.data[index].userName.slice(0, 5)}
          {authors?.getFollow &&
          authors?.getFollow.data[index].userName.length > 5
            ? "..."
            : ""}
        </Text>
      </div>
    ) : (
      <div
        className="flex flex-col items-center justify-center space-y-1"
        style={style}
      >
        <AvatarSkeleton height="h-10" width="w-10" />
        <TextSkeleton width="w-6" height="h-2" />
      </div>
    );
  };

  async function loadMore() {
    if (!loading) {
      await fetchMoreAuthors({
        variables: {
          page: {
            page: followedAuthorsPage,
            size: FOLLOWED_AUTHORS_PAGE_SIZE,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!moreUsersToLoad) return previousResult;
          if (!previousResult.getFollow) return fetchMoreResult;
          if (fetchMoreResult.getFollow.data.length == 0) {
            setMoreUsersToLoad(false);
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            getFollow: {
              count: previousResult.getFollow.count,
              data: [
                ...previousResult.getFollow.data,
                ...fetchMoreResult.getFollow.data,
              ],
            },
          });
        },
      });
      setFollowedAuthorsPage((prev) => prev + 1);
    }
  }

  return authors?.getFollow ? (
    <div
      id="authors"
      className="relative dark:border-gray-700 bg-gray-50 dark:bg-slate-900 lg:bg-transparent lg:border-0 lg:dark:bg-transparent border-b border-gray-200"
    >
      <div className="p-1 flex w-[calc(100%-38px)] space-x-3 px-3 h-20">
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <InfiniteLoader
              isItemLoaded={(index) =>
                !loading
                  ? authors && index < authors.getFollow.data.length
                  : false
              }
              itemCount={authors?.getFollow.count}
              loadMoreItems={loadMore}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  className="scrollbar-hide"
                  height={height}
                  itemCount={authors?.getFollow.count}
                  itemSize={70}
                  layout="horizontal"
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                  width={width}
                >
                  {Column}
                </List>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
        <button
          onClick={() => router.push(RoutesName.AUTHORS)}
          className="bg-blue-500 shadow-2xl py-3 drop-shadow-lg rounded-l-3xl px-4 text-white absolute right-0 top-1/2 -translate-y-1/2"
        >
          All
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default FollowedAuthorsList;
