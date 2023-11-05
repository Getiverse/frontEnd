import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../utils/atoms/moreModal";
import { ModalType } from "./types/Modal";
import Text from "./Text";
import CustomInput from "./input/CustomInput";
import Button from "./buttons/Button";
import { IconType } from "react-icons";

function AddLinkModals({
  addLinkState,
  links,
  setLinks,
}: {
  setLinks: Dispatch<
    SetStateAction<
      {
        firstValue: string;
        secondValue: string;
        name: string;
        Icon: IconType;
      }[]
    >
  >;
  links: {
    firstValue: string;
    secondValue: string;
    name: string;
    Icon: IconType;
  }[];
  addLinkState: {
    name: string;
    labelOne: string;
    placeHolderOne: string;
    labelTwo: string;
    placeHolderTwo: string;
    multiple: boolean;
    Icon: IconType | null;
  };
}) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const modalRef = useRef(null);
  const [firstValue, setFirstValue] = useState("");
  const [secondValue, setSecondValue] = useState("");

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };
  useClickAway(
    modalRef,
    () => {
      if (openModal.open && openModal.type == ModalType.ADD_LINKS) {
        closeModal();
      }
    },
    ["mousedown", "touchstart"]
  );

  return openModal.open && openModal.type == ModalType.ADD_LINKS ? (
    <div className="h-screen w-screen fixed z-40">
      {/*modalContent*/}
      <div className="absolute w-full h-full bg-gradient-to-t from-black to-black opacity-30 z-10" />
      <div
        ref={modalRef}
        className={`shadow-2xl z-50 ${
          addLinkState.multiple ? "h-2/5" : "h-1/3"
        } absolute w-full bottom-0 bg-gray-50 dark:bg-slate-900 rounded-t-2xl transition duration-700 ease-in-out`}
      >
        <div className="px-6 pt-5 border-gray-300 dark:border-gray-500 flex items-center space-x-3">
          {addLinkState.Icon && (
            <addLinkState.Icon className="text-blue-500" size={30} />
          )}
          <Text color="text-gray-500" size="text-2xl">
            {addLinkState.name}
          </Text>
        </div>
        <div className="flex flex-col h-[calc(100%-57px)]">
          <div className="pt-4 pb-8 px-6 space-y-5 flex-1 overflow-y-scroll scrollbar-hide">
            <CustomInput
              value={firstValue}
              onChange={(e) => setFirstValue(e.currentTarget.value)}
              label={addLinkState.labelOne}
              color=""
              rounded={false}
              transparent
              placeHolder={addLinkState.placeHolderOne}
              className="border-b border-gray-300"
            />
            {addLinkState.multiple && (
              <CustomInput
                value={secondValue}
                onChange={(e) => setSecondValue(e.currentTarget.value)}
                label={addLinkState.labelTwo}
                color=""
                rounded={false}
                transparent
                placeHolder={addLinkState.placeHolderTwo}
                className="border-b border-gray-300"
              />
            )}
          </div>
          <div className="flex items-center py-2 px-8 justify-end border-t-2 border-gray-300 dark:border-gray-500">
            <Button
              onClick={() => closeModal()}
              type="thirdary"
              text="Cancel"
              className="text-gray-500"
            />
            <Button
              onClick={() => {
                if (addLinkState.Icon != null)
                  handleAdd(
                    setLinks,
                    links,
                    addLinkState.name,
                    firstValue,
                    secondValue,
                    addLinkState.Icon
                  );
                setFirstValue("");
                setSecondValue("");
                closeModal();
              }}
              type="thirdary"
              text="Add"
              className="ml-8"
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

function handleAdd(
  setLinks: (val: any) => void,
  links: {
    firstValue: string;
    secondValue: string;
    name: string;
    Icon: IconType;
  }[],
  name: string,
  firstValue: string,
  secondValue: string,
  Icon: IconType
) {
  let isAlreadyIn = -1;
  for (let i = 0; i < links.length; i++) {
    if (links[i].name === name) {
      isAlreadyIn = i;
    }
  }
  let result = links;
  if (isAlreadyIn > 0) {
    result = links.filter((val, idx) => idx !== isAlreadyIn);
  } else {
    result.push({
      firstValue: firstValue,
      secondValue: secondValue,
      name: name,
      Icon: Icon,
    });
  }
  setLinks(result);
}
export default AddLinkModals;
