import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRecoilState, useRecoilValue } from "recoil";

const UnsplashUploader = dynamic(
  () => import("../../../components/UnplashUploader"),
  { ssr: false }
);

import ImagePickerModal from "../../../components/specialModals/ImagePickerModal";
import PexelsVideoUploader from "../../PexelsVideoUploader";
import GiphyUloader from "../../GiphyUloader";
import { imageModal } from "../../../utils/atoms/image-modal";

const Editor = dynamic(
  () => import("../../plate-editor/components/plate/editor"),
  {
    ssr: false,
  }
);

const ArticleEditor = () => {
  const [openNavbar, setOpenNavbar] = useState(false);
  const [open, setOpen] = useRecoilState(imageModal);
  const [openUplash, setOpenUplash] = useState(false);
  const [openPexels, setOpenPexels] = useState(false);
  const [openGiphy, setOpenGiphy] = useState(false);

  return (
    <>
      {openUplash && <UnsplashUploader setOpen={setOpenUplash} />}
      {openPexels && <PexelsVideoUploader setOpen={setOpenPexels} />}
      {openGiphy && <GiphyUloader setOpen={setOpenGiphy} />}

      <ImagePickerModal
        open={open}
        setOpen={setOpen}
        setOpenGiphy={setOpenGiphy}
        setPexelsOpen={setOpenPexels}
        setOpenUplash={setOpenUplash}
      />
      <div
        onClick={() => !openNavbar && setOpenNavbar(true)}
        className={`w-full overflow-y-scroll ${
          openNavbar
            ? "h-full min-h-screen fixed z-[50] left-0 top-0 bg-gray-100 dark:bg-gray-900"
            : "h-[500px] relative bg-gray-100 dark:bg-gray-900 rounded-lg"
        }`}
      >
        {/*<HoverMenu />*/}
        <Editor writable={openNavbar} setOpenNavbar={setOpenNavbar} />
      </div>
    </>
  );
};

export default ArticleEditor;
