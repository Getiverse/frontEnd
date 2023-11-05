import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { FiAlertOctagon } from "react-icons/fi";
import { toast } from "react-toastify";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { ADD_REPORT } from "../../graphql/mutation/me";
import { PostType } from "../../graphql/types/enums";
import { moreModal } from "../../utils/atoms/moreModal";
import Button from "../buttons/Button";
import Modal from "../Modal";
import Text from "../Text";
import { ModalType } from "../types/Modal";

const REPORTS = [
  "Sexual content",
  "Violent content",
  "Offensive content",
  "Spam or deceptive content",
  "Defamatory content",
  "Copyright infringement",
  "Bullying or harassment",
  "Dangerous content",
  "Fraudulent activity",
  "Privacy violation",
  "Incitement to hate",
  "Violation of platform guidelines",
];

function ReportModal() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const modalRef = useRef(null);
  const [addReport, { data: reportStatus, loading }] =
    useMutation<ADD_REPORT>(ADD_REPORT);
  const [selected, setSelected] = useState("");

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, type: ModalType.MORE, open: false }));
  };

  return (
    <Modal
      className="pb-12"
      open={openModal.open && openModal.type == ModalType.REPORT}
      Footer={
        <div className="w-full flex px-20 items-center justify-between">
          <Button
            onClick={() => closeModal()}
            type="thirdary"
            className="py-2 px-2 text-gray-500 font-medium hover:bg-blue-50 dark:hover:bg-opacity-20 focus:outline-none focus:ring-0 transition active:bg-blue-100 duration-150 ease-in"
            text="Cancel"
          />

          <Button
            text="Segnala"
            onClick={() =>
              !loading &&
              addReport({
                variables: {
                  type: {
                    type: selected,
                    postType: openModal.postType,
                    postId: openModal.postId,
                  },
                },
                update: async (cache, { data, errors }) => {
                  if (errors) {
                    toast.error(errors.toLocaleString());
                  }
                  if (data) toast.success("Report sent with success");
                  else {
                    toast.error(
                      "Something went wrong with your report please retry"
                    );
                  }
                  setOpenModal((prev) => ({ ...prev, open: false }));
                },
              })
            }
            type="thirdary"
            className="py-2 px-2"
            color="text-blue-500"
          />
        </div>
      }
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="flex items-center space-x-2 pb-4">
        <FiAlertOctagon size="40" className="text-red-500" />
        <Text color="text-red-500" size="text-2xl">
          Report
        </Text>
      </div>
      <form className="flex flex-col justify-center h-44 pt-12 overflow-y-scroll space-y-2">
        {REPORTS.map((value, idx) => (
          <div key={idx} className="flex items-center">
            <input
              type="radio"
              className="w-5 h-5"
              id={idx.toString()}
              name={"report"}
              value={value}
              onChange={(e) => setSelected(e.currentTarget.value)}
              checked={selected == value}
            />
            <label
              className="pl-2 text-gray-500 text-xl"
              htmlFor={idx.toString()}
            >
              {value}
            </label>
          </div>
        ))}
      </form>
    </Modal>
  );
}

export default ReportModal;
