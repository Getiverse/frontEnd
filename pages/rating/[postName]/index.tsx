import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { CSSProperties, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilValue } from "recoil";
import AddRating from "../../../components/AddRating";
import Avatar from "../../../components/Avatar";
import Container from "../../../components/container/Container";
import FilterHeader from "../../../components/FilterHeader";
import RatingComponent from "../../../components/Rating";
import RoutingGuard from "../../../components/RoutingGuard";
import Text from "../../../components/Text";
import { FIND_USER_BY_ID } from "../../../graphql/query/author";
import { selectedFilter } from "../../../utils/atoms/selectedFilter";
import { RATING_FILTERS } from "../../../utils/constants";
import PullToRefresh from "react-simple-pull-to-refresh";
import RatingModal from "../../../components/specialModals/rating/RatingModal";
import { delay } from "../../../utils/functions";
import useUid from "../../../hooks/useUid";
import Spinner from "../../../components/skeletons/Spinner";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList as List } from "react-window";
import useRatingsFetch from "../../../hooks/rating/useRatingsFetch";
import { ReactWindowScroller } from "react-window-scroller";
import AvatarSkeleton from "../../../components/skeletons/AvatarSkeleton";
import TextSkeleton from "../../../components/skeletons/TextSkeleton";
import ReportModal from "../../../components/specialModals/ReportModal";

function Rating() {
  const filter = useRecoilValue(selectedFilter);
  const router = useRouter();
  // const [filterBy, setFilterBy] = useState<string>("Most Relevant");
  const userId = router.query.userId;
  const postId = router.query.postId;
  const postType = router.query.type;
  const isOutside = router.query.isOutside === "true";
  const isEditable = router.query.isEditable === "true";
  const uid = useUid();

  const { data: user, loading: userLoading } = useQuery<FIND_USER_BY_ID>(
    FIND_USER_BY_ID,
    {
      variables: {
        skip: !userId,
        type: userId,
      },
    }
  );

  const {
    loadMoreRatings,
    ratings,
    loadingRatings,
    ratingsCount,
    refetchRatings,
  } = useRatingsFetch();

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        loadMoreRatings();
        resolve("resolve");
      }, 200);
    });
  };

  async function handleRefresh() {
    await delay(500);
    refetchRatings({
      variables: {
        skip: !postId || !postType,
        postId: postId,
        postType: postType,
      },
    });
  }

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    return !isEditable &&
      ratings &&
      ratings[index] != null &&
      ratings[index] != undefined ? (
      <RatingComponent
        key={ratings[index].id}
        {...ratings[index]}
        style={style}
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
      <RatingModal />
      <ReportModal />
      {!loadingRatings && (
        <Container bg="bg-white" className="flex flex-col">
          <div className="bg-white dark:bg-slate-900 shadow border-b  border-gray-300 dark:border-gray-700 w-full max-w-lg py-3 px-5 flex items-center fixed z-50">
            <IoIosArrowBack
              size="28"
              className="text-gray-500"
              onClick={() => router.back()}
            />
            {!loadingRatings ? (
              <div className="flex-1 pl-6 flex items-center space-x-4">
                <Avatar src={user?.findUserById.profileImage} />
                <div>
                  <Text
                    weight="font-medium"
                    size="text-lg"
                    className="leading-none"
                  >
                    {user?.findUserById.userName}
                  </Text>
                  <Text size="text-xs" className="leading-normal">
                    {ratingsCount} ratings
                  </Text>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div
            className={`py-1 border-b pt-[67px]  border-gray-300 dark:border-gray-700`}
          >
            <FilterHeader filters={RATING_FILTERS} />
          </div>
          {/* <div
          className={`flex w-full justify-between px-4 py-4 border-b  border-gray-300 dark:border-gray-700`}
        >
          <div className="flex items-center space-x-1 text-gray-600">
            {/^-?\d+$/.test(filter) && (
              <AiFillStar size="20" className="pr-1" />
            )}
            <Text color="text-gray-600" size="text-md" weight="font-medium">
              {filter ? filter : RATING_FILTERS[0]}
            </Text>
          </div>
          <DropDown
            className=""
            active={filterBy}
            setActive={setFilterBy}
            items={["Most Relevant", "Most Recent"]}
            Icon={HiMenuAlt2}
          />
        </div> */}
          <main className="px-5 flex-1">
            {(isEditable ||
              (ratingsCount == 0 && !isOutside) ||
              (ratings &&
                ratings.find((e) => e.userId == uid) == undefined &&
                !isOutside)) && (
              <AddRating
                ratingId={ratings?.filter((val) => val.userId === uid)[0]?.id}
              />
            )}
            {ratings != undefined && ratingsCount != undefined && (
              <InfiniteLoader
                isItemLoaded={(index) =>
                  ratings ? index < ratings.length && !loadingRatings : false
                }
                itemCount={isEditable ? ratingsCount - 1 : ratingsCount}
                /**@ts-ignore */
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => (
                  <ReactWindowScroller>
                    {({ ref: scrollerRef, outerRef, style, onScroll }) => (
                      <PullToRefresh
                        refreshingContent={<Spinner />}
                        onRefresh={handleRefresh}
                      >
                        <List
                          ref={scrollerRef}
                          style={style}
                          className="List scrollbar-hide "
                          height={window.innerHeight}
                          onScroll={onScroll}
                          outerRef={outerRef}
                          itemCount={
                            isEditable ? ratingsCount - 1 : ratingsCount
                          }
                          itemSize={230}
                          onItemsRendered={onItemsRendered}
                          width={"100%"}
                        >
                          {Row}
                        </List>
                      </PullToRefresh>
                    )}
                  </ReactWindowScroller>
                )}
              </InfiniteLoader>
            )}
          </main>
        </Container>
      )}
    </RoutingGuard>
  );
}

export default Rating;
