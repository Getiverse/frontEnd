import { Dispatch, SetStateAction, useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { BsCheckLg } from "react-icons/bs";
import { CgEditFlipH, CgEditFlipV } from "react-icons/cg";
import { GrRotateRight } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import getCroppedImg from "../utils/cropImage/cropImage";
import Text from "./Text";

function ImageCropper({
  image,
  setCroppedImage,
  close,
  cropShape = "rect",
  aspect,
}: {
  image: string;
  close: () => void;
  cropShape: "rect" | "round";
  setCroppedImage: (val: string) => void;
  aspect: number;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) {
      return;
    }

    try {
      const croppedImageTemp = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation,
        flip
      );
      /**@ts-ignore */
      setCroppedImage(croppedImageTemp);
      close();
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, flip]);

  return (
    <div className="w-screen left-0 top-0 z-40 absolute h-screen bg-gray-900">
      <CropHeader close={close} showCroppedImage={showCroppedImage} />
      <Cropper
        zoomWithScroll
        image={image}
        cropShape={cropShape}
        transform={[
          `translate(${crop.x}px, ${crop.y}px)`,
          `rotateZ(${rotation}deg)`,
          `rotateY(${flip.horizontal ? 180 : 0}deg)`,
          `rotateX(${flip.vertical ? 180 : 0}deg)`,
          `scale(${zoom})`,
        ].join(" ")}
        crop={crop}
        rotation={rotation}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onRotationChange={setRotation}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
      <BottomFunctionalities setFlip={setFlip} setRotation={setRotation} />
    </div>
  );
}
export default ImageCropper;

function CropHeader({
  showCroppedImage,
  close,
}: {
  close: () => void;
  showCroppedImage: () => void;
}) {
  return (
    <div className="flex items-center justify-between w-full py-4 px-5 bg-slate-800 fixed top-0 z-50">
      <IoClose onClick={() => close()} size={30} className="text-white" />
      <Text color="text-white" size="text-2xl">
        Crop Image
      </Text>
      <BsCheckLg onClick={showCroppedImage} size={20} className="text-white" />
    </div>
  );
}

function BottomFunctionalities({
  setFlip,
  setRotation,
}: {
  setFlip: Dispatch<
    SetStateAction<{
      horizontal: boolean;
      vertical: boolean;
    }>
  >;
  setRotation: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="w-full flex items-center justify-center space-x-8 fixed bottom-8 z-50 text-white">
      <button className="p-4 bg-slate-800 rounded-full">
        <CgEditFlipH
          size={30}
          onClick={() =>
            setFlip((prev) => ({ ...prev, horizontal: !prev.horizontal }))
          }
        />
      </button>
      <button className="p-4 bg-slate-800 rounded-full">
        <CgEditFlipV
          size={30}
          onClick={() =>
            setFlip((prev) => ({ ...prev, vertical: !prev.vertical }))
          }
        />
      </button>
      <button
        className="p-4 bg-slate-800 rounded-full"
        onClick={() => setRotation((prev) => (prev + 90) % 360)}
      >
        <GrRotateRight size={30} />
      </button>
    </div>
  );
}
