import { useRef } from "react";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import Text from "../Text";
import { ModalType } from "../types/Modal";
import {
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { useRouter } from "next/router";
import { MutationFunction } from "@apollo/client";
import { fixImageAndCategories } from "../../utils/functions";
import dayjs from "dayjs";
import Modal from "../Modal";

function PublishModal({
  setShowCalendar,
  mutatePost,
  post,
  isArticle = false,
}: {
  setShowCalendar: (val: boolean) => void;
  mutatePost: MutationFunction | (() => void);
  post: any;
  isArticle?: boolean;
}) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const router = useRouter();
  const editId = router.query.editId;
  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <Modal
      title={editId != undefined ? "Edit" : "Publish"}
      className="pb-12"
      open={openModal.open && openModal.type == ModalType.PUBLISH}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="mt-8 space-y-5">
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={async () => {
            closeModal();
            mutatePost({
              ...(await fixImageAndCategories(
                post,
                { start: dayjs(), end: dayjs() },
                isArticle,
                router.query.editId
              )),
            });
          }}
        >
          <div className="bg-gray-200 dark:bg-gray-950 p-2 rounded-full">
            <AiOutlineClockCircle className="text-gray-500" size="30" />
          </div>
          <Text className="text-gray-500">
            {editId != undefined ? "Edit" : "Publish"} Now
          </Text>
        </div>
        <button
          disabled={true}
          className="flex items-center opacity-60 space-x-4 cursor-pointer"
          onClick={() => {
            setShowCalendar(true);
            closeModal();
          }}
        >
          <div className="bg-gray-200 dark:bg-gray-950 p-2 rounded-full text-gray-500">
            <AiOutlineCalendar color="#6b7280" size="30" />
          </div>
          <Text className="text-gray-500">(Not Available Yet)</Text>
        </button>
      </div>
    </Modal>
  );
}

export default PublishModal;
