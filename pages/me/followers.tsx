import { useQuery } from "@apollo/client";
import { NextPage } from "next";
import { CSSProperties, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import InfiniteLoader from "react-window-infinite-loader";
import Author from "../../components/Author";
import Container from "../../components/container/Container";
import DropDown from "../../components/DropDown";
import LoadingSpinner from "../../components/LoadingSpinner";
import Header from "../../components/logged_in/layout/Header";
import TabBar from "../../components/logged_in/layout/TabBar";
import RoutingGuard from "../../components/RoutingGuard";
import AvatarSkeleton from "../../components/skeletons/AvatarSkeleton";
import TextSkeleton from "../../components/skeletons/TextSkeleton";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  GET_MY_FOLLOWERS,
  GET_MY_FOLLOW_USER_ID,
  GET_MY_PROFILE_PRIMARY_STATS,
} from "../../graphql/query/me";
import useUid from "../../hooks/useUid";
import { AUTHORS_PAGEABLE_PAGE_SIZE } from "../../utils/constants";
import { FixedSizeList as List } from "react-window";

const Followers: NextPage = () => {
  const items = ["Most Relevant", "New Activity", "A-Z"];
  const [selectedFilter, setSelectedFilter] = useState("Most Relevant");
  const [page, setPage] = useState(1);
  const [moreUsersToLoad, setMoreUsersToLoad] = useState(true);
  const { data: me } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(
    GET_MY_PROFILE_PRIMARY_STATS
  );
  const {
    data: followers,
    loading,
    fetchMore: fetchMoreAuthors,
  } = useQuery<GET_MY_FOLLOWERS>(GET_MY_FOLLOWERS, {
    variables: {
      page: {
        page: 0,
        size: AUTHORS_PAGEABLE_PAGE_SIZE,
      },
    },
  });
  const uid = useUid();

  async function loadMore() {
    if (!loading) {
      await fetchMoreAuthors({
        variables: {
          page: {
            page: page,
            size: AUTHORS_PAGEABLE_PAGE_SIZE,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!moreUsersToLoad) return previousResult;
          if (!previousResult.getFollowers) return fetchMoreResult;
          if (fetchMoreResult.getFollowers.data.length == 0) {
            setMoreUsersToLoad(false);
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            getFollowers: {
              count: previousResult.getFollowers.count,
              data: [
                ...previousResult.getFollowers.data,
                ...fetchMoreResult.getFollowers.data,
              ],
            },
          });
        },
      });
      setPage((prev) => prev + 1);
    }
  }
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    return followers?.getFollowers.data[index] != null ||
      followers?.getFollowers.data[index] != undefined ? (
      <Author
        style={style}
        isFollow={
          me?.me
            ? me?.me.follow.includes(followers?.getFollowers.data[index].id)
            : false
        }
        key={followers?.getFollowers.data[index].id}
        id={followers?.getFollowers.data[index].id}
        src={followers?.getFollowers.data[index].profileImage}
        name={followers?.getFollowers.data[index].userName}
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
      <LoadingSpinner open={loading} />
      <Container bg="bg-gray-50" className="flex flex-col">
        <Header label="Followers" />
        {/* <DropDown
          active={selectedFilter}
          setActive={setSelectedFilter}
          Icon={MdKeyboardArrowDown}
          items={items}
        /> */}
        <main className="flex-1 h-full pt-2">
          {followers?.getFollowers && (
            <AutoSizer>
              {({ height, width }: { height: number; width: number }) => (
                <InfiniteLoader
                  isItemLoaded={(index) =>
                    followers?.getFollowers && !loading
                      ? index < followers?.getFollowers.data.length
                      : false
                  }
                  itemCount={followers?.getFollowers.count}
                  loadMoreItems={loadMore}
                >
                  {({ onItemsRendered, ref }) => (
                    <List
                      className="List scrollbar-hide pb-20"
                      height={height}
                      itemCount={followers?.getFollowers.count}
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
