import { NextPage } from "next";
import { CSSProperties, useState } from "react";
import Container from "../../components/container/Container";
import Header from "../../components/logged_in/layout/Header";
import TabBar from "../../components/logged_in/layout/TabBar";
import Avatar from "../../components/Avatar";
import Text from "../../components/Text";
import DropDown from "../../components/DropDown";
import { MdKeyboardArrowDown } from "react-icons/md";
import RoutingGuard from "../../components/RoutingGuard";
import { useQuery } from "@apollo/client";
import { GraphqlAuthor } from "../../graphql/types/author";
import { GET_MY_FOLLOW } from "../../graphql/query/me";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { AUTHORS_PAGEABLE_PAGE_SIZE } from "../../utils/constants";
import AvatarSkeleton from "../../components/skeletons/AvatarSkeleton";
import TextSkeleton from "../../components/skeletons/TextSkeleton";
import { useRouter } from "next/router";

const Authors: NextPage = () => {
  const items = ["Most Relevant", "New Activity", "A-Z", "Favourites"];
  const [selectedFilter, setSelectedFilter] = useState("Most Relevant");
  const [page, setPage] = useState(1);
  const [moreUsersToLoad, setMoreUsersToLoad] = useState(true);
  const {
    data: authors,
    loading,
    fetchMore: fetchMoreAuthors,
  } = useQuery<GET_MY_FOLLOW>(GET_MY_FOLLOW, {
    variables: {
      page: {
        page: 0,
        size: AUTHORS_PAGEABLE_PAGE_SIZE,
      },
    },
  });
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
      setPage((prev) => prev + 1);
    }
  }

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    return authors?.getFollow.data[index] != null ||
      authors?.getFollow.data[index] != undefined ? (
      <Author
        style={style}
        key={authors?.getFollow.data[index].id}
        id={authors?.getFollow.data[index].id}
        src={authors?.getFollow.data[index].profileImage}
        name={authors?.getFollow.data[index].userName}
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
        <Header label="Authors" />
        {/* <DropDown
          active={selectedFilter}
          setActive={setSelectedFilter}
          Icon={MdKeyboardArrowDown}
          items={items}
        /> */}
        <main className="flex-1 h-full pt-4">
          {authors?.getFollow && (
            <AutoSizer>
              {({ height, width }: { height: number; width: number }) => (
                <InfiniteLoader
                  isItemLoaded={(index) =>
                    !loading && index < authors?.getFollow.data.length
                  }
                  itemCount={authors.getFollow.count}
                  loadMoreItems={loadMore}
                >
                  {({ onItemsRendered, ref }) => (
                    <List
                      className="List scrollbar-hide pb-20"
                      height={height}
                      itemCount={authors.getFollow.count}
                      itemSize={62}
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

export default Authors;

const Author = ({
  src,
  name,
  id,
  style,
}: {
  src: string;
  name: string;
  id: string;
  style: CSSProperties;
}) => {
  const router = useRouter();
  return (
    <div
      className="flex w-full px-4 items-center"
      style={style}
      onClick={() => router.push("/author/" + "@" + name + "?id=" + id)}
    >
      <div className="flex w-full items-center space-x-8">
        <Avatar src={src} />
        <Text>{name.slice(0, 15) + "" + (name.length > 15 ? "..." : "")}</Text>
      </div>
      <div className="w-3 h-3 rounded-full bg-blue-500" />
    </div>
  );
};
