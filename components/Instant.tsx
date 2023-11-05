import Image from "next/image";
import Avatar from "./Avatar";
import Text from "./Text";
import Title from "./Title";
import { BsFillBookmarkFill } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { ModalType } from "./types/Modal";
import { moreModal } from "../utils/atoms/moreModal";
import { useRecoilState } from "recoil";
import ReadOnlyInstantEditor from "./editor/instants/ReadOnlyInstantEditor";
import { VscMute, VscUnmute } from "react-icons/vsc";
import { getTextLength, handleImageType, textCrop } from "../utils/functions";
import { readArticle } from "../utils/atoms/readArticle";
import Link from "next/link";
import { MAX_WORDS, MAX_WORDS_FOR_REDIRECT } from "../utils/constants";
import { useMutation, useQuery } from "@apollo/client";
import { FIND_USER_BY_ID } from "../graphql/query/author";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../graphql/query/me";
import { PostType } from "../graphql/types/enums";
import useIsInViewport from "../hooks/useIsInViewport";
import useFollow from "../hooks/mutation/useFollow";
import useUid from "../hooks/useUid";
import { getUserById, User } from "../utils/fetch/public/query";

type Instant = {
  title: string;
  image?: string;
  createdAt?: string;
  content: string;
  altImage?: string;
  rating?: number;
  userId: string;
  categories?: string[];
  id: string;
  style?: CSSProperties;
  setVideoRef?: (val: any) => void;
  setActive?: Dispatch<
    SetStateAction<{
      userId: string;
      id: string;
    }>
  >;
};

