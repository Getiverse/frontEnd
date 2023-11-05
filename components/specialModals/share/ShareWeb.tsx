import React, { Fragment, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import {
  EmailShareButton,
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
  FacebookShareButton,
  FacebookMessengerShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import CopyText from "./CopyText";
import { moreModal } from "../../../utils/atoms/moreModal";
import { ModalType } from "../../types/Modal";
import { Device } from "@capacitor/device";
import { useClickAway } from "react-use";

function ShareIcons({ url }: { url: string | undefined }) {
  if (!url) throw new Error("no url assigned");
  return (
    <div className="flex space-x-4">
      <EmailShareButton url={url}>
        <EmailIcon round={true} size={30} />
      </EmailShareButton>
      <FacebookShareButton url={url}>
        <FacebookIcon round={true} size={30} />
      </FacebookShareButton>
      <FacebookMessengerShareButton url={url} appId="">
        <FacebookMessengerIcon round={true} size={30} />
      </FacebookMessengerShareButton>
      <LinkedinShareButton url={url}>
        <LinkedinIcon round={true} size={30} />
      </LinkedinShareButton>
      <PinterestShareButton url={url} media="cippa">
        <PinterestIcon round={true} size={30} />
      </PinterestShareButton>
      <RedditShareButton url={url}>
        <RedditIcon round={true} size={30} />
      </RedditShareButton>
      <TelegramShareButton url={url}>
        <TelegramIcon round={true} size={30} />
      </TelegramShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon round={true} size={30} />
      </TwitterShareButton>
      <WhatsappShareButton url={url}>
        <WhatsappIcon round={true} size={30} />
      </WhatsappShareButton>
    </div>
  );
}

//function SharePostFeedback({ showAlert, setShowAlert }: { showAlert: boolean, setShowAlert: (open: boolean) => void }) {
//    return (
//        <Modal
//            open={showAlert}
//            callBack={(value) => setShowAlert(value)}
//            className={"absolute z-50 top-5 w-1/2"}
//        >
//            <Fragment>
//                <Toast open={showAlert} setOpen={setShowAlert} text="link copied to the clipboard" type="info" />
//            </Fragment>
//        </Modal>
//    );
//}

function ShareWeb() {
  const [showAlert, setShowAlert] = useState(false);
  const [isWeb, setIsWeb] = useState(false);
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  useEffect(() => {
    Device.getInfo().then((value) => value.platform == "web" && setIsWeb(true));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAlert(false);
    }, 2000);
    return () => clearInterval(interval);
  }, [showAlert]);
  const modalRef = useRef(null);

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  useClickAway(
    modalRef,
    () => {
      if (openModal.open && openModal.type == ModalType.SHARE_WEB) {
        closeModal();
      }
    },
    ["mousedown", "touchstart"]
  );

  const title = "how to create react app";
  return isWeb && openModal.open && openModal.type === ModalType.SHARE_WEB ? (
    <div
      className="modal fixed left-0 top-0 z-[1055] h-full w-full overflow-x-hidden outline-none"
      id="shareWeb"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div className="shadow absolute w-full h-full bg-gradient-to-t from-black to-black opacity-50 z-10" />
      <div
        className="top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 absolute modal-dialog modal-dialog-centered max-w-2xl pointer-events-none z-50"
        ref={modalRef}
      >
        <div className="px-5 modal-content border-none shadow-lg relative flex flex-col w-screen max-w-2xl pointer-events-auto bg-gray-50 dark:bg-slate-900 bg-clip-padding rounded-xl outline-none text-current">
          <div className="relative modal-header flex flex-shrink-0 items-center justify-between p-4 rounded-t-md">
            <h5
              className="text-xl text-center w-full font-semibold leading-normal text-gray-800 dark:text-white"
              id="exampleModalScrollableLabel"
            >
              Share Link
            </h5>
          </div>
          <CopyText
            showAlert={showAlert}
            text={openModal.url}
            className={`my-6 ${
              showAlert
                ? "border  border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            setShowAlert={setShowAlert}
          />
          <div
            className="pb-6 w-full overflow-x-scroll scrollbar-hidden"
            style={{ scrollbarWidth: "none" }}
          >
            <ShareIcons url={openModal.url} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ShareWeb;
