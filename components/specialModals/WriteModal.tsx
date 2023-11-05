import { useEffect, useRef } from "react";
import { FiAlertOctagon } from "react-icons/fi";
import { HiOutlineCollection } from "react-icons/hi";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import { GrArticle } from "react-icons/gr";
import Text from "../Text";
import { ModalType } from "../types/Modal";
import { IoNewspaperOutline } from "react-icons/io5";
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import Modal from "../Modal";

function WriteModal() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const router = useRouter();

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <Modal
      title="Create"
      className="pb-12"
      open={openModal.open && openModal.type == ModalType.WRITE}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="mt-2 space-y-5">
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => {
            router.push("/create/instant/step-1");
            closeModal();
          }}
        >
          <div className="bg-gray-200 dark:bg-gray-950 p-2 rounded-full">
            <HiOutlineCollection
              className="-rotate-90 text-gray-500 scale-90"
              size="30"
            />
          </div>
          <Text disableDark color="text-gray-500 dark:text-gray-300">
            Create Instant
          </Text>
        </div>
        <button
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => {
            router.push("/create/article/step-1");
            closeModal();
          }}
        >
          <div className="bg-gray-200 dark:bg-gray-950 p-2 rounded-full text-gray-500">
            <IoNewspaperOutline
              className="text-gray-500 dark:text-gray-500 scale-90"
              size="30"
            />
          </div>
          <Text disableDark color="text-gray-500 dark:text-gray-300">
            Write Article
          </Text>
        </button>
      </div>
    </Modal>
  );
}

export default WriteModal;
