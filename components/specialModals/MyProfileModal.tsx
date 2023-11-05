import Modal from "../Modal";
import Text from "../Text";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import { ModalType } from "../types/Modal";
import { useEffect } from "react";
import { FiEdit, FiSettings } from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";
import { useRouter } from "next/router";
import useUid from "../../hooks/useUid";

function MyProfileModal() {
  const uid = useUid();
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const router = useRouter();
  useEffect(() => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <Modal
      open={openModal.open && openModal.type == ModalType.MY_PROFILE}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
          type: ModalType.MY_PROFILE,
        }));
      }}
      className="pb-12"
    >
      <div className="space-y-8 pt-3">
        <button
          className="flex items-center px-4 space-x-4"
          onClick={() => {
            router.push("/settings");
          }}
        >
          <FiSettings size="30" className="text-gray-500" />
          <Text color="text-gray-500" size="text-lg" weight="text-medium">
            Settings
          </Text>
        </button>
        <button
          onClick={() => router.push("/me/edit")}
          className="flex items-center px-4 space-x-4"
        >
          <FiEdit size="27" className="text-gray-500" />
          <Text color="text-gray-500" size="text-lg" weight="text-medium">
            Edit Profile
          </Text>
        </button>
        {/* <button
          className="flex items-center px-4 space-x-4"
          onClick={() =>
            setOpenModal((prev) => ({
              ...prev,
              type: ModalType.SHARE,
              open: true,
              url: process.env.NEXT_PUBLIC_HOST + "/author/" + uid,
            }))
          }
        >
          <RiSendPlaneFill size="30" className="text-gray-500" />
          <Text color="text-gray-500" size="text-lg" weight="text-medium">
            Share
          </Text>
        </button> */}
      </div>
    </Modal>
  );
}

export default MyProfileModal;
