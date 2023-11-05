import { CSSProperties, useCallback } from "react";
import { HiOutlineCollection } from "react-icons/hi";
import { GraphqlInstant } from "../../graphql/types/instant";
import Text from "../Text";
import MiniInstant from "./MiniInstant";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList as List } from "react-window";
import MiniInstantSkeleton from "../skeletons/MiniInstantSkeleton";

function InstantList({
  className = "",
  instants,
  specialFetch = "",
  count,
  page,
  isEditable = false,
  loading,
  loadMore,
}: {
  className?: string;
  instants: GraphqlInstant[];
  page: number;
  specialFetch?: "" | "library" | "profile";
  count: number;
  loading: boolean;
  isEditable?: boolean;
  loadMore: () => void;
}) {
  // const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);

  // useEffect(() => {
  //   async function getHidden() {
  //     const hiddenPosts = await getHiddenPosts();
  //     if (!hiddenPosts) return;
  //     const serializeHiddenPosts: { postId: string; postType: PostType }[] =
  //       JSON.parse(hiddenPosts);
  //     let result = [];
  //     for (let i = 0; i < serializeHiddenPosts.length; i++) {
  //       if (serializeHiddenPosts[i].postType === PostType.INSTANT) {
  //         result.push(serializeHiddenPosts[i].postId);
  //       }
  //     }
  //     setHiddenPosts(result);
  //   }
  //   getHidden();
  // }, []);
  const hasNext = instants.length < count;

  const loadMoreItems = async (startIndex: number, stopIndex: number) => {
    if (!loading && instants.length < count) {
      await loadMore();
    }
    return;
  };

  const Column = ({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties;
  }) => {
    return instants[index] != null || instants[index] != undefined ? (
      <MiniInstant
        isEditable={isEditable}
        style={style}
        instantsCount={count}
        position={index}
        key={instants[index].id}
        specialFetch={specialFetch}
        {...instants[index]}
      />
    ) : (
      <MiniInstantSkeleton style={style} />
    );
  };
  return instants.length > 0 ? (
    <div
      className={`${className} bg-slate-900 w-full border-t-2 border-gray-200 dark:border-gray-700 mt-3 px-5 pb-20`}
    >
      <svg width="0" height="0">
        <linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor="#38BDF8" offset="0%" />
          <stop stopColor="#F472B6" offset="100%" />
        </linearGradient>
      </svg>
      <div className="flex items-center py-4 space-x-3">
        <HiOutlineCollection
          className="-rotate-90"
          style={{ stroke: "url(#blue-gradient)" }}
          size="42"
        />
        <Text color="text-white" weight="font-normal" size="text-2xl">
          Instants
        </Text>
      </div>
      <div className="h-80 w-full">
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <InfiniteLoader
              isItemLoaded={(index) =>
                (index < instants.length && !loading) || !hasNext
              }
              itemCount={hasNext ? instants.length + 1 : instants.length}
              /**@ts-ignore */
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  direction="horizontal"
                  className="scrollbar-hide"
                  height={height}
                  itemCount={hasNext ? instants.length + 1 : instants.length}
                  itemSize={220}
                  layout="horizontal"
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                  overscanCount={2}
                  width={width}
                >
                  {Column}
                </List>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </div>
  ) : (
    <div className="pb-20"></div>
  );
}

export default InstantList;
