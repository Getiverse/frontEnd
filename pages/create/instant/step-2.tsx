import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../../../components/buttons/Button";
import Container from "../../../components/container/Container";
import ImageUpload from "../../../components/ImageUpload";
import CreateHeader from "../../../components/logged_in/layout/CreateHeader";
import Progressbar from "../../../components/Progressbar";
import Text from "../../../components/Text";
import dynamic from "next/dynamic";
import ImagePickerModal from "../../../components/specialModals/ImagePickerModal";
import { useRecoilState } from "recoil";
import { imageUploaded } from "../../../utils/atoms/imageUploaded";
import { createdInstant } from "../../../utils/atoms/createdInstant";
import PostCreationInformation from "../../../components/specialModals/PostCreationInformation";
import GiphyUloader from "../../../components/GiphyUloader";
import PexelsVideoUploader from "../../../components/PexelsVideoUploader";
import RoutingGuard from "../../../components/RoutingGuard";
import { toast } from "react-toastify";

const UnsplashUploader = dynamic(
  () => import("../../../components/UnplashUploader"),
  { ssr: false }
);

function Step2() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openUplash, setOpenUplash] = useState(false);
  const [instant, setInstant] = useRecoilState(createdInstant);
  const [image, setImage] = useRecoilState(imageUploaded);
  const [openGiphy, setOpenGiphy] = useState(false);
  const [openPexels, setPexelsOpen] = useState(false);
  const editId = router.query.editId;

  function validateStep2(image: string) {
    if (!image) {
      toast.error("please select an image");
      return false;
    }
    return true;
  }
  useEffect(() => {
    if (image) {
      setInstant((prev) => ({ ...prev, image: image }));
      setImage("");
    }
  }, [image]);

  return (
    <RoutingGuard>
      <PostCreationInformation text="The uploaded image will be the cover of your instant" />
      <Container
        bg="bg-white"
        className="flex flex-col items-center px-6 relative"
      >
        {openUplash && <UnsplashUploader setOpen={setOpenUplash} />}
        <ImagePickerModal
          open={open}
          setOpen={setOpen}
          setOpenUplash={setOpenUplash}
          setOpenGiphy={setOpenGiphy}
          setPexelsOpen={setPexelsOpen}
        />
        {openPexels && <PexelsVideoUploader setOpen={setPexelsOpen} />}
        {openGiphy && <GiphyUloader setOpen={setOpenGiphy} />}
        <CreateHeader title="Image" />
        <Progressbar id="image" value="40" />
        <main className="h-full flex-1">
          <Text
            className="mt-2"
            size="text-lg"
            weight="font-base"
            color="text-gray-500"
          >
            Upload the image that will be your instant background
          </Text>
          <ImageUpload image={instant.image} onClick={() => setOpen(true)} />
        </main>
        <div className="w-full my-12 flex justify-around h-10">
          <Button
            onClick={() => router.back()}
            type="secondary"
            text="Back"
            className="w-32"
            padding="py-3"
          />
          <Button
            onClick={() => {
              if (!validateStep2(instant.image)) {
                return;
              }
              if (editId)
                router.push("/create/instant/step-3?editId=" + editId);
              else router.push("/create/instant/step-3");
            }}
            type="primary"
            text="Next"
            className="w-32"
            padding="py-3"
          />
        </div>
      </Container>
    </RoutingGuard>
  );
}

export default Step2;
