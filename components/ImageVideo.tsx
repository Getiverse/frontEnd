import Image from "next/image";
import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import { zoomImageState } from "../utils/atoms/zoomImage";
import { handleImageType } from "../utils/functions";

function ImageVideo({
  src,
  muted = true,
  onClick,
  removeCover = false,
  opacityEffect = false,
}: {
  src: string | undefined;
  muted?: boolean;
  removeCover?: boolean;
  onClick?: () => void;
  opacityEffect?: boolean;
}) {
  if (!src) return <></>;
  const isVideo = src.includes("player");
  const refVideo = useRef<HTMLVideoElement>(null);
  const [zoomImage, setZoomImage] = useRecoilState(zoomImageState);

  return isVideo ? (
    <>
      <video
        ref={refVideo}
        className={`${
          removeCover ? "" : "object-cover"
        } bg-center h-full w-full absolute top-0 left-0 rounded-xl`}
        autoPlay
        loop
        muted={muted}
        src={src}
        onClick={() => onClick && onClick()}
      />
    </>
  ) : (
    <Image
      src={handleImageType(src)}
      fill
      className={`${removeCover ? "" : "object-cover"} bg-center  ${
        opacityEffect
          ? ""
          : "rounded-xl"
      }`}
      alt={"background image"}
      onClick={() => {
        onClick && onClick();
        setZoomImage(handleImageType(src));
      }}
    />
  );
}

export default ImageVideo;
