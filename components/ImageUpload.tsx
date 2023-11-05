import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Text from "./Text";

function ImageUpload({
  onClick,
  image,
}: {
  onClick: (value: boolean) => void;
  image: string | Blob;
}) {
  return (
    <div
      onClick={() => onClick(true)}
      className={`${
        image
          ? ""
          : "bg-gray-100 dark:bg-slate-700 dark:border-gray-500 border-2 border-dotted border-gray-300"
      } w-full h-96 mt-12 rounded-xl relative `}
    >
      <div className="relative w-full h-full px-4 flex flex-col items-center justify-center">
        {image ? (
          <ImageVideo src={image} />
        ) : (
          <>
            <Text
              className="text-center"
              size="text-2xl"
              weight="font-semibold"
              color="text-gray-500"
            >
              Upload your cover image
            </Text>
            <AiOutlineCloudUpload size="120" className="text-gray-300" />
          </>
        )}
      </div>
    </div>
  );
}

function ImageVideo({ src }: { src: string | Blob }) {
  const [srcUrl, setSrlUrl] = useState("");
  useEffect(() => {
    async function convert() {
      if (src instanceof Blob) {
        const val = await src.text();
        setSrlUrl(val);
      } else {
        setSrlUrl(src);
      }
    }
    convert();
  }, [src]);

  if (!srcUrl) return <></>;
  return srcUrl.includes("player") ? (
    <video
      className={`object-cover rounded-2xl h-full w-full absolute top-0 left-0`}
      autoPlay
      loop
      src={srcUrl}
    />
  ) : (
    <Image
      fill
      loading="lazy"
      alt="selected image"
      className="w-full object-cover h-full rounded-xl"
      src={srcUrl}
    />
  );
}

export default ImageUpload;