function Instant({
  title,
  image,
  createdAt,
  content,
  altImage,
  rating,
  userId,
  id,
  setVideoRef,
  style,
  setActive,
}: Instant) {
  const router = useRouter();
  const [createArticle, setCreateReadArticle] = useRecoilState(readArticle);
  const [openMoreModal, setOpenMoreModal] = useRecoilState(moreModal);
  const [showMoreUp, setShowMoreUp] = useState(false);
  const [author, setAuthor] = useState<User>();
  const { data: followingIds } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(
    GET_MY_PROFILE_PRIMARY_STATS
  );
  const ref = useRef(null);
  const visible = useIsInViewport(ref);
  const uid = useUid();
  useEffect(() => {
    if (visible) {
      setActive &&
        setActive({
          userId: userId,
          id: id,
        });
    }
  }, [visible]);

  useEffect(() => {
    if (!uid) {
      getUserById(userId).then((val) => setAuthor(val));
    }
  }, [uid]);
  const jsonContent = useMemo(
    () => JSON.parse(JSON.stringify(content)),
    [content]
  );

  const croppedContent = useMemo(() => textCrop(jsonContent), []);

  const {
    error,
    data: user,
    refetch,
  } = useQuery<FIND_USER_BY_ID>(FIND_USER_BY_ID, {
    skip: !userId,
    variables: {
      skip: !userId,
      type: userId,
    },
  });
  const follow = useFollow(
    userId,
    user ? user?.findUserById.userName : "",
    user?.findUserById.profileImage
  );
  // useEffect(() => {
  //   refetch({
  //     variables: {
  //       type: userId,
  //     },
  //   });
  // }, [userId]);

  useEffect(() => {
    if (getTextLength(jsonContent) > MAX_WORDS && image) {
      setCreateReadArticle({
        image: image,
        categories: [],
        title: title,
        isInstant: true,
        content: content,
        /**@ts-ignore */
        createdAt: createdAt,
      });
    }
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-full w-full snap-start snap-always"
      style={style}
    >
      <div className="absolute w-full h-full bg-gradient-to-b from-black via-transparent to-black opacity-40 z-[2]" />
      <ImageVideo src={image} isActive={visible} setVideoRef={setVideoRef} />
      <Title
        className="absolute top-16 left-4 z-[2] mr-4 lg:hidden"
        color="text-gray-50"
        weight="font-normal"
        size="text-2xl"
      >
        {title}
      </Title>
      <div
        style={{
          bottom: showMoreUp ? getTextLength(jsonContent) * 1.1 + 170 : 0,
        }}
        className={`flex lg:hidden flex-col absolute right-3 ${
          showMoreUp ? "" : "top-1/2 -translate-y-1/3"
        } z-[2]`}
      >
        <div className="relative">
          {uid != userId && (
            <button
              onClick={() => {
                uid
                  ? follow({
                      variables: {
                        type: userId,
                      },
                    })
                  : setOpenMoreModal((prev) => ({
                      ...prev,
                      type: ModalType.FORCE_LOGIN,
                      open: true,
                      postId: id,
                      postType: PostType.INSTANT,
                    }));
              }}
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bottom flex justify-center items-center z-[3] text-2xl duration-300 font-medium ${
                followingIds?.me.follow.includes(userId)
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              {followingIds?.me.follow.includes(userId) ? "-" : "+"}
            </button>
          )}
          <button>
            <Avatar
              authorName={user?.findUserById.userName}
              userId={userId}
              src={uid ? user?.findUserById.profileImage : author?.profileImage}
            />
          </button>
        </div>
        <div className="flex items-center flex-col mt-5 z-[2]">
          <button
            onClick={() =>
              uid
                ? router.push(
                    "/rating/" +
                      title +
                      "?postId=" +
                      id +
                      "&type=" +
                      PostType.INSTANT +
                      "&userId=" +
                      userId +
                      "&isOutside=false"
                  )
                : setOpenMoreModal((prev) => ({
                    ...prev,
                    type: ModalType.FORCE_LOGIN,
                    open: true,
                    postId: id,
                    postType: PostType.INSTANT,
                  }))
            }
            className="bg-gray-600 opacity-90 rounded-full w-10 h-10 flex items-center justify-center active:bg-blue-600 hover:bg-blue-600"
          >
            <AiFillStar color="#d1d5db" size={28} />
          </button>
          <Text color="text-blue-500" weight="font-normal" size="text-xs">
            {rating ? rating.toFixed(1) : 0}
          </Text>
        </div>
        <button
          onClick={() =>
            setOpenMoreModal((prev) => ({
              ...prev,
              type: ModalType.SHARE,
              open: true,
              url:
                process.env.NEXT_PUBLIC_HOST + "/instants?" + "instantId=" + id,
            }))
          }
          className="bg-gray-600 active:bg-blue-600 hover:bg-blue-600 opacity-90 rounded-full w-10 h-10 flex items-center justify-center mt-2 z-[2]"
        >
          <RiSendPlaneFill color="#d1d5db" size={26} />
        </button>
        <button
          onClick={() =>
            setOpenMoreModal((prev) => ({
              ...prev,
              type: uid ? ModalType.SAVE_TO : ModalType.FORCE_LOGIN,
              open: true,
              postId: id,
              postType: PostType.INSTANT,
            }))
          }
          className="bg-gray-600 active:bg-blue-600 hover:bg-blue-600 opacity-90 rounded-full w-10 h-10 flex items-center justify-center mt-5 z-[2]"
        >
          <BsFillBookmarkFill color="#d1d5db" size={22} />
        </button>
      </div>
      <div
        className={`absolute ${
          uid ? "bottom-20" : "bottom-4"
        } w-full px-2 z-[2]  `}
      >
        <div className="p-4 bg-gray-600 w-full z-[2] opacity-90 rounded-xl overflow-y-scroll scrollbar-hide">
          {showMoreUp ? (
            <ReadOnlyInstantEditor key={"editor2"} content={jsonContent} />
          ) : (
            <ReadOnlyInstantEditor key={"editor1"} content={croppedContent} />
          )}
          {getTextLength(jsonContent) > MAX_WORDS && !showMoreUp && (
            <button
              onClick={() => {
                if (getTextLength(jsonContent) > MAX_WORDS_FOR_REDIRECT) {
                  router.push("/article/" + title + "?instantId=" + id);
                } else {
                  setShowMoreUp(true);
                }
              }}
              className="text-blue-500"
            >
              Read more
            </button>
          )}
          {showMoreUp && (
            <button
              onClick={() => {
                {
                  setShowMoreUp(false);
                }
              }}
              className="text-blue-500"
            >
              Read less
            </button>
          )}
          <Text
            size="text-sm"
            color="text-white"
            className="mt-1"
            weight="font-thin"
          >
            {createdAt &&
              new Date(createdAt).toLocaleString("default", {
                month: "long",
                day: "2-digit",
              })}
          </Text>
        </div>
      </div>
    </div>
  );
}

function ImageVideo({
  src,
  isActive,
  setVideoRef,
}: {
  src: string | undefined;
  isActive: boolean;
  setVideoRef?: (val: any) => void;
}) {
  if (!src) return <></>;
  const isVideo = src.includes("player");
  const [isMute, setIsMute] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (isActive && isVideo) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isActive]);
  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (isMute) {
      //open bug since 2017 that you cannot set muted in video element https://github.com/facebook/react/issues/10389
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
    }
  }, [src]);

  return isVideo ? (
    <>
      <button
        onClick={() => setIsMute((prev) => !prev)}
        className="absolute top-20 text-white right-4 z-30"
      >
        {isMute ? <VscMute size={25} /> : <VscUnmute size={25} />}
      </button>
      <video
        ref={(ref) => {
          /**@ts-ignore */
          videoRef.current = ref;
          setVideoRef && setVideoRef(ref);
        }}
        className={`object-cover bg-center h-full w-full absolute top-0 left-0`}
        autoPlay
        loop
        muted={isMute ? true : false}
        src={src}
      />
    </>
  ) : (
    <Image
      src={handleImageType(src)}
      fill
      loading="lazy"
      className="object-cover bg-center z-[1]"
      alt={"background image"}
    />
  );
}

export default Instant;
