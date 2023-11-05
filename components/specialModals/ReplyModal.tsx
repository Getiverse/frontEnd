import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import Modal from "../Modal";
import { ModalType } from "../types/Modal";
import Text from "../Text";
import { FiAlertOctagon } from "react-icons/fi";
import { HiFlag } from "react-icons/hi";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Fragment, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { REMOVE_REPLY } from "../../graphql/mutation/me";
import { useRouter } from "next/router";
import useUid from "../../hooks/useUid";
import { DeleteType, deleteType } from "../../utils/atoms/deleteType";

function ReplyModal() {
  const [modal, setModal] = useRecoilState(moreModal);
  const uid = useUid();
  const isMe = uid === modal.authorId;
  const router = useRouter();
  const [deleteTypeState, setDeleteTypeState] = useRecoilState(deleteType);

  return (
    <Modal
      callBack={(val) => setModal((prev) => ({ ...prev, open: val }))}
      open={modal.open && modal.type === ModalType.REPLY}
    >
      <div className="flex flex-col cursor-pointer space-y-6">
        {isMe && (
          <button
            className="flex items-center space-x-2"
            onClick={() =>
              setModal((prev) => ({
                ...prev,
                open: true,
                type: ModalType.REPLY_INPUT,
                update: true,
              }))
            }
          >
            <BiEdit size="30" className="text-gray-500" />
            <Text disableDark color="text-gray-500" size="text-lg">
              Edit
            </Text>
          </button>
        )}

        {!isMe && (
          <Fragment>
            <button
              className="flex items-center space-x-2"
              onClick={() =>
                setModal((prev) => ({
                  ...prev,
                  open: true,
                  type: ModalType.REPLY_INPUT,
                  update: false,
                }))
              }
            >
              <HiFlag size="30" className="text-gray-500" />
              <Text disableDark color="text-gray-500" size="text-lg">
                Reply
              </Text>
            </button>

            <button
              onClick={() =>
                setModal((prev) => ({
                  ...prev,
                  open: true,
                  type: ModalType.REPORT,
                }))
              }
              className="flex items-center space-x-2"
            >
              <FiAlertOctagon size="30" className="text-red-500" />
              <Text disableDark color="text-red-500" size="text-lg">
                Report
              </Text>
            </button>
          </Fragment>
        )}
        {isMe && (
          <button
            className="flex items-center space-x-2"
            onClick={() => {
              setDeleteTypeState(DeleteType.REPLY);
              setModal((prev) => ({
                ...prev,
                open: true,
                type: ModalType.CONFIRM,
              }));
            }}
          >
            <MdDelete size="30" className="text-red-500" />
            <Text disableDark color="text-red-500" size="text-lg">
              Delete
            </Text>
          </button>
        )}
      </div>
    </Modal>
  );
}
export default ReplyModal;
