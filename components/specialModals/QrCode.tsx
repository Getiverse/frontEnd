import Image from "next/image";
import { useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import Text from "../Text";
import { ModalType } from "../types/Modal";
import logo from "/public/favicon.ico";

function QrCode({ url }: { url: string | undefined }) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const modalRef = useRef(null);

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  useClickAway(
    modalRef,
    () => {
      if (openModal.open && openModal.type == ModalType.QRCODE) {
        closeModal();
      }
    },
    ["mousedown", "touchstart"]
  );

  return openModal.open && openModal.type === ModalType.QRCODE ? (
    <div
      className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div className="shadow absolute w-full h-full bg-gradient-to-t from-black to-black opacity-50 z-10" />
      <div
        className="top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 absolute w-auto pointer-events-none z-50"
        ref={modalRef}
      >
        <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-gray-50 dark:bg-slate-900 bg-clip-padding rounded-xl outline-none text-current">
          <div className="relative modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md">
            <h5
              className="text-xl text-center w-full font-semibold leading-normal text-gray-800 dark:text-gray-100"
              id="exampleModalScrollableLabel"
            >
              QrCode
            </h5>
          </div>
          <Text className="px-8 text-center">
            Scan with your camera phone this QR code
          </Text>
          <div className="modal-body relative p-4 flex items-center justify-center">
            <div className="relative">
              <Image
                src={logo}
                alt="getiverse logo image"
                className="scale-125 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              <QRCode size={200} value={url} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default QrCode;
