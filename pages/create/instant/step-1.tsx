import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import Button from "../../../components/buttons/Button";
import Container from "../../../components/container/Container";
import CustomInput from "../../../components/input/CustomInput";
import CreateHeader from "../../../components/logged_in/layout/CreateHeader";
import Progressbar from "../../../components/Progressbar";
import RoutingGuard from "../../../components/RoutingGuard";
import PostCreationInformation from "../../../components/specialModals/PostCreationInformation";
import Text from "../../../components/Text";
import { createdInstant } from "../../../utils/atoms/createdInstant";
import createAstronaut from "/public/create-astronaut.png";

function Step1() {
  const router = useRouter();
  const [instant, setInstant] = useRecoilState(createdInstant);
  const editId = router.query.editId;

  function validateStep1(title: string) {
    if (title.length < 10) {
      toast.error("Title must be more than 10 words");
      return false;
    } else if (title.length > 100) {
      toast.error("Title must be less than 100 words");
      return false;
    }

    return true;
  }
  return (
    <RoutingGuard>
      <PostCreationInformation text="Instants are short informations about ideas, experiences, quotes ... the title of a instant describe shortly the content" />
      <Container
        bg="bg-white"
        className="flex flex-col items-center px-6 relative"
      >
        <CreateHeader title="Title" />
        <Progressbar id="title" value="20" />
        <div className="flex-1 flex flex-col items-center mt-4">
          <CustomInput
            maxLength={100}
            onChange={(e) => {
              setInstant((prev) => ({ ...prev, title: e.currentTarget.value }));
            }}
            value={instant.title}
            placeHolder="Enter your Title"
            border="border-gray-300 border"
          />
          <Text
            weight="font-base"
            className="pl-2 pt-4"
            size="text-lg"
            color="text-gray-500"
          >
            The title must be max 100 words and minimum 10 words
          </Text>
          <Image
            src={createAstronaut}
            alt="astronaut writing"
            className="pt-6"
          />
        </div>
        <Button
          onClick={() => {
            if (!validateStep1(instant.title)) {
              return;
            }
            if (editId) router.push("/create/instant/step-2?editId=" + editId);
            else router.push("/create/instant/step-2");
          }}
          type="primary"
          text="Next"
          className="w-32 mb-12"
          padding="py-3"
        />
      </Container>
    </RoutingGuard>
  );
}

export default Step1;
