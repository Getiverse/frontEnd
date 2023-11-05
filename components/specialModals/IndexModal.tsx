import { useRef } from "react";
import { useClickAway } from "react-use";
import { useRecoilState, useRecoilValue } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import Text from "../Text";
import { ModalType } from "../types/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
/**
 * @ts-ignore*/
import Scrollspy from "react-scrollspy";
import { getIndexIds, hashFnv32a } from "../../utils/functions";
import Link from "next/link";
import Modal from "../Modal";

function IndexModal({ content }: { content: any }) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <Modal
      title="Index"
      className="pb-12"
      open={openModal.open && openModal.type == ModalType.INDEX}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <Scrollspy
        className="scrollspy overflow-y-scroll h-full"
        items={getIndexIds(content)}
        currentClassName="isCurrent"
      >
        {content
          .filter((value: any) => value.type === "h1" || value.type === "h2")
          .map((value: any, idx: number) => {
            return value.type == "h1" ? (
              <li className="py-1 text-gray-600 dark:text-gray-300" key={idx}>
                <Link
                  replace={true}
                  href={`#${hashFnv32a(value?.children[0].text, true, 32)}`}
                >
                  {value.children[0].text}
                </Link>
              </li>
            ) : (
              <li
                className="py-1 ml-3 text-gray-600 dark:text-gray-300"
                key={idx}
              >
                <Link
                  replace={true}
                  href={`#${hashFnv32a(value?.children[0].text, true, 32)}`}
                >
                  {value.children[0].text}
                </Link>
              </li>
            );
          })}
      </Scrollspy>
    </Modal>
  );
}

export default IndexModal;
