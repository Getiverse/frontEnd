import { NextPage } from "next";
import { BsPlusLg } from "react-icons/bs";
import Library from "../components/Library";
import Header from "../components/logged_in/layout/Header";
import TabBar from "../components/logged_in/layout/TabBar";
import addBg from "/public/add_library_bg.jpg";
import Container from "../components/container/Container";
import WriteModal from "../components/specialModals/WriteModal";
import NewLibrary from "../components/specialModals/NewLibrary";
import RoutingGuard from "../components/RoutingGuard";
import { CSSProperties } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { FixedSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import useSaveToLibraryFetch from "../hooks/modals/useSaveToLibraryFetch";
import { ModalType } from "../components/types/Modal";
import { useRecoilState } from "recoil";
import { moreModal } from "../utils/atoms/moreModal";
import Image from "next/image";

const Saved: NextPage = () => {
  const {
    loadMoreLibraries,
    libraries,
    loadingLibraries,
    librariesCount,
    libraryPage,
    refetchLibraries,
  } = useSaveToLibraryFetch();
  const [modal, setModal] = useRecoilState(moreModal);

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: CSSProperties;
  }) => {
    const CELL_GAP = 10;
    const styles_overload = {
      ...style,
      left:
        columnIndex === 0
          ? style.left
          : Number(style.left) + columnIndex * CELL_GAP,
      right:
        columnIndex === 2
          ? style.right
          : Number(style.right) + columnIndex * CELL_GAP,
      top: rowIndex === 0 ? style.top : Number(style.top) + rowIndex * CELL_GAP,
    };

    const index = 2 * rowIndex + columnIndex;
    if (
      librariesCount == 0 ||
      (index == 0 &&
        !loadingLibraries &&
        libraries != undefined &&
        !loadingLibraries &&
        libraries[index] != null &&
        libraries[index] != undefined)
    )
      return (
        <button
          style={styles_overload}
          onClick={() =>
            setModal((prev) => ({
              ...prev,
              open: true,
              type: ModalType.NEW_LIBRARY,
            }))
          }
          className="relative rounded-2xl text-6xl text-white flex justify-center items-center"
        >
          <Image
            src={addBg}
            alt="universe image"
            className="w-full h-full absolute object-cover rounded-2xl"
          />
          <BsPlusLg className="z-20" />
        </button>
      );
    if (
      libraries &&
      librariesCount &&
      !libraries[index - 1] &&
      !loadingLibraries &&
      index >= librariesCount
    ) {
      return <></>;
    }
    return libraries &&
      !loadingLibraries &&
      libraries[index - 1] != null &&
      libraries[index - 1] != undefined ? (
      <Library
        style={styles_overload}
        id={libraries[index - 1].id}
        key={libraries[index - 1].id}
        articles={libraries[index - 1].articles.length}
        instants={libraries[index - 1].instants.length}
        isPrivate={libraries[index - 1].isPrivate}
        title={libraries[index - 1].title}
        image={libraries[index - 1].image}
      />
    ) : (
      <div style={style} className="p-1">
        <div className="bg-gray-500 animate-pulse rounded-xl w-full h-full"></div>
      </div>
    );
  };

  return (
    <RoutingGuard>
      <WriteModal />
      <NewLibrary />
      <LoadingSpinner open={loadingLibraries} />
      <Container bg="bg-[#E4E5F1]" className="flex flex-col">
        <Header />
        <main className="w-[340px] m-auto h-full flex-1 pt-6 pb-20">
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => (
              <InfiniteLoader
                isItemLoaded={(index) =>
                  libraries
                    ? index < libraries.length && !loadingLibraries
                    : false
                }
                itemCount={librariesCount != undefined ? librariesCount + 1 : 1}
                loadMoreItems={loadMoreLibraries}
              >
                {({ onItemsRendered, ref }) => (
                  <FixedSizeGrid
                    className="scrollbar-hide"
                    columnCount={librariesCount == 0 ? 1 : 2}
                    rowCount={
                      librariesCount != undefined
                        ? Math.round((librariesCount + 1) / 2)
                        : 1
                    }
                    rowHeight={165}
                    columnWidth={165}
                    height={height}
                    ref={ref}
                    width={width}
                    /**@ts-ignore */
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
        <TabBar />
      </Container>
    </RoutingGuard>
  );
};

export default Saved;
