import { useRef } from "react";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { AiOutlineClose, AiOutlineLink, AiOutlineQrcode } from "react-icons/ai";
import { moreModal } from "../../../utils/atoms/moreModal";
import { ModalType } from "../../types/Modal";
import Text from "../../Text";
import ShareLink from "../../../utils/classes/Share";
import Modal from "../../Modal";

function ShareModal() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const link = new ShareLink(
    "Share Link",
    "this is a test",
    "http://cippa-lippa.com",
    "Share Link"
  );
  const modalRef = useRef(null);

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  useClickAway(
    modalRef,
    () => {
      if (openModal.open && openModal.type == ModalType.SHARE) {
        closeModal();
      }
    },
    ["mousedown", "touchstart"]
  );

  return (
    <Modal
      title="Share"
      className="pb-12"
      open={openModal.open && openModal.type === ModalType.SHARE}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="mt-2 space-y-5">
        <button
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => {
            closeModal();
            setOpenModal((prev) => ({
              ...prev,
              open: true,
              type: ModalType.QRCODE,
            }));
          }}
        >
          <div className="bg-gray-200 dark:bg-gray-950 p-2 rounded-full">
            <AiOutlineQrcode className="text-gray-500" size="30" />
          </div>
          <Text className="text-gray-500">Share with QRCode</Text>
        </button>
        <button
          onClick={() => {
            closeModal();
            link.share(() =>
              setOpenModal((prev) => ({
                ...prev,
                open: true,
                type: ModalType.SHARE_WEB,
              }))
            );
          }}
          className="flex items-center space-x-4 cursor-pointer"
        >
          <div className="bg-gray-200 dark:bg-gray-950 p-2 rounded-full text-gray-500">
            <AiOutlineLink color="#6b7280" size="30" />
          </div>
          <Text className="text-gray-500">Share With Link</Text>
        </button>
      </div>
    </Modal>
  );
}

export default ShareModal;
