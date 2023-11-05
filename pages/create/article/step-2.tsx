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
import { imageUploaded } from "../../../utils/atoms/imageUploaded";
import { useRecoilState } from "recoil";
import { createdArticle } from "../../../utils/atoms/createdArticle";
import RoutingGuard from "../../../components/RoutingGuard";
import PostCreationInformation from "../../../components/specialModals/PostCreationInformation";
import { toast } from "react-toastify";

const UnsplashUploader = dynamic(
  () => import("../../../components/UnplashUploader"),
  { ssr: false }
);

function Step2() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openUplash, setOpenUplash] = useState(false);
  const [imageInput, setImageInput] = useRecoilState(imageUploaded);
  const [article, setArticle] = useRecoilState(createdArticle);
  const editId = router.query.editId;

  function validateStep2(image: string) {
    if (!image) {
      toast.error("please select an image");
      return false;
    }
    return true;
  }
  
  useEffect(() => {
    if (imageInput) {
      setArticle((prev) => ({ ...prev, image: imageInput }));
      setImageInput("");
    }
  }, [imageInput]);

  return (
    <RoutingGuard>
      <PostCreationInformation text="Preview your instant is complete after you publish the instant it will be visible to all the People on Getiverse" />
      <Container
        bg="bg-white"
        className="flex flex-col items-center px-6 relative"
      >
        {openUplash && <UnsplashUploader setOpen={setOpenUplash} />}
        <ImagePickerModal
          open={open}
          setOpen={setOpen}
          setOpenUplash={setOpenUplash}
          removeVideos
        />
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
          <ImageUpload image={article.image} onClick={() => setOpen(true)} />
        </main>
        <div className="w-full mb-12 flex justify-around h-10">
          <Button
            onClick={() => router.back()}
            type="secondary"
            text="Back"
            className="w-32"
            padding="py-3"
          />
          <Button
            onClick={() => {
              if (!validateStep2(article.image)) {
                return;
              }
              if (editId)
                router.push("/create/article/step-3?editId=" + editId);
              else router.push("/create/article/step-3");
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
