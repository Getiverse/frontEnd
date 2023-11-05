import Image from "next/image";
import { BiImage } from "react-icons/bi";
import Modal from "../Modal";
import Text from "../Text";
import giphy from "/public/giphy-logo-1.svg";
import unplash from "/public/icons/unplash.svg";
import { Device } from "@capacitor/device";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRecoilState } from "recoil";
import { imageUploaded } from "../../utils/atoms/imageUploaded";
import { HiOutlineDocument } from "react-icons/hi";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { toast } from "react-toastify";
const Gallery = dynamic(() => import("../mobile/Gallery"), { ssr: false });

function ImagePickerModal({
  open,
  setOpen,
  setOpenUplash,
  setOpenGiphy,
  setPexelsOpen,
  removeVideos = false,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOpenUplash: Dispatch<SetStateAction<boolean>>;
  setOpenGiphy?: Dispatch<SetStateAction<boolean>>;
  setPexelsOpen?: Dispatch<SetStateAction<boolean>>;
  removeVideos?: boolean;
}) {
  const [platform, setPlatform] = useState("");
  const [image, setImage] = useRecoilState(imageUploaded);

  useEffect(() => {
    Device.getInfo()
      .then((info) => {
        setPlatform(info.platform);
      })
      .catch((e) => alert(e));
  }, []);

  return (
    <Modal
      height={removeVideos ? "h-1/3" : "h-3/5"}
      open={open}
      title="Upload"
      callBack={(value) => setOpen(value)}
    >
      <div className="mt-5 mb-4 space-y-8">
        <button
          className="flex items-center space-x-4"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            setOpenUplash(true);
          }}
        >
          <div className="bg-gray-200 dark:bg-gray-950 p-2 rounded-full">
            <Image
              alt="upload image from unplash"
              src={unplash}
              className="text-gray-500 scale-75"
              width="30"
              height="30"
            />
          </div>
          <Text size="text-lg">Upload from Unsplash</Text>
        </button>
        {!removeVideos && (
          <>
            <button
              className="flex items-center space-x-4"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                if (setOpenGiphy) setOpenGiphy(true);
              }}
            >
              <div className="bg-gray-200 dark:bg-gray-950 p-2 rounded-full">
                <HiOutlineDocument size={30} className="text-gray-500 " />
              </div>
              <Text size="text-lg">Upload from GIPHY</Text>
            </button>
            <button
              className="flex items-center space-x-4"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                if (setPexelsOpen) setPexelsOpen(true);
              }}
            >
              <div className="bg-gray-200 dark:bg-gray-950 p-2 rounded-full">
                <AiOutlineVideoCamera size={30} className="text-gray-500 " />
              </div>
              <Text size="text-lg">Upload from Pexels</Text>
            </button>
          </>
        )}
        {platform == "android" || platform == "ios" ? (
          <Gallery setImage={setImage} />
        ) : (
          <form className="relative">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 dark:bg-gray-950 p-2 rounded-full text-gray-500">
                <input
                  onChange={(e) => {
                    if (
                      e.target.files &&
                      e.target.files[0].type.includes("video")
                    ) {
                      toast.error(
                        "upload video from memory current not available"
                      );
                    } else if (
                      e.target.files &&
                      e.target.files[0].type.includes("image")
                    ) {
                      setImage(URL.createObjectURL(e.target.files[0]));
                    } else {
                      toast.error("image type not available");
                    }
                    setOpen(false);
                  }}
                  type="file"
                  className="absolute w-full h-full opacity-0"
                />
                <BiImage color="#6b7280" size="30" />
              </div>
              <Text size="text-lg">Upload from Gallery</Text>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default ImagePickerModal;
