import { useRef } from "react";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { AiOutlineClose } from "react-icons/ai";
import { moreModal } from "../../../utils/atoms/moreModal";
import { ModalType } from "../../types/Modal";
import Text from "../../Text";
import { fontStyle } from "../../../utils/atoms/fontStyle";
import Modal from "../../Modal";
import { AVAILABLE_FONTS } from "../../../utils/constants";
import Font from "../../Font";
import {
  Cedarville,
  Lato,
  Montserrat,
  OpenSans,
  Roboto,
} from "../../../utils/constants";
function FontSettings() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const modalRef = useRef(null);
  const [font, setFont] = useRecoilState<{
    fontFamily: string;
    fontSizeMoltiplier: number;
  }>(fontStyle);
  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  function getFontClassName(val: string) {
    switch (val.toLowerCase()) {
      case "cedarville":
        return Cedarville.className;
      case "lato":
        return Lato.className;
      case "montserrat":
        return Montserrat.className;
      case "roboto":
        return Roboto.className;
      case "opensans":
        return OpenSans.className;
    }
  }

  return (
    <Modal
      className="pb-12"
      open={openModal.open && openModal.type == ModalType.FONT_SETTINGS}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="space-y-6">
        <div>
          <label
            htmlFor="text-size"
            className="mb-2 inline-block text-blue-500 font-medium"
          >
            Text Size
          </label>
          <div className="flex items-center">
            <Text size="text-2xl">A</Text>
            <input
              type="range"
              className="transparent mx-6 h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
              min="0"
              max="0.15"
              step="0.05"
              value={font.fontSizeMoltiplier}
              onChange={(e) =>
                setFont((prev) => ({
                  ...prev,
                  fontSizeMoltiplier: parseFloat(e.currentTarget.value),
                }))
              }
              id="text-size"
            />
            <Text size="text-4xl">A</Text>
          </div>
          <div className="mt-4">
            <label
              htmlFor="font-family"
              className="mb-2 inline-block text-blue-500 font-medium"
            >
              Font Family
            </label>
            <div className="flex justify-center">
              <div className="flex mt-3 space-x-4 overflow-x-scroll overflow-y-hidden">
                {AVAILABLE_FONTS.map((val) => (
                  <Font
                    key={val}
                    name={val}
                    className={getFontClassName(val.toLowerCase())}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default FontSettings;
