import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { CSSProperties, Fragment, useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { useRecoilState } from "recoil";
import {
  SET_NOT_USEFUL_RATING,
  SET_NOT_USEFUL_REPLY,
  SET_USEFUL_RATING,
  SET_USEFUL_REPLY,
} from "../graphql/mutation/me";
import { FIND_USER_BY_ID } from "../graphql/query/author";
import { FIND_RATINGS_BY_POST_ID } from "../graphql/query/rating";
import {
  FIND_REPLIES_BY_RATING_ID,
  FIND_REPLIES_IDS_BY_RATING_ID,
} from "../graphql/query/reply";
import { PostType } from "../graphql/types/enums";
import useUid from "../hooks/useUid";
import { moreModal } from "../utils/atoms/moreModal";
import {
  RATINGS_PAGEABLE_SIZE,
  REPLIES_PAGEABLE_SIZE,
} from "../utils/constants";
import Avatar from "./Avatar";
import Button from "./buttons/Button";
import Text from "./Text";
import { ModalType } from "./types/Modal";

type IRating = {
  className?: string;
  isActive?: boolean;
  id: string;
  userId: string;
  stars?: number;
  createdAt: string;
  comment: string;
  usefulRating: string[];
  notUsefulRating: string[];
  postId?: string;
  repliedUser?: string;
  postType?: PostType;
  isReply?: boolean;
  style?: CSSProperties;
};

function RatingComponent({
  userId,
  comment,
  createdAt,
  id,
  postId,
  repliedUser,
  postType,
  stars,
  usefulRating,
  notUsefulRating,
  isReply = false,
  className = "pt-4 px-2",
  isActive = false,
  style,
}: IRating) {
  const router = useRouter();
  const uid = useUid();
  const { data: user } = useQuery<FIND_USER_BY_ID>(FIND_USER_BY_ID, {
    variables: {
      skip: !userId,
      type: userId,
    },
  });
  const { data: repliedUserData } = useQuery<FIND_USER_BY_ID>(FIND_USER_BY_ID, {
    variables: {
      skip: !isReply,
      type: repliedUser,
    },
  });
  const [setUsefulRating, { data: usefulRatingState }] =
    useMutation<SET_USEFUL_RATING>(SET_USEFUL_RATING, {
      update: async (cache, { data, errors }) => {
        const cachedLibraries = await cache.readQuery<FIND_RATINGS_BY_POST_ID>({
          query: FIND_RATINGS_BY_POST_ID,
          variables: {
            postId: postId,
            postType: postType,
            page: {
              page: 0,
              size: RATINGS_PAGEABLE_SIZE,
            },
          },
        });
        if (cachedLibraries?.findRatingsByPostId.data && data) {
          const temp = cachedLibraries.findRatingsByPostId.data.find(
            (e) => e.id == id
          );
          if (temp?.usefulRating != undefined && uid) {
            const result = [...temp.usefulRating];
            if (result.includes(uid)) {
              result.splice(result.indexOf(uid), 1);
            } else {
              result.push(uid);
            }

            await cache.writeQuery({
              query: FIND_RATINGS_BY_POST_ID,
              variables: {
                postId: postId,
                postType: postType,
                page: {
                  page: 0,
                  size: RATINGS_PAGEABLE_SIZE,
                },
              },
              data: {
                findRatingsByPostId: {
                  count: cachedLibraries?.findRatingsByPostId.count,
                  data: [
                    ...cachedLibraries?.findRatingsByPostId.data.map((value) =>
                      value.id == id
                        ? {
                            ...value,
                            notUsefulRating: [
                              value.notUsefulRating.filter((val) => val != uid),
                            ],
                            usefulRating: [...result],
                          }
                        : value
                    ),
                  ],
                },
              },
            });
          }
        }
      },
    });
  const [setNotUsefulRating, { data: notUseful }] =
    useMutation<SET_NOT_USEFUL_RATING>(SET_NOT_USEFUL_RATING, {
      update: async (cache, { data, errors }) => {
        const cachedLibraries = await cache.readQuery<FIND_RATINGS_BY_POST_ID>({
          query: FIND_RATINGS_BY_POST_ID,
          variables: {
            postId: postId,
            postType: postType,
            page: {
              page: 0,
              size: RATINGS_PAGEABLE_SIZE,
            },
          },
        });
        if (cachedLibraries?.findRatingsByPostId.data && data) {
          const temp = cachedLibraries.findRatingsByPostId.data.find(
            (e) => e.id == id
          );
          if (uid && temp?.notUsefulRating != undefined) {
            const result = [...temp.notUsefulRating];
            if (result.includes(uid)) {
              result.splice(result.indexOf(uid), 1);
            } else {
              result.push(uid);
            }

            await cache.writeQuery({
              query: FIND_RATINGS_BY_POST_ID,
              variables: {
                postId: postId,
                postType: postType,
                page: {
                  page: 0,
                  size: RATINGS_PAGEABLE_SIZE,
                },
              },
              data: {
                findRatingsByPostId: {
                  count: cachedLibraries?.findRatingsByPostId.count,
                  data: [
                    ...cachedLibraries?.findRatingsByPostId.data.map((value) =>
                      value.id == id
                        ? {
                            ...value,
                            usefulRating: [
                              ...value.usefulRating.filter(
                                (value) => value != uid
                              ),
                            ],
                            notUsefulRating: [...result],
                          }
                        : value
                    ),
                  ],
                },
              },
            });
          }
        }
      },
    });

  const [setUsefulReply, { data: usefulReplyState }] =
    useMutation<SET_USEFUL_REPLY>(SET_USEFUL_REPLY, {
      update: async (cache, { data, errors }) => {
        const cachedLibraries =
          await cache.readQuery<FIND_REPLIES_BY_RATING_ID>({
            query: FIND_REPLIES_BY_RATING_ID,
            variables: {
              type: router.query.ratingId,
              page: {
                page: 0,
                size: REPLIES_PAGEABLE_SIZE,
              },
            },
          });
        if (cachedLibraries?.findRepliesByRatingId.data && data) {
          const temp = cachedLibraries.findRepliesByRatingId.data.find(
            (e) => e.id == id
          );
          if (temp?.usefulRating != undefined && uid) {
            const result = [...temp.usefulRating];
            if (result.includes(uid)) {
              result.splice(result.indexOf(uid), 1);
            } else {
              result.push(uid);
            }

            await cache.writeQuery({
              query: FIND_REPLIES_BY_RATING_ID,
              variables: {
                type: router.query.ratingId,
                page: {
                  page: 0,
                  size: REPLIES_PAGEABLE_SIZE,
                },
              },
              data: {
                findRepliesByRatingId: {
                  count: cachedLibraries?.findRepliesByRatingId.count,
                  data: [
                    ...cachedLibraries?.findRepliesByRatingId.data.map(
                      (value) =>
                        value.id == id
                          ? {
                              ...value,
                              notUsefulRating: [
                                ...value.notUsefulRating.filter(
                                  (val) => val != uid
                                ),
                              ],
                              usefulRating: [...result],
                            }
                          : value
                    ),
                  ],
                },
              },
            });
          }
        }
      },
    });

  const [setNotUsefulReply, { data: notUsefulReplyState }] =
    useMutation<SET_NOT_USEFUL_REPLY>(SET_NOT_USEFUL_REPLY, {
      update: async (cache, { data, errors }) => {
        const cachedLibraries =
          await cache.readQuery<FIND_REPLIES_BY_RATING_ID>({
            query: FIND_REPLIES_BY_RATING_ID,
            variables: {
              type: router.query.ratingId,
              page: {
                page: 0,
                size: REPLIES_PAGEABLE_SIZE,
              },
            },
          });
        if (cachedLibraries?.findRepliesByRatingId.data && data) {
          const temp = cachedLibraries.findRepliesByRatingId.data.find(
            (e) => e.id == id
          );
          if (temp?.notUsefulRating != undefined && uid) {
            const result = [...temp.notUsefulRating];
            if (result.includes(uid)) {
              result.splice(result.indexOf(uid), 1);
            } else {
              result.push(uid);
            }

            await cache.writeQuery({
              query: FIND_REPLIES_BY_RATING_ID,
              variables: {
                type: router.query.ratingId,
                page: {
                  page: 0,
                  size: REPLIES_PAGEABLE_SIZE,
                },
              },
              data: {
                findRepliesByRatingId: {
                  ...cachedLibraries.findRepliesByRatingId,
                  data: [
                    ...cachedLibraries?.findRepliesByRatingId.data.map(
                      (value) =>
                        value.id == id
                          ? {
                              ...value,
                              usefulRating: [
                                ...value.usefulRating.filter(
                                  (val) => val != uid
                                ),
                              ],
                              notUsefulRating: [...result],
                            }
                          : value
                    ),
                  ],
                },
              },
            });
          }
        }
      },
    });

  const [ratingModal, setRatingModal] = useRecoilState(moreModal);

  const { data: replies, loading: repliesLoading } =
    useQuery<FIND_REPLIES_IDS_BY_RATING_ID>(FIND_REPLIES_IDS_BY_RATING_ID, {
      variables: {
        skip: !id,
        type: id,
        page: {
          page: 0,
          size: 1,
        },
      },
    });

  function handleButtonPressedYes() {
    if (isReply) {
      setUsefulReply({
        variables: {
          type: id,
        },
      });
    } else {
      setUsefulRating({
        variables: {
          type: id,
        },
      });
    }
  }

  function handleButtonPressedNo() {
    if (isReply) {
      setNotUsefulReply({
        variables: {
          type: id,
        },
      });
    } else {
      setNotUsefulRating({
        variables: {
          type: id,
        },
      });
    }
  }

  return (
    <div
      style={style}
      className={`${className} border-b  border-gray-300 dark:border-gray-700 ${
        isReply ? "px-5" : "pb-5"
      }`}
    >
      <header className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar
            src={user?.findUserById.profileImage}
            width="w-9"
            height="h-9"
          />
          <div className="flex flex-col justify-center items-start">
            <p
              className={`text-gray-700 dark:text-white text-lg font-medium ${
                isReply ? "leading-none" : ""
              }`}
            >
              {user?.findUserById.userName.slice(0, 15) +
                (user != undefined && user?.findUserById.userName.length >= 15
                  ? "..."
                  : "")}
            </p>
            {isReply && (
              <Text size="text-xs" color="text-gray-500">
                {createdAt}
              </Text>
            )}
          </div>
        </div>
        <button
          className="hover:text-blue-500 text-gray-700"
          onClick={() =>
            setRatingModal((prev) => ({
              ...prev,
              open: true,
              type: isReply ? ModalType.REPLY : ModalType.RATING,
              ratingId: id,
              authorId: userId,
              isMyRating: userId == uid,
            }))
          }
        >
          <AiOutlineMore className="cursor-pointer" size={26} />
        </button>
      </header>
      {!isReply && (
        <div className="flex items-center space-x-3 mt-3 mb-2">
          <Stars totalStars={(stars ? stars : 0) + 1} />
          <Text size="text-sm" color="text-gray-500">
            {createdAt}
          </Text>
        </div>
      )}
      <Text size="text-md" className="text-gray-700 text-left mt-1">
        {isReply && (
          <span className="text-blue-500">
            {"@" + repliedUserData?.findUserById.userName}
          </span>
        )}
        {" " + comment}
      </Text>
      <span className="flex space-x-1 items-center text-sm font-thin text-gray-700 mt-3">
        <p className="font-semibold text-xs text-gray-600 dark:text-white">
          {usefulRating?.length}
        </p>
        <Text size="text-xs">people found this review helpful</Text>
      </span>
      {!isActive && (
        <div className="flex items-center text-xs font-thin text-gray-700 mt-3">
          <Text size="text-xs">Did you find this review helpful?</Text>
          <div className="flex ml-4 mt-1 space-x-2">
            <Button
              text="Yes"
              onClick={() => handleButtonPressedYes()}
              type={
                uid != undefined && usefulRating.includes(uid)
                  ? "primary"
                  : "secondary"
              }
              className="w-6 h-5"
              padding="px-4"
            />
            <Button
              text="No"
              onClick={() => handleButtonPressedNo()}
              type={
                uid != undefined && notUsefulRating.includes(uid)
                  ? "primary"
                  : "secondary"
              }
              className="w-6 h-5"
              padding="px-4"
            />
          </div>
        </div>
      )}
      {!isReply && !isActive && (
        <button
          className="text-left text-blue-500 text-base my-2"
          onClick={() => {
            setRatingModal((prev) => ({
              ...prev,
              open: false,
              type: isReply ? ModalType.REPLY : ModalType.RATING,
              ratingId: id,
              authorId: userId,
              isMyRating: userId == uid,
            }));
            router.push(router.query.postName + "/reply" + "?ratingId=" + id);
          }}
        >
          {replies?.findRepliesByRatingId.count} REPLIES
        </button>
      )}
    </div>
  );
}

export default RatingComponent;

function Stars({ totalStars }: { totalStars: number }) {
  return (
    <div className="flex space-x-1 items-center text-blue-500">
      {Array(5)
        .fill(0)
        .map((value, idx) => {
          if (totalStars - (idx + 1) > 0) {
            return <IoIosStar size={19} />;
          } else if (totalStars - (idx + 1) === -0.5) {
            return <IoIosStarHalf size={19} />;
          } else {
            return <IoIosStarOutline size={19} />;
          }
        })}
    </div>
  );
}
