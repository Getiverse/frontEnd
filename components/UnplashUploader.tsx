import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useRecoilState } from "recoil";
/**@ts-ignore */
import UnsplashReact, { InsertIntoApplicationUploader } from "unsplash-react";
import { imageUploaded } from "../utils/atoms/imageUploaded";
import Button from "./buttons/Button";
import Text from "./Text";
import unplash from "/public/icons/unplash.svg";

function UnsplashUploader({ setOpen }: { setOpen: (value: boolean) => void }) {
  const [tempImage, setTempImage] = useState("");
  const [image, setImage] = useRecoilState(imageUploaded);
  const [loading, setLoading] = useState(true);
  const [close, setClose] = useState(false);

  useEffect(() => {
    function handleClose() {
      setOpen(false);
    }
    if (close) {
      const interval = setTimeout(() => {
        handleClose();
      }, 700);
      return () => clearInterval(interval);
    }
  }, [close]);

  return (
    <div className="h-full w-full max-w-4xl md:max-h-[600px] md:rounded-lg md:shadow-lg md:left-1/2 md:-translate-x-1/2 md:top-32 z-[3] bg-white dark:bg-gray-950 absolute left-0 bottom-0 flex flex-col">
      <div className="flex justify-between items-center w-full px-5 py-4 border-b border-gray-300 dark:border-gray-500 drop-shadow fixed bg-white dark:bg-gray-950 z-50">
        <div className="flex items-center space-x-2">
          <Image
            alt="upload image from unplash"
            src={unplash}
            className="text-gray-500 scale-75"
            width="32"
            height="32"
          />
          <Text size="text-lg">Unplash</Text>
        </div>
        <AiOutlineClose
          onClick={() => setOpen(false)}
          size="24"
          className="mt-2 text-gray-500 cursor-pointer"
        />
      </div>
      <div className="px-8 py-20 flex-1 overflow-y-scroll scrollbar-hide">
        {/*back-end java*/}
        <UnsplashReact
          applicationName="Getiverse"
          columns={2}
          accessKey={process.env.NEXT_PUBLIC_UNPLASH_KEY}
          onFinishedUploading={(image: any) => {
            setTempImage(image);
            setLoading(false);
          }}
          Uploader={InsertIntoApplicationUploader}
        />
        <Button
          disabled={loading}
          text="Select"
          type="primary"
          buttonType="submit"
          className="fixed bottom-8 w-52 left-1/2 -translate-x-1/2"
          onClick={() => {
            setImage(tempImage), setTempImage("");
            setClose(true);
          }}
        />
      </div>
    </div>
  );
}
export default UnsplashUploader;
