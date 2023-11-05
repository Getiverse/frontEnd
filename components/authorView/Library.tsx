import { FixedSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import useAuthorLibraryFetch from "../../hooks/author/useAuthorLibraryFetch";
import Library from "../Library";
import { CSSProperties } from "react";

function Libraries() {
  const {
    loadMoreLibraries,
    libraries,
    loadingLibraries,
    librariesCount,
    libraryPage,
    refetchLibraries,
  } = useAuthorLibraryFetch();
  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: CSSProperties;
  }) => {
    const index = 2 * rowIndex + columnIndex;

    return libraries &&
      !loadingLibraries &&
      libraries[index] != null &&
      libraries[index] != undefined ? (
      <Library
        style={style}
        id={libraries[index].id}
        key={libraries[index].id}
        articles={libraries[index].articles.length}
        instants={libraries[index].instants.length}
        isPrivate={libraries[index].isPrivate}
        title={libraries[index].title}
        image={libraries[index].image}
      />
    ) : (
      <div style={style} className="p-1">
        <div className="bg-gray-500 animate-pulse rounded-xl w-full h-full"></div>
      </div>
    );
  };

  if (!loadingLibraries)
    return (
      <main className="w-full h-full flex-1 px-1 pt-4 overflow-x-hidden">
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <InfiniteLoader
              isItemLoaded={(index) =>
                libraries
                  ? index < libraries.length && !loadingLibraries
                  : false
              }
              itemCount={librariesCount ? librariesCount : 0}
              loadMoreItems={loadMoreLibraries}
            >
              {({ onItemsRendered, ref }) => (
                <FixedSizeGrid
                  className="scrollbar-hide pb-20"
                  columnCount={2}
                  rowCount={librariesCount ? Math.floor(librariesCount / 2) : 0}
                  rowHeight={176}
                  columnWidth={176}
                  height={height}
                  ref={ref}
                  width={width}
                  onItemsRendered={({
                    visibleRowStartIndex,
                    visibleColumnStartIndex,
                    visibleRowStopIndex,
                    overscanRowStopIndex,
                    overscanRowStartIndex,
                  }) => {
                    onItemsRendered({
                      overscanStartIndex: overscanRowStartIndex,
                      overscanStopIndex: overscanRowStopIndex,
                      visibleStartIndex: visibleRowStartIndex,
                      visibleStopIndex: visibleRowStopIndex,
                    });
                  }}
                >
                  {Cell}
                </FixedSizeGrid>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </main>
    );
}

export default Libraries;
