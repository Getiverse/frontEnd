import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import Text from "../Text";
import { ModalType } from "../types/Modal";
import { IconType } from "react-icons";
import { BsFacebook, BsLink45Deg } from "react-icons/bs";
import { AiFillLinkedin, AiOutlineInstagram } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
import Modal from "../Modal";

function ShowLinksAvailableModal({
  setAddLinkState,
}: {
  setAddLinkState: Dispatch<
    SetStateAction<{
      name: string;
      labelOne: string;
      placeHolderOne: string;
      labelTwo: string;
      placeHolderTwo: string;
      multiple: boolean;
      Icon: IconType | null;
    }>
  >;
}) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);

  return (
    <Modal
      open={openModal.open && openModal.type == ModalType.SHOW_LINKS_AVAILABLE}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="px-6 pt-5 border-gray-300 dark:border-gray-500">
        <Text color="text-gray-500" size="text-2xl">
          Add Social Links
        </Text>
      </div>
      <div className="grid gap-5 px-5 pt-5 grid-cols-2">
        <LinkSelector
          setAddLinkState={setAddLinkState}
          name="Instagram"
          labelOne="Instagram Link"
          placeHolderOne="Paste your Instagram URL Link"
          Icon={AiOutlineInstagram}
        />
        <LinkSelector
          setAddLinkState={setAddLinkState}
          name="Facebook"
          labelOne="Facebook Link"
          placeHolderOne="Paste your Instagram URL Link"
          Icon={BsFacebook}
        />
        <LinkSelector
          setAddLinkState={setAddLinkState}
          name="Linkedin"
          labelOne="Linkedin Link"
          placeHolderOne="Paste your Linkedin URL Link"
          Icon={AiFillLinkedin}
        />
        <LinkSelector
          setAddLinkState={setAddLinkState}
          name="Contact"
          labelOne="Contact Email"
          placeHolderOne="Enter your contact Email"
          Icon={HiOutlineMail}
        />
        <LinkSelector
          setAddLinkState={setAddLinkState}
          name="Custom Link"
          labelTwo="Link Text"
          placeHolderTwo="Enter The Link Text"
          labelOne="Link URL"
          placeHolderOne="Enter The Link URL"
          multiple
          Icon={BsLink45Deg}
        />
      </div>
    </Modal>
  );
}

export default ShowLinksAvailableModal;

function LinkSelector({
  Icon,
  className,
  multiple = false,
  name,
  labelTwo,
  labelOne,
  placeHolderTwo,
  placeHolderOne,
  setAddLinkState,
}: {
  Icon: IconType;
  multiple?: boolean;
  labelOne: string;
  className?: string;
  name: string;
  placeHolderOne: string;
  labelTwo?: string;
  placeHolderTwo?: string;
  setAddLinkState: Dispatch<
    SetStateAction<{
      name: string;
      labelOne: string;
      placeHolderOne: string;
      labelTwo: string;
      placeHolderTwo: string;
      multiple: boolean;
      Icon: IconType | null;
    }>
  >;
}) {
  const [selected, setSelected] = useState(false);
  const [openModal, setOpenModal] = useRecoilState(moreModal);

  return (
    <button
      onClick={() => {
        setSelected(true);
        setAddLinkState({
          Icon: Icon,
          labelOne: labelOne,
          placeHolderOne: placeHolderOne,
          multiple: multiple,
          labelTwo: labelTwo ? labelTwo : "",
          placeHolderTwo: placeHolderTwo ? placeHolderTwo : "",
          name: name,
        });
        setOpenModal((prev) => ({
          ...prev,
          open: true,
          type: ModalType.ADD_LINKS,
        }));
      }}
      className={`flex items-center space-x-2 py-1 pl-1 pr-2 rounded-full duration-300
    ${
      selected
        ? "bg-blue-500 text-gray-100"
        : "bg-gray-100 text-gray-500 dark:bg-slate-900 dark:text-gray-300"
    }  ${className}`}
    >
      <div
        className={`${
          selected ? "bg-blue-800" : "bg-gray-200 dark:bg-gray-950"
        } rounded-full p-1 flex items-center justify-center`}
      >
        <Icon size={24} className={selected ? "text-white" : "text-blue-500"} />
      </div>
      <Text
        disableDark
        size="text-lg"
        weight="font-base"
        color={selected ? "text-gray-200" : "text-gray-500"}
        className="whitespace-nowrap"
      >
        {name}
      </Text>
    </button>
  );
}
