import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { CSSProperties, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { FIND_USER_BY_ID } from "../../graphql/query/author";
import { PostType } from "../../graphql/types/enums";
import { DeleteType, deleteType } from "../../utils/atoms/deleteType";
import { moreModal } from "../../utils/atoms/moreModal";
import { outsideInstantData } from "../../utils/atoms/outsideInstantData";
import { INSTANTS_PAGEABLE_PAGE_SIZE } from "../../utils/constants";
import { handleImageType } from "../../utils/functions";
import Avatar from "../Avatar";
import AvatarSkeleton from "../skeletons/AvatarSkeleton";
import TextSkeleton from "../skeletons/TextSkeleton";
import Text from "../Text";
import { ModalType } from "../types/Modal";

type MiniInstant = {
  image: string;
  title: string;
  id: string;
  userId: string;
  position: number;
  instantsCount: number;
  style: CSSProperties;
  isEditable?: boolean;
  specialFetch: "" | "library" | "profile";
};

function MiniInstant({
  image,
  title,
  id,
  userId,
  isEditable,
  position,
  instantsCount,
  style,
  specialFetch = "",
}: MiniInstant) {
  const router = useRouter();
  const [instant, setInstant] = useRecoilState(outsideInstantData);
  const [deleteTypeState, setDeleteTypeState] = useRecoilState(deleteType);
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const {
    loading,
    error,
    data: user,
    refetch,
  } = useQuery<FIND_USER_BY_ID>(FIND_USER_BY_ID, {
    variables: {
      skip: !userId,
      type: userId,
    },
  });

  return (
    <div style={style} className="relative rounded-2xl">
      {router.route == "/me" && (
        <FiMoreVertical
          className={`absolute z-30 right-4 top-4 text-white opacity-90 p-1 rounded-full hover:bg-blue-400 cursor-pointer ${
            openModal.open && openModal.type == ModalType.MORE
              ? "bg-blue-500"
              : "bg-gray-600"
          }`}
          onClick={() =>
            setOpenModal({
              authorId: userId,
              open: true,
              postId: id,
              type: ModalType.MORE,
              postType: PostType.INSTANT,
            })
          }
          size={30}
        />
      )}
      {isEditable && (
        <AiFillDelete
          onClick={() => {
            setDeleteTypeState(DeleteType.INSTANT_FROM_LIBRARY);
            setOpenModal((prev) => ({
              ...prev,
              open: true,
              type: ModalType.CONFIRM,
              postId: id,
              postType: PostType.INSTANT,
            }));
          }}
          className="text-red-500 absolute right-4 top-4 z-30 bg-gray-700 opacity-90 rounded-full p-1"
          size={36}
        />
      )}
      {/**The black filter covers the relative div and it is upper all the components and under the update button */}
      <div
        onClick={() => {
          setInstant({
            id: id,
          });
          if (specialFetch == "profile")
            router.push(
              "/instants" +
                "?uid=" +
                userId +
                "&index=" +
                position +
                "&page=" +
                Math.floor(position / (INSTANTS_PAGEABLE_PAGE_SIZE + 1))
            );
          else if (specialFetch == "library") {
            router.push(
              "/instants" +
                "?libId=" +
                router.query.id +
                "&index=" +
                position +
                "&page=" +
                Math.floor(position / (INSTANTS_PAGEABLE_PAGE_SIZE + 1))
            );
          } else router.push("/instants" + "?instantId=" + id);
        }}
        className="absolute w-[calc(100%-7px)] h-full left-1 rounded-2xl bg-gradient-to-b from-black via-transparent to-black opacity-40 z-20"
      />
      {!loading && <ImageVideo src={image} />}
      {!loading ? (
        <Text className="absolute px-3 bottom-20 z-20" color="text-white">
          {title}
        </Text>
      ) : (
        <TextSkeleton
          width="w-32"
          height="h-4"
          className="absolute px-3 bottom-20 z-20 left-4"
        />
      )}
      <div className="absolute bottom-2 flex items-center px-3 z-20">
        {loading ? (
          <AvatarSkeleton height="h-10" width="w-10" className="scale-75" />
        ) : (
          <Avatar src={user?.findUserById.profileImage} className="scale-75" />
        )}
        {!loading ? (
          <Text color="text-white" weight="font-normal" size="text-sm">
            {user?.findUserById.userName}
          </Text>
        ) : (
          <TextSkeleton width="w-20" height="h-3" className="ml-2" />
        )}
      </div>
    </div>
  );
}

function ImageVideo({ src }: { src: string }) {
  const isVideo = src.includes("player");
  return isVideo ? (
    <video
      className={`object-cover bg-center h-full w-full absolute top-0 left-0 rounded-2xl px-1`}
      autoPlay
      muted={true}
      loop
      src={src}
    />
  ) : (
    <Image
      src={handleImageType(src)}
      fill
      loading="lazy"
      className="object-cover bg-center z-10 rounded-2xl px-1"
      alt={"background image"}
    />
  );
}

export default MiniInstant;
