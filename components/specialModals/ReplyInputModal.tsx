import { useEffect, useRef, useState } from "react";
import { FiAlertOctagon } from "react-icons/fi";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import Avatar from "../Avatar";
import Button from "../buttons/Button";
import Modal from "../Modal";
import Text from "../Text";
import { ModalType } from "../types/Modal";
import CustomInput from "../input/CustomInput";
import { AiOutlineSend } from "react-icons/ai";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_REPLY, EDIT_RATING, EDIT_REPLY } from "../../graphql/mutation/me";
import { useRouter } from "next/router";
import { FIND_USER_BY_ID } from "../../graphql/query/author";
import {
  FIND_REPLIES_BY_RATING_ID,
  FIND_REPLIES_IDS_BY_RATING_ID,
  FIND_REPLY_BY_ID,
} from "../../graphql/query/reply";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../../graphql/query/me";
import { REPLIES_PAGEABLE_SIZE } from "../../utils/constants";
import useUid from "../../hooks/useUid";
import { FIND_RATINGS_BY_POST_ID } from "../../graphql/query/rating";
import { toast } from "react-toastify";

function ReplyInputModal() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const modalRef = useRef(null);
  const router = useRouter();
  const [reply, setReply] = useState("");

  const { data: myReply } = useQuery<FIND_REPLY_BY_ID>(FIND_REPLY_BY_ID, {
    skip: !openModal.update,
    variables: {
      type: openModal.ratingId,
      skip: !openModal.update,
    },
  });

  const {
    data: me,
    loading,
    refetch: refetchMe,
  } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(GET_MY_PROFILE_PRIMARY_STATS);

  const { data: user } = useQuery<FIND_USER_BY_ID>(FIND_USER_BY_ID, {
    variables: {
      type: openModal.authorId,
    },
  });
  const uid = useUid();

  const [addReply, { data: replied, loading: loadingReply }] =
    useMutation<ADD_REPLY>(ADD_REPLY, {
      update: async (cache, { data, errors }) => {
        const cachedReplies = await cache.readQuery<FIND_REPLIES_BY_RATING_ID>({
          query: FIND_REPLIES_BY_RATING_ID,
          variables: {
            type: router.query.ratingId,
            page: {
              page: 0,
              size: REPLIES_PAGEABLE_SIZE,
            },
          },
        });
        if (cachedReplies?.findRepliesByRatingId.data && data) {
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
                count: cachedReplies?.findRepliesByRatingId.count + 1,
                data: [
                  {
                    id: replied?.addReply.id,
                    userId: uid,
                    createdAt: replied?.addReply.createdAt,
                    notUsefulRating: [],
                    usefulRating: [],
                    repliedUser: user?.findUserById.id,
                    ratingId: router.query.ratingId,
                    comment: reply,
                  },
                  ...cachedReplies?.findRepliesByRatingId.data,
                ],
              },
            },
          });
          const cachedRatings =
            await cache.readQuery<FIND_REPLIES_IDS_BY_RATING_ID>({
              query: FIND_REPLIES_IDS_BY_RATING_ID,
              variables: {
                type: router.query.ratingId,
                page: {
                  page: 0,
                  size: 1,
                },
              },
            });
          if (cachedRatings?.findRepliesByRatingId.count && data) {
            await cache.writeQuery({
              query: FIND_REPLIES_IDS_BY_RATING_ID,
              variables: {
                type: router.query.ratingId,
                page: {
                  page: 0,
                  size: 1,
                },
              },
              data: {
                findRepliesByRatingId: {
                  count: cachedRatings?.findRepliesByRatingId.count + 1,
                },
              },
            });
          }
          setReply("");
          // router.replace(router.asPath.replace("isEditable=true", ""));
        }
      },
    });

  const [editReply, { data: editedReply, loading: loadingEdit }] =
    useMutation<EDIT_REPLY>(EDIT_REPLY, {
      update: async (cache, { data, errors }) => {
        if (errors) {
          toast.error(errors.toString());
          return;
        }
        const cachedReplies = await cache.readQuery<FIND_REPLIES_BY_RATING_ID>({
          query: FIND_REPLIES_BY_RATING_ID,
          variables: {
            type: router.query.ratingId,
            page: {
              page: 0,
              size: REPLIES_PAGEABLE_SIZE,
            },
          },
        });
        if (cachedReplies?.findRepliesByRatingId.data && data) {
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
                count: cachedReplies?.findRepliesByRatingId.count,
                data: [
                  {
                    id: editedReply?.editReply.id,
                    userId: uid,
                    createdAt: replied?.addReply.createdAt,
                    notUsefulRating: cachedReplies.findRepliesByRatingId.data,
                    usefulRating: [],
                    repliedUser: user?.findUserById.id,
                    ratingId: router.query.ratingId,
                    comment: reply,
                  },
                  ...cachedReplies?.findRepliesByRatingId.data.map((reply) =>
                    reply.id == editedReply?.editReply.id
                      ? {
                          id: reply.id,
                          userId: reply.userId,
                          createdAt: reply.createdAt,
                          notUsefulRating: reply.notUsefulRating,
                          usefulRating: reply.usefulRating,
                          repliedUser: reply.repliedUser,
                          ratingId: router.query.ratingId,
                          comment: reply,
                        }
                      : reply
                  ),
                ],
              },
            },
          });
          setReply("");
          toast.success("reply updated");
        }
      },
    });

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, type: ModalType.MORE, open: false }));
  };

  useEffect(() => {
    if (myReply?.findReplyById && myReply?.findReplyById.id) {
      setReply(myReply.findReplyById.comment);
    }
  }, [myReply]);

  useEffect(() => {
    if (editedReply?.editReply && editedReply?.editReply.id) {
      closeModal();
    }
  }, [editedReply]);

  useEffect(() => {
    if (replied?.addReply.id) {
      closeModal();
    }
  }, [replied]);

  return (
    <Modal
      open={openModal.open && openModal.type == ModalType.REPLY_INPUT}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="w-full border-b border-gray-300 dark:border-gray-700 pb-3">
        <div className="flex items-center space-x-3 ">
          <div>
            <Avatar src={me?.me.profileImage} height="h-10" width="w-10" />
          </div>
          <CustomInput
            maxLength={3000}
            className="break-words"
            padding="py-3 pl-3 pr-10"
            onChange={(e) => setReply(e.currentTarget.value)}
            value={reply}
            onIconClick={() => {
              if (loading || loadingReply || loadingReply) return;
              if (openModal.update) {
                editReply({
                  variables: {
                    type: {
                      comment: reply,
                      replyId: openModal.ratingId,
                    },
                  },
                });
              } else {
                addReply({
                  variables: {
                    type: {
                      repliedUser: user?.findUserById.id,
                      ratingId: router.query.ratingId,
                      comment: reply,
                    },
                  },
                });
              }
            }}
            placeHolder={`Reply to ${user?.findUserById.userName}...`}
            Icon={<AiOutlineSend className="text-blue-500" size={18} />}
          />
        </div>
      </div>
      {/* <div className="flex items-center space-x-4 mt-4 px-4 overflow-x-scroll overflow-y-hidden">
          <span className="inline text-4xl">&#128514;</span>
          <span className="inline text-4xl">&#128525;</span>
          <span className="inline text-4xl"> &#128526;</span>
          <span className="inline text-4xl"> &#128512;</span>
          <span className="inline text-4xl"> &#128561;</span>
        </div> */}
    </Modal>
  );
}

export default ReplyInputModal;
