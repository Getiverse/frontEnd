import Image from "next/image";
import { FiEdit2, FiMoreVertical } from "react-icons/fi";
import Avatar from "../Avatar";
import Text from "../Text";
import Title from "../Title";
import { AiFillStar } from "react-icons/ai";
import { RiDeleteBin6Line, RiSendPlaneFill } from "react-icons/ri";
import { BsFillBookmarkFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import { ModalType } from "../types/Modal";
import { useRouter } from "next/router";
import { extractTextFromContent, handleImageType } from "../../utils/functions";
import { useMemo } from "react";
import { MAX_POST_LENGTH } from "../../utils/constants";
import { readArticle } from "../../utils/atoms/readArticle";
import { useQuery } from "@apollo/client";
import { FIND_USER_BY_ID } from "../../graphql/query/author";
import { GraphqlArticle } from "../../graphql/types/article";
import { PostType } from "../../graphql/types/enums";
import AvatarSkeleton from "../skeletons/AvatarSkeleton";
import ImageSkeleton from "../skeletons/ImageSkeleton";
import TextSkeleton from "../skeletons/TextSkeleton";
import useUid from "../../hooks/useUid";
import { DeleteType, deleteType } from "../../utils/atoms/deleteType";
import { GET_ALL_CATEGORIES } from "../../graphql/query/category";
import { GraphqlCategory } from "../../graphql/types/category";

function Article({
  userId,
  image,
  title,
  createdAt,
  categories,
  ratingSum,
  ratingsNumber,
  content,
  isEditable = false,
  isSketch = false,
  id,
  isDeletable = false,
  readTime = 0,
}: GraphqlArticle & {
  isDeletable?: boolean;
  isSketch?: boolean;
  isEditable?: boolean;
}) {
  const {
    loading: avatarLoading,
    error,
    data: author,
    refetch,
  } = useQuery<FIND_USER_BY_ID>(FIND_USER_BY_ID, {
    variables: {
      skip: !userId,
      type: userId,
    },
  });
  const [openMoreModal, setOpenMoreModal] = useRecoilState(moreModal);
  const [article, setArticle] = useRecoilState(readArticle);
  const uid = useUid();
  const router = useRouter();
  const [deleteTypeState, setDeleteTypeState] = useRecoilState(deleteType);
  const { data: categoriesMemory } = useQuery<{
    findAllCategories: GraphqlCategory[];
  }>(GET_ALL_CATEGORIES);
  const categoriesList = categoriesMemory && [
    ...categoriesMemory?.findAllCategories.filter((val) =>
      categories?.includes(val.id)
    ),
  ];
  const description = useMemo(
    () => extractTextFromContent(JSON.parse(content ? content : "[]")),
    [content]
  );
  function handleArticleClick() {
    setArticle({
      /**
       * @ts-ignore */
      id: id,
      isInstant: false,
    });
  }
  return (
    <article
      className={`bg-gray-50 dark:bg-slate-900 w-full pt-2 pb-4 rounded-2xl max-w-xs cursor-pointer hover:shadow ${
        isSketch ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center pb-1 px-4 justify-between">
        <button
          onClick={() => {
            if (uid == userId) {
              router.push("/me");
            } else {
              router.push(
                "/author/@" +
                  author?.findUserById.userName +
                  "?id=" +
                  author?.findUserById.id
              );
            }
          }}
          className="flex items-center space-x-2 cursor-pointer hover:text-blue-500"
        >
          {avatarLoading ? (
            <AvatarSkeleton
              width="w-10"
              height="h-10"
              className="scale-[77%]"
            />
          ) : (
            <Avatar
              src={author?.findUserById.profileImage}
              className="scale-[77%]"
            />
          )}
          {avatarLoading ? (
            <TextSkeleton width="w-20" height="h-3" />
          ) : (
            <Text size="text-md" weight="font-normal">
              {author?.findUserById.userName}
            </Text>
          )}
        </button>
        {avatarLoading ? (
          <></>
        ) : isDeletable ? (
          <button
            onClick={() => {
              setDeleteTypeState(DeleteType.ARTICLE_FROM_LIBRARY);
              setOpenMoreModal((prev) => ({
                ...prev,
                type: ModalType.CONFIRM,
                open: true,
                postId: id,
                postType: PostType.ARTICLE,
              }));
            }}
            data-te-ripple-init
            data-te-ripple-color="light"
          >
            <RiDeleteBin6Line size={22} className="text-red-500" />
          </button>
        ) : isEditable ? (
          <button
            data-te-toggle="modal"
            data-te-target="#confirmModal"
            data-te-ripple-init
            data-te-ripple-color="light"
          >
            <FiEdit2 size={22} className="text-gray-500" />
          </button>
        ) : (
          <FiMoreVertical
            className={`hover:text-blue-400 cursor-pointer ${
              openMoreModal.open && openMoreModal.type == ModalType.MORE
                ? "text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() =>
              setOpenMoreModal({
                authorId: userId,
                open: true,
                postId: id,
                type: ModalType.MORE,
                postType: PostType.ARTICLE,
              })
            }
            size={20}
          />
        )}
      </div>
      <button
        className="w-full text-left"
        onClick={() => {
          handleArticleClick();
          router.push("/article/" + id);
        }}
      >
        <div className="h-48 w-full relative">
          {avatarLoading ? (
            <ImageSkeleton height="h-48" />
          ) : (
            <Image
              loading="lazy"
              src={handleImageType(image)}
              fill
              alt="image alt"
              className="object-cover"
            />
          )}
        </div>
        {avatarLoading ? (
          <div className="ml-4 mt-5 space-y-3 w-full">
            <TextSkeleton className="" width="w-4/5" height="h-4" />
            <TextSkeleton className="" width="w-2/5" height="h-4" />
          </div>
        ) : (
          <Title size="text-2xl" className="px-4 mt-2">
            {title && title?.slice(0, 37) + (title?.length > 37 ? "..." : "")}
          </Title>
        )}
        <div className="flex px-4 py-3 justify-between items-center">
          {avatarLoading ? (
            <TextSkeleton height="h-2" width="w-20" />
          ) : (
            <Text
              className="flex items-center"
              weight="font-normal"
              color="text-gray-500"
              size="text-xs"
            >
              <span>
                {createdAt &&
                  new Date(createdAt).toLocaleString("default", {
                    month: "long",
                    day: "2-digit",
                  })}
              </span>
              <div
                style={{ width: 5, height: 5 }}
                className="inline-block bg-gray-300 rounded-full mx-1"
              />
              <span>{readTime} min read</span>
            </Text>
          )}
          {avatarLoading ? (
            <TextSkeleton width="w-20" height="h-4" className="my-1" />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-950 rounded-md h-5 flex items-center px-2">
              <Text
                weight="font-normal"
                color="text-gray-500"
                className="leading-none"
                size="text-xs"
              >
                {categoriesList != undefined &&
                  categoriesList.length > 0 &&
                  categoriesList[0].name}
              </Text>
            </div>
          )}
        </div>
        {avatarLoading ? (
          <div className="px-4 pt-2 space-y-2 pb-8">
            <TextSkeleton width="w-full" height="h-2" />
            <TextSkeleton width="w-full" height="h-2" />
            <TextSkeleton width="w-full" height="h-2" />
          </div>
        ) : (
          <Text
            className="px-4 break-words"
            weight="font-normal"
            size="text-sm"
            color="text-gray-600"
          >
            {description.length > MAX_POST_LENGTH
              ? description.slice(0, MAX_POST_LENGTH) + "..."
              : description}
          </Text>
        )}
      </button>
      {!avatarLoading && (
        <div className={`mt-2 flex items-center justify-between px-4`}>
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-center mt-2">
              <AiFillStar
                size={26}
                className="text-gray-300 dark:text-slate-700 hover:text-blue-500 cursor-pointer"
                onClick={() =>
                  router.push(
                    "/rating/" +
                      title +
                      "?postId=" +
                      id +
                      "&type=" +
                      PostType.ARTICLE +
                      "&userId=" +
                      userId +
                      "&isOutside=true"
                  )
                }
              />
              <Text
                weight="font-normal"
                size="text-xs"
                className="leading-none"
                color="text-blue-500 dark:text-blue-500"
                disableDark
              >
                {ratingSum != undefined &&
                ratingsNumber != undefined &&
                ratingsNumber > 0
                  ? (ratingSum / ratingsNumber).toFixed(1)
                  : 0}
              </Text>
            </div>
            <RiSendPlaneFill
              className={`hover:text-blue-400 cursor-pointer ${
                openMoreModal.type == ModalType.SHARE && openMoreModal.open
                  ? "text-blue-500"
                  : "text-gray-300 dark:text-slate-700"
              }`}
              onClick={() =>
                setOpenMoreModal((prev) => ({
                  ...prev,
                  type: ModalType.SHARE,
                  open: true,
                  url: process.env.NEXT_PUBLIC_HOST + "/article/" + id,
                }))
              }
              size={26}
            />
          </div>
          <BsFillBookmarkFill
            onClick={() =>
              setOpenMoreModal((prev) => ({
                ...prev,
                type: ModalType.SAVE_TO,
                open: true,
                image: image,
                postType: PostType.ARTICLE,
                postId: id,
              }))
            }
            className="text-gray-300 dark:text-slate-700"
            size={21}
          />
        </div>
      )}
    </article>
  );
}

export default Article;
