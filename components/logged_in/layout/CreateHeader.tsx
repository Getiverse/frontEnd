import { useRouter } from "next/router";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import { useRecoilState } from "recoil";
import { PostType } from "../../../graphql/types/enums";
import { moreModal } from "../../../utils/atoms/moreModal";
import Title from "../../Title";
import { ModalType } from "../../types/Modal";

function CreateHeader({
  title,
  darkBg = false,
  className = "",
}: {
  title: string;
  darkBg?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [showInformation, setShowInformation] = useRecoilState(moreModal);
  return (
    <div
      className={`${className} flex items-center w-full justify-between pt-6 z-[2]`}
    >
      <AiOutlineClose
        size="28"
        className={`${
          darkBg ? "text-gray-100" : "text-gray-400"
        } cursor-pointer`}
        onClick={() => router.replace("/home")}
      />
      <Title
        color={`${darkBg ? "text-gray-100" : "text-gray-500"}`}
        size="text-3xl"
      >
        {title}
      </Title>
      <AiOutlineInfoCircle
        onClick={() =>
          setShowInformation((prev) => ({
            open: true,
            type: ModalType.DESCRIPTION,
            postType: PostType.ARTICLE,
          }))
        }
        size="28"
        className={`cursor-pointer ${
          darkBg ? "text-gray-100" : "text-gray-400"
        }`}
      />
    </div>
  );
}

export default CreateHeader;
