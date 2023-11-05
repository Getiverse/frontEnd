import { useRef } from "react";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import Text from "../Text";
import { ModalType } from "../types/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import Modal from "../Modal";

function PostCreationInformation({ text }: { text: string }) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const router = useRouter();
  const modalRef = useRef(null);
  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <Modal
      title="Info"
      open={openModal.open && openModal.type == ModalType.DESCRIPTION}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="mt-8 space-y-5">
        <Text>{text}</Text>
      </div>
    </Modal>
  );
}

export default PostCreationInformation;
