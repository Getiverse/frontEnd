import { useQuery } from "@apollo/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { CSSProperties, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Author from "../../../components/Author";
import Container from "../../../components/container/Container";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import DropDown from "../../../components/DropDown";
import InfiniteLoader from "react-window-infinite-loader";
import Header from "../../../components/logged_in/layout/Header";
import TabBar from "../../../components/logged_in/layout/TabBar";
import RoutingGuard from "../../../components/RoutingGuard";
import { GET_USER_FOLLOWING } from "../../../graphql/query/author";
import { GET_MY_FOLLOW_USER_ID } from "../../../graphql/query/me";
import { AUTHORS_PAGEABLE_PAGE_SIZE } from "../../../utils/constants";
import AvatarSkeleton from "../../../components/skeletons/AvatarSkeleton";
import TextSkeleton from "../../../components/skeletons/TextSkeleton";

const Following: NextPage = () => {
  const items = ["Most Relevant", "New Activity", "A-Z"];
  const [selectedFilter, setSelectedFilter] = useState("Most Relevant");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [moreUsersToLoad, setMoreUsersToLoad] = useState(true);
  const authorId = router.query.id as string;
  const {
    data,
    loading,
    fetchMore: fetchMoreAuthors,
  } = useQuery<GET_USER_FOLLOWING>(GET_USER_FOLLOWING, {
    variables: {
      type: authorId,
      page: {
        page: 0,
        size: AUTHORS_PAGEABLE_PAGE_SIZE,
      },
    },
  });
  const { data: me } = useQuery<GET_MY_FOLLOW_USER_ID>(GET_MY_FOLLOW_USER_ID);
  async function loadMore() {
    if (!loading) {
      await fetchMoreAuthors({
        variables: {
          type: authorId,
          page: {
            page: 0,
            size: AUTHORS_PAGEABLE_PAGE_SIZE,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!moreUsersToLoad) return previousResult;
          if (!previousResult.getUserFollowing) return fetchMoreResult;
          if (fetchMoreResult.getUserFollowing.data.length == 0) {
            setMoreUsersToLoad(false);
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            getUserFollowing: {
              count: previousResult.getUserFollowing.count,
              data: [
                ...previousResult.getUserFollowing.data,
                ...fetchMoreResult.getUserFollowing.data,
              ],
            },
          });
        },
      });
      setPage((prev) => prev + 1);
    }
  }
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    return data?.getUserFollowing.data[index] != null ||
      data?.getUserFollowing.data[index] != undefined ? (
      <Author
        style={style}
        isFollow={
          me?.me
            ? me?.me.follow.includes(data?.getUserFollowing.data[index].id)
            : false
        }
        key={data?.getUserFollowing.data[index].id}
        id={data?.getUserFollowing.data[index].id}
        src={data?.getUserFollowing.data[index].profileImage}
        name={data?.getUserFollowing.data[index].userName}
      />
    ) : (
      <div
        className="flex items-center w-full justify-between px-4"
        style={style}
      >
        <AvatarSkeleton height="h-10" width="w-10" />
        <div className="space-y-3">
          <TextSkeleton height="h-3" width="w-16" />
          <TextSkeleton height="h-2" width="w-40" />
        </div>
        <div className={`w-8 h-8 bg-gray-500 animate-pulse rounded-full`} />
      </div>
    );
  };

  return (
    <RoutingGuard>
      <Container bg="bg-gray-50" className="flex flex-col">
        <Header label="Following" />
        {/* <DropDown
          active={selectedFilter}
          setActive={setSelectedFilter}
          Icon={MdKeyboardArrowDown}
          items={items}
        /> */}
        <main className="flex-1 h-full pt-2">
          {data?.getUserFollowing?.data && (
            <AutoSizer>
              {({ height, width }: { height: number; width: number }) => (
                <InfiniteLoader
                  isItemLoaded={(index) =>
                    data?.getUserFollowing && !loading
                      ? index < data?.getUserFollowing?.data.length
                      : false
                  }
                  itemCount={data?.getUserFollowing?.count}
                  loadMoreItems={loadMore}
                >
                  {({ onItemsRendered, ref }) => (
                    <List
                      className="List scrollbar-hide pb-20"
                      height={height}
                      itemCount={data?.getUserFollowing?.count}
                      itemSize={64}
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
        </main>
        <TabBar />
      </Container>
    </RoutingGuard>
  );
};
export default Following;
