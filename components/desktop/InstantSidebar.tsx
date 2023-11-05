import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BsFillBookmarkFill } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";
import { useRecoilState } from "recoil";
import { GET_ALL_CATEGORIES } from "../../graphql/query/category";
import { GET_MY_FOLLOW_USER_ID } from "../../graphql/query/me";
import { FIND_RATINGS_BY_POST_ID } from "../../graphql/query/rating";
import { GraphqlCategory } from "../../graphql/types/category";
import { PostType } from "../../graphql/types/enums";
import useUid from "../../hooks/useUid";
import getiverseLogo from "../../public/getiverse-gradiento-logo.png";
import { moreModal } from "../../utils/atoms/moreModal";
import { getUserById, User } from "../../utils/fetch/public/query";
import Author from "../Author";
import Category from "../Category";
import Instant from "../Instant";
import LoadingBlock from "../LoadingBlock";
import LoadingSpinner from "../LoadingSpinner";
import RatingComponent from "../Rating";
import AvatarSkeleton from "../skeletons/AvatarSkeleton";
import Text from "../Text";
import Title from "../Title";
import { ModalType } from "../types/Modal";

function InstantSidebar({ instant }: { instant: Instant | undefined }) {
  const router = useRouter();
  const [openMoreModal, setOpenMoreModal] = useRecoilState(moreModal);
  const [author, setAuthor] = useState<User>();
  const uid = useUid();
  const { data: categoriesMemory } = useQuery<{
    findAllCategories: GraphqlCategory[];
  }>(GET_ALL_CATEGORIES, {
    skip: !uid,
  });
  const { data: authors, loading: authorsLoading } =
    useQuery<GET_MY_FOLLOW_USER_ID>(GET_MY_FOLLOW_USER_ID);
  const {
    data: ratings,
    loading,
    refetch: refetchRatings,
    fetchMore: fetchMoreRatings,
  } = useQuery<FIND_RATINGS_BY_POST_ID>(FIND_RATINGS_BY_POST_ID, {
    skip: !instant?.id,
    variables: {
      skip: !instant?.id,
      postId: instant?.id,
      postType: PostType.INSTANT,
      page: {
        page: 0,
        size: 3,
      },
    },
  });

  useEffect(() => {
    if (instant) getUserById(instant?.userId).then((val) => setAuthor(val));
  }, [instant]);

  const categoriesList = categoriesMemory
    ? [
        ...categoriesMemory?.findAllCategories.filter(
          (element: any) =>
            instant?.categories && instant?.categories.includes(element.id)
        ),
      ]
    : [];

  return (
    <div className="w-full max-w-2xl 2xl:mr-32 h-screen py-5 px-12 hidden md:block">
      <header className="flex justify-between items-center w-full mb-4">
        <Image
          onClick={() => router.push("/home")}
          src={getiverseLogo}
          alt="getiverse logo"
          className="w-32"
        />
        <FiMoreVertical
          size={26}
          onClick={() =>
            setOpenMoreModal({
              authorId: instant?.userId,
              open: true,
              postId: instant?.id,
              type: ModalType.MORE,
              postType: PostType.INSTANT,
              hide: {
                followAuthor: true,
              },
            })
          }
          className={`text-white cursor-pointer`}
        />
      </header>
      {instant != undefined &&
      author != undefined &&
      authors != undefined &&
      !loading ? (
        <Fragment>
          <Title size="text-4xl" className="my-10">
            {instant.title}
          </Title>
          <Author
            id={instant.userId}
            name={author?.userName}
            src={author?.profileImage}
            className="my-6"
            isFollow={authors?.me.follow.includes(instant.userId)}
          />
          <hr className="w-full bg-gray-700" />
          {ratings?.findRatingsByPostId.data.map((val) => (
            <RatingComponent {...val} isActive postType={PostType.INSTANT} />
          ))}

          <div className="flex items-center space-x-5 mt-5 z-[2]">
            <button
              onClick={() =>
                uid
                  ? router.push(
                      "/rating/" +
                        instant.title +
                        "?postId=" +
                        instant.id +
                        "&type=" +
                        PostType.INSTANT +
                        "&userId=" +
                        instant.userId +
                        "&isOutside=false"
                    )
                  : setOpenMoreModal((prev) => ({
                      ...prev,
                      type: ModalType.FORCE_LOGIN,
                      open: true,
                      postId: instant.id,
                      postType: PostType.INSTANT,
                    }))
              }
              className="bg-gray-600 opacity-90 rounded-full w-10 h-10 flex items-center justify-center active:bg-blue-600 hover:bg-blue-600"
            >
              <AiFillStar color="#d1d5db" size={28} />
            </button>
            {/* <Text color="text-blue-500" weight="font-normal" size="text-xs">
                {instant.rating ? instant.rating.toFixed(1) : 0}
              </Text> */}
            <button
              onClick={() =>
                setOpenMoreModal((prev) => ({
                  ...prev,
                  type: ModalType.SHARE,
                  open: true,
                  url:
                    process.env.NEXT_PUBLIC_HOST +
                    "/instants?" +
                    "instantId=" +
                    instant.id,
                }))
              }
              className="bg-gray-600 active:bg-blue-600 hover:bg-blue-600 opacity-90 rounded-full w-10 h-10 flex items-center justify-center z-[2]"
            >
              <RiSendPlaneFill color="#d1d5db" size={26} />
            </button>
            <button
              onClick={() =>
                setOpenMoreModal((prev) => ({
                  ...prev,
                  type: uid ? ModalType.SAVE_TO : ModalType.FORCE_LOGIN,
                  open: true,
                  postId: instant.id,
                  postType: PostType.INSTANT,
                }))
              }
              className="bg-gray-600 active:bg-blue-600 hover:bg-blue-600 opacity-90 rounded-full w-10 h-10 flex items-center justify-center z-[2]"
            >
              <BsFillBookmarkFill color="#d1d5db" size={22} />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-10 md:grid-cols-12 grid-flow-row-dense gap-2 md:gap-4">
            {categoriesList &&
              categoriesList.map((element: GraphqlCategory) => {
                return (
                  <Category
                    key={element.id}
                    id={element.id}
                    category={element.name}
                    Icon={element.image}
                  />
                );
              })}
          </div>
        </Fragment>
      ) : (
        <div className="w-full pt-96 flex flex-col items-center justify-center">
          <LoadingBlock big />
        </div>
      )}
    </div>
  );
}

export default InstantSidebar;
