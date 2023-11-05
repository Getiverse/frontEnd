import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilState } from "recoil";
import Avatar from "../../../components/Avatar";
import Container from "../../../components/container/Container";
import RatingComponent from "../../../components/Rating";
import RoutingGuard from "../../../components/RoutingGuard";
import ReplyInputModal from "../../../components/specialModals/ReplyInputModal";
import ReplyModal from "../../../components/specialModals/ReplyModal";
import ReportModal from "../../../components/specialModals/ReportModal";
import Text from "../../../components/Text";
import { ModalType } from "../../../components/types/Modal";
import { FIND_RATING_BY_ID } from "../../../graphql/query/rating";
import { moreModal } from "../../../utils/atoms/moreModal";
import PullToRefresh from "react-simple-pull-to-refresh";
import { delay } from "../../../utils/functions";
import Spinner from "../../../components/skeletons/Spinner";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../../../graphql/query/me";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList as List } from "react-window";
import { CSSProperties, Fragment, useState } from "react";
import useReplyFetch from "../../../hooks/reply/useReplyFetch";
import AvatarSkeleton from "../../../components/skeletons/AvatarSkeleton";
import TextSkeleton from "../../../components/skeletons/TextSkeleton";
import { ReactWindowScroller } from "react-window-scroller";
import ConfirmModal from "../../../components/specialModals/ConfirmModal";

function Reply() {
  const router = useRouter();

  const {
    loadMoreReplies,
    replies,
    repliesLoading,
    repliesCount,
    refetchReplies,
  } = useReplyFetch();

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        loadMoreReplies();
        resolve("resolve");
      }, 200);
    });
  };

  const { data: rating, loading: ratingLoading } = useQuery<FIND_RATING_BY_ID>(
    FIND_RATING_BY_ID,
    {
      variables: {
        skip: !router.query.ratingId,
        type: router.query.ratingId,
      },
    }
  );

  async function handleRefresh() {
    await delay(500);
    refetchReplies({
      variables: {
        skip: !router.query.ratingId,
        type: router.query.ratingId,
      },
    });
  }

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    return replies != undefined &&
      replies[index] != null &&
      replies[index] != undefined ? (
      <RatingComponent
        isReply
        key={replies[index].id}
        {...replies[index]}
        style={style}
      />
    ) : (
      <div
        className="flex items-center w-full justify-between px-5"
        style={style}
      >
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
      <ReplyModal />
      <ReportModal />
      <ConfirmModal text="This action cannot be undone and the reply will be deleted for ever" />
      <ReplyInputModal />
      <Container bg="bg-white">
        <div className="bg-white dark:bg-slate-900 border-b border-gray-300 dark:border-gray-700 w-full max-w-lg py-4 px-5 flex items-center fixed z-40 shadow justify-between">
          <div className="space-x-4 flex items-center">
            <IoIosArrowBack
              size="28"
              className="text-blue-500"
              onClick={() => router.back()}
            />
            <Text weight="font-bold" size="text-xl">
              Replies
            </Text>
          </div>
          <AiOutlineClose
            onClick={() => router.push("/home")}
            size={24}
            className="text-gray-500"
          />
        </div>
        <div className="pt-[60px]">
          {rating && (
            <RatingComponent
              className="bg-slate-200 dark:bg-slate-700 pt-4 px-5"
              isActive={true}
              {...rating?.findRatingById}
            />
          )}
          <ReplyInput />
        </div>
        <InfiniteLoader
          isItemLoaded={(index) => (replies ? index < replies.length : false)}
          itemCount={repliesCount ? repliesCount : 0}
          /**@ts-ignore */
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <ReactWindowScroller>
              {({ ref: scrollerRef, outerRef, style, onScroll }) => (
                <PullToRefresh
                  className="text-blue-500"
                  refreshingContent={<Spinner />}
                  onRefresh={handleRefresh}
                >
                  <List
                    style={style}
                    onScroll={onScroll}
                    outerRef={outerRef}
                    className="List scrollbar-hide"
                    height={window.innerHeight}
                    itemCount={repliesCount ? repliesCount : 0}
                    itemSize={180}
                    onItemsRendered={onItemsRendered}
                    ref={scrollerRef}
                    width={"100%"}
                  >
                    {Row}
                  </List>
                </PullToRefresh>
              )}
            </ReactWindowScroller>
          )}
        </InfiniteLoader>
      </Container>
    </RoutingGuard>
  );
}

function ReplyInput() {
  const [modal, setModal] = useRecoilState(moreModal);
  const { data: me, loading } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(
    GET_MY_PROFILE_PRIMARY_STATS
  );

  return (
    <div className="w-full border-b border-gray-300 dark:border-gray-700 flex items-center px-5 space-x-4 py-3">
      <div className="w-12">
        <Avatar width="w-10" height="h-10" src={me?.me.profileImage} />
      </div>
      <button
        onClick={() =>
          setModal((prev) => ({
            ...prev,
            open: true,
            update: false,
            type: ModalType.REPLY_INPUT,
          }))
        }
        className="bg-slate-200 dark:bg-slate-400 text-left text-gray-700 outline-none w-full py-2 rounded-md pl-3"
      >
        Add a reply...
      </button>
    </div>
  );
}

export default Reply;
