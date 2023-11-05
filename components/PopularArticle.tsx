import Image from "next/image";
import { FiMoreVertical } from "react-icons/fi";
import Avatar from "./Avatar";
import Text from "./Text";
import Title from "./Title";
import { Article } from "./types/Article";
import { AiFillStar } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsFillBookmarkFill } from "react-icons/bs";
import { useRecoilState } from "recoil";
import { moreModal } from "../utils/atoms/moreModal";
import { ModalType } from "./types/Modal";
import { useRouter } from "next/router";
import { PostType } from "../graphql/types/enums";

function PopularArticle({
  author,
  image,
  index,
  title,
  createdAt,
  readMinutes,
  categories,
  rating,
  content,
  postId,
}: Article) {
  const [openMoreModal, setOpenMoreModal] = useRecoilState(moreModal);
  const router = useRouter();
  return (
    <article className="bg-gray-50 dark:bg-slate-900 w-full h-[228px] min-w-full rounded-2xl max-w-sm flex snap-start cursor-pointer hover:shadow">
      <button
        className="w-44 h-full relative"
        onClick={() => router.push("/article/" + title)}
      >
        <Image
          src={image}
          alt="image alt"
          className="w-full h-full rounded-l-2xl object-cover opacity-70"
        />
        <Text
          disableDark={true}
          color="text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-sky-400"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
          size="text-6xl"
          weight="font-semibold"
        >
          {index}
        </Text>
      </button>
      <div className="pt-1 relative w-full">
        <div className="flex items-center px-3 justify-between">
          <button
            className="flex items-center space-x-2"
            onClick={() => router.push("author/" + author.authorName)}
          >
            <Avatar src={author.src} className="scale-[77%]" />
            <Text size="text-md" weight="font-normal">
              {author.authorName}
            </Text>
          </button>
          <FiMoreVertical
            onClick={() =>
              setOpenMoreModal({
                authorId: author.authorId,
                open: true,
                postId: postId,
                type: ModalType.MORE,
                postType: PostType.ARTICLE,
              })
            }
            size={24}
            className={`${
              openMoreModal.open && openMoreModal.type === ModalType.MORE
                ? "text-blue-500"
                : "text-gray-500 "
            } cursor-pointer rotate-90`}
          />
        </div>
        <button onClick={() => router.push("/article/" + title)}>
          <Title size="text-xl" className="px-3 text-left">
            {title}
          </Title>
          <div className="flex px-3 py-2 justify-between items-center">
            <Text weight="font-normal" color="text-gray-500" size="text-xs">
              {createdAt}-{readMinutes} min read
            </Text>
            <div className="bg-gray-200 dark:bg-gray-950 rounded-md h-5 flex items-center px-2">
              <Text
                weight="font-normal"
                color="text-gray-500"
                className="leading-none"
                size="text-xs"
              >
                {categories[0]}
              </Text>
            </div>
          </div>
        </button>
        <Text
          className={"px-3"}
          weight="font-normal"
          size="text-sm"
          color="text-gray-600"
        >
          {content}
        </Text>
        <div className="mt-2 flex items-center justify-between px-3 absolute w-full bottom-2">
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-center mt-2">
              <AiFillStar
                className="text-gray-300 dark:text-gray-700 hover:text-blue-500 cursor-pointer"
                onClick={() => router.push("/rating")}
                size={26}
              />
              <Text
                weight="font-normal"
                size="text-xs"
                className="leading-none"
                color="text-blue-500"
              >
                {rating}
              </Text>
            </div>
            <RiSendPlaneFill
              className={`cursor-pointer ${
                openMoreModal.type == ModalType.SHARE && openMoreModal.open
                  ? "text-blue-500"
                  : "text-gray-300 dark:text-gray-700"
              }`}
              onClick={() =>
                setOpenMoreModal((prev) => ({
                  ...prev,
                  type: ModalType.SHARE,
                  open: true,
                }))
              }
              size={25}
            />
          </div>
          <BsFillBookmarkFill
            className={`cursor-pointer ${
              openMoreModal.type == ModalType.SAVE_TO && openMoreModal.open
                ? "text-blue-500"
                : "text-gray-300 dark:text-gray-700"
            }`}
            size={19}
            onClick={() =>
              setOpenMoreModal((prev) => ({
                ...prev,
                type: ModalType.SAVE_TO,
                open: true,
              }))
            }
          />
        </div>
      </div>
    </article>
  );
}

export default PopularArticle;
