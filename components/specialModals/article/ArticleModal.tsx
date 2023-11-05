import { Fragment, useRef } from "react";
import { HiOutlineCollection } from "react-icons/hi";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { IoNewspaperOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import { IoMdAlert } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import { RxFontFamily } from "react-icons/rx";
import { MdBlock } from "react-icons/md";
import { moreModal } from "../../../utils/atoms/moreModal";
import { ModalType } from "../../types/Modal";
import Text from "../../Text";
import { PostType } from "../../../graphql/types/enums";
import useUid from "../../../hooks/useUid";
import Modal from "../../Modal";

function ArticleModal({
  authorId,
  postId,
}: {
  authorId: string;
  postId: string;
}) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const router = useRouter();
  const uid = useUid();

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <Modal
      className="pb-12"
      open={openModal.open && openModal.type == ModalType.ARTICLE}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="mt-4 space-y-6">
        <button
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => {
            setOpenModal((prev) => ({
              ...prev,
              type: ModalType.FONT_SETTINGS,
            }));
          }}
        >
          <RxFontFamily className="text-gray-500" size="26" />
          <Text color="text-gray-500">Font Settings</Text>
        </button>
        {/* <button
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => {
            router.push("/create/article/step-1");
            closeModal();
          }}
        >
          <BsDownload size="26" className="text-gray-500" />
          <Text color="text-gray-500">Make Available Offline</Text>
        </button> */}
        {uid !== authorId && (
          <Fragment>
            <button
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => {
                setOpenModal((prev) => ({
                  ...prev,
                  type: ModalType.REPORT,
                  postType: PostType.ARTICLE,
                  authorId: authorId,
                  postId: postId,
                }));
              }}
            >
              <IoMdAlert size="26" className="text-gray-500" />
              <Text color="text-gray-500">Report</Text>
            </button>
            {/* <button
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => {
                router.push("/create/article/step-1");
                closeModal();
              }}
            >
              <MdBlock size="26" className="text-gray-500" />
              <Text color="text-gray-500">Block Author</Text>
            </button> */}
          </Fragment>
        )}
      </div>
    </Modal>
  );
}

export default ArticleModal;
