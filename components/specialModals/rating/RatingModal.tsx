import { IoMdAlert } from "react-icons/io";
import { useRecoilState } from "recoil";
import React, { useEffect } from "react";
import { moreModal } from "../../../utils/atoms/moreModal";
import { ModalType } from "../../types/Modal";
import Modal from "../../Modal";
import Text from "../../Text";
import { HiFlag } from "react-icons/hi";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { REMOVE_RATING } from "../../../graphql/mutation/me";
import { FIND_RATINGS_BY_POST_ID } from "../../../graphql/query/rating";
import { RATINGS_PAGEABLE_SIZE } from "../../../utils/constants";

function RatingModal() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const router = useRouter();
  const [removeRating, { data: removed }] = useMutation<REMOVE_RATING>(
    REMOVE_RATING,
    {
      update: async (cache, { data, errors }) => {
        const cachedLibraries = await cache.readQuery<FIND_RATINGS_BY_POST_ID>({
          query: FIND_RATINGS_BY_POST_ID,
          variables: {
            postId: router.query.postId,
            postType: router.query.type,
            page: {
              page: 0,
              size: RATINGS_PAGEABLE_SIZE,
            },
          },
        });
        if (cachedLibraries?.findRatingsByPostId.data && data) {
          await cache.writeQuery({
            query: FIND_RATINGS_BY_POST_ID,
            variables: {
              postId: router.query.postId,
              postType: router.query.type,
              page: {
                page: 0,
                size: RATINGS_PAGEABLE_SIZE,
              },
            },
            data: {
              findRatingsByPostId: {
                count: cachedLibraries?.findRatingsByPostId.count - 1,
                data: [
                  ...cachedLibraries?.findRatingsByPostId.data.filter(
                    (val) => val.id != openModal.ratingId
                  ),
                ],
              },
            },
          });
          setOpenModal((prev) => ({ ...prev, open: false }));
        }
      },
    }
  );

  return (
    <Modal
      open={openModal.open && openModal.type == ModalType.RATING}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
          hide: {
            offlineDownload: false,
            followAuthor: false,
          },
        }));
      }}
      className="pb-12"
    >
      <div className="space-y-6 mt-3">
        <button
          onClick={() =>
            router.push(
              router.query.postName +
                "/reply" +
                "?ratingId=" +
                openModal.ratingId
            )
          }
          className="flex items-center px-4 space-x-4"
        >
          <HiFlag size="26" className="text-gray-500" />
          <Text color="text-gray-500" size="text-lg" weight="text-medium">
            Reply
          </Text>
        </button>
        {!openModal.isMyRating && (
          <button
            className="flex items-center px-4 space-x-4"
            onClick={() => {
              setOpenModal((prev) => ({ ...prev, type: ModalType.REPORT }));
            }}
          >
            <IoMdAlert size="30" className="text-gray-500" />
            <Text color="text-gray-500" size="text-lg" weight="text-medium">
              Report
            </Text>
          </button>
        )}
        {openModal.isMyRating && (
          <React.Fragment>
            <button
              className="flex items-center px-4 space-x-4"
              onClick={() => {
                router.push(router.asPath + "&isEditable=true");
                setOpenModal((prev) => ({ ...prev, open: false }));
              }}
            >
              <BiEdit size="30" className="text-gray-500" />
              <Text color="text-gray-500" size="text-lg" weight="text-medium">
                Edit
              </Text>
            </button>
            <button
              className="flex items-center px-4 space-x-4"
              onClick={() => {
                removeRating({
                  variables: {
                    type: openModal.ratingId,
                  },
                });
              }}
            >
              <MdDelete
                size="30"
                className="text-red-500"
                onClick={() =>
                  setOpenModal((prev) => ({
                    ...prev,
                    open: true,
                    type: ModalType.CONFIRM,
                  }))
                }
              />
              <Text color="text-red-500" size="text-lg" weight="text-medium">
                Delete
              </Text>
            </button>
          </React.Fragment>
        )}
      </div>
    </Modal>
  );
}

export default RatingModal;
