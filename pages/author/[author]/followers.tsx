import { useQuery } from "@apollo/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { CSSProperties, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Container from "../../../components/container/Container";
import DropDown from "../../../components/DropDown";
import Header from "../../../components/logged_in/layout/Header";
import TabBar from "../../../components/logged_in/layout/TabBar";
import RoutingGuard from "../../../components/RoutingGuard";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { GET_USER_FOLLOWERS } from "../../../graphql/query/author";
import { GET_MY_FOLLOW_USER_ID } from "../../../graphql/query/me";
import InfiniteLoader from "react-window-infinite-loader";
import { AUTHORS_PAGEABLE_PAGE_SIZE } from "../../../utils/constants";
import Author from "../../../components/Author";
import AvatarSkeleton from "../../../components/skeletons/AvatarSkeleton";
import TextSkeleton from "../../../components/skeletons/TextSkeleton";

const Followers: NextPage = () => {
  const router = useRouter();
  const items = ["Most Relevant", "New Activity", "A-Z"];
  const [selectedFilter, setSelectedFilter] = useState("Most Relevant");
  const [page, setPage] = useState(1);
  const [moreUsersToLoad, setMoreUsersToLoad] = useState(true);
  const authorId = router.query.id as string;
  const {
    data,
    loading,
    fetchMore: fetchMoreAuthors,
  } = useQuery<GET_USER_FOLLOWERS>(GET_USER_FOLLOWERS, {
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
          if (!previousResult.getUserFollowers) return fetchMoreResult;
          if (fetchMoreResult.getUserFollowers.data.length == 0) {
            setMoreUsersToLoad(false);
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            getUserFollowers: {
              count: previousResult.getUserFollowers.count,
              data: [
                ...previousResult.getUserFollowers.data,
                ...fetchMoreResult.getUserFollowers.data,
              ],
            },
          });
        },
      });
      setPage((prev) => prev + 1);
    }
  }
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    return data?.getUserFollowers.data[index] != null ||
      data?.getUserFollowers.data[index] != undefined ? (
      <Author
        style={style}
        isFollow={
          me?.me
            ? me?.me.follow.includes(data?.getUserFollowers.data[index].id)
            : false
        }
        key={data?.getUserFollowers.data[index].id}
        id={data?.getUserFollowers.data[index].id}
        src={data?.getUserFollowers.data[index].profileImage}
        name={data?.getUserFollowers.data[index].userName}
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
        <Header label="Followers" />
        {/* <DropDown
          active={selectedFilter}
          setActive={setSelectedFilter}
          Icon={MdKeyboardArrowDown}
          items={items}
        /> */}
        <main className="flex-1 h-full pt-2">
          {data?.getUserFollowers?.data && (
            <AutoSizer>
              {({ height, width }: { height: number; width: number }) => (
                <InfiniteLoader
                  isItemLoaded={(index) =>
                    data?.getUserFollowers && !loading
                      ? index < data?.getUserFollowers?.data.length
                      : false
                  }
                  itemCount={data?.getUserFollowers?.count}
                  loadMoreItems={loadMore}
                >
                  {({ onItemsRendered, ref }) => (
                    <List
                      className="List scrollbar-hide pb-20"
                      height={height}
                      itemCount={data?.getUserFollowers?.count}
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
export default Followers;
