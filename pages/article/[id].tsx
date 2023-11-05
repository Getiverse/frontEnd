import { NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  AiFillStar,
  AiOutlineClose,
  AiOutlineUserAdd,
  AiOutlineUserDelete,
} from "react-icons/ai";
import { RiMore2Line, RiSendPlaneFill } from "react-icons/ri";
import { BsFillBookmarkFill, BsPlayCircle } from "react-icons/bs";
import { BiChevronLeft, BiMenu } from "react-icons/bi";
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import { zoomImageState } from "../../utils/atoms/zoomImage";
import PostModals from "../../components/specialModals/PostModals";
import ArticleModal from "../../components/specialModals/article/ArticleModal";
import FontSettings from "../../components/specialModals/article/FontSettings";
import IndexModal from "../../components/specialModals/IndexModal";
import Title from "../../components/Title";
import getiverseLogo from "../../public/getiverse-gradiento-logo.png";
import {
  calculateReadTime,
  extractTextFromContent,
  getIndexIds,
  handleImageType,
} from "../../utils/functions";
import useUid from "../../hooks/useUid";
import { moreModal } from "../../utils/atoms/moreModal";
import { ModalType } from "../../components/types/Modal";
import Text from "../../components/Text";
import Avatar from "../../components/Avatar";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ReadOnlyInstantEditor from "../../components/editor/instants/ReadOnlyInstantEditor";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ARTICLE_BY_ID } from "../../graphql/query/article";
import { articleBackground } from "../../utils/atoms/articleBackground";
import LoadingSpinner from "../../components/LoadingSpinner";
import RoutingGuard from "../../components/RoutingGuard";
import { FIND_USER_BY_ID } from "../../graphql/query/author";
import Category from "../../components/Category";
import { GraphqlCategory } from "../../graphql/types/category";
import { FIND_INSTANT_BY_ID } from "../../graphql/query/instant";
import { PostType } from "../../graphql/types/enums";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { fontStyle } from "../../utils/atoms/fontStyle";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../../graphql/query/me";
import useFollow from "../../hooks/mutation/useFollow";
import { GET_ALL_CATEGORIES } from "../../graphql/query/category";
import ImageVideo from "../../components/ImageVideo";
import {
  getArticleById,
  getCategories,
  getInstantById,
  getUserById,
  PublicArticle,
  User,
} from "../../utils/fetch/public/query";
import ForceLogin from "../../components/specialModals/ForceLogin";
import { CgClose } from "react-icons/cg";
import CustomInput from "../../components/input/CustomInput";
import dynamic from "next/dynamic";
import {
  Cedarville,
  Lato,
  Montserrat,
  OpenSans,
  Roboto,
} from "../../utils/constants";
const Editor = dynamic(
  () => import("../../components/plate-editor/components/plate/editor"),
  {
    ssr: false,
  }
);

const Article: NextPage = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [initHeader, setInitHeader] = useState(true);
  const router = useRouter();
  const idArticle = router.query.id as string;
  const instantId = router.query.instantId as string;
  const [zoomImage, setZoomImage] = useRecoilState(zoomImageState);
  const articleBg = useRecoilValue(articleBackground);
  const [font, setFont] = useRecoilState(fontStyle);
  const uid = useUid();
  const [publicArticleData, setPublicArticleData] = useState<PublicArticle>();
  const [author, setAuthor] = useState<User>();
  const [categoriesData, setCategoriesData] = useState<GraphqlCategory[]>();
  const [openModal, setOpenModal] = useRecoilState(moreModal);

  function getFontClassName(val: string) {
    switch (val.toLowerCase()) {
      case "cedarville":
        return Cedarville.className;
      case "lato":
        return Lato.className;
      case "montserrat":
        return Montserrat.className;
      case "roboto":
        return Roboto.className;
      case "opensans":
        return OpenSans.className;
    }
  }

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (currPos.y > -40) {
        setInitHeader(true);
      } else {
        setInitHeader(false);
      }
      if (isShow !== showHeader) {
        setShowHeader(isShow);
      }
    },
    [showHeader],
    null,
    false,
    300
  );

  const { loading, error, data } = useQuery<GET_ARTICLE_BY_ID>(
    GET_ARTICLE_BY_ID,
    {
      skip: !idArticle || instantId != undefined || !uid,
      variables: {
        skip: !idArticle || instantId != undefined || !uid,
        type: idArticle,
      },
    }
  );

  useEffect(() => {
    async function fetchData() {
      if (idArticle) {
        getArticleById(idArticle).then((val) => setPublicArticleData(val));
      } else if (instantId) {
        getInstantById(instantId).then((val) => setPublicArticleData(val));
      }
      if (idArticle || instantId)
        getCategories().then((val) => setCategoriesData(val));
    }
    fetchData();
  }, [idArticle, instantId]);

  useEffect(() => {
    if (publicArticleData && publicArticleData?.userId)
      getUserById(publicArticleData?.userId).then((val) => setAuthor(val));
  }, [publicArticleData]);

  const { data: categoriesMemory } = useQuery<{
    findAllCategories: GraphqlCategory[];
  }>(GET_ALL_CATEGORIES, {
    skip: !uid,
  });

  const { loading: loadingInstant, data: instant } =
    useQuery<FIND_INSTANT_BY_ID>(FIND_INSTANT_BY_ID, {
      variables: {
        skip: idArticle || !instantId,
        type: instantId,
      },
    });

  const { data: user } = useQuery<FIND_USER_BY_ID>(FIND_USER_BY_ID, {
    variables: {
      skip: !data?.findArticleById || !data?.findArticleById.userId,
      type: data?.findArticleById
        ? data?.findArticleById.userId
        : instant?.findInstantById.userId,
    },
  });

  const categories = uid
    ? data?.findArticleById != undefined
      ? data.findArticleById.categories
      : []
    : publicArticleData?.categories != undefined
    ? publicArticleData.categories
    : instant?.findInstantById != undefined
    ? instant?.findInstantById.categories
    : [];

  const categoriesListMemory = uid
    ? categoriesMemory?.findAllCategories != undefined
      ? categoriesMemory.findAllCategories
      : []
    : categoriesData
    ? categoriesData
    : [];

  const categoriesList = [
    ...categoriesListMemory.filter(
      (element: any) => categories && categories.includes(element.id)
    ),
  ];
  const convertedArticleContent = useMemo(
    () =>
      data && data?.findArticleById
        ? JSON.parse(data?.findArticleById.content)
        : JSON.parse(
            instant?.findInstantById.content
              ? instant.findInstantById.content
              : "[]"
          ),
    [data, instant]
  );
  const { data: myProfile } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(
    GET_MY_PROFILE_PRIMARY_STATS,
    { skip: !uid, variables: { skip: !uid } }
  );
  const content = !uid
    ? publicArticleData?.content != undefined &&
      JSON.parse(publicArticleData?.content)
    : convertedArticleContent;

  const title = uid ? data?.findArticleById.title : publicArticleData?.title;

  const createdAt = uid
    ? data?.findArticleById.createdAt
    : publicArticleData?.createdAt;

  const readTime = uid
    ? data?.findArticleById.readTime
    : publicArticleData?.readTime;

  const image = uid ? data?.findArticleById.image : publicArticleData?.image;

  const ratingNumber = uid
    ? data?.findArticleById.ratingsNumber
    : publicArticleData?.ratingsNumber;

  const ratingSum = uid
    ? data?.findArticleById.ratingSum
    : publicArticleData?.ratingSum;

  const userId = uid ? data?.findArticleById.userId : publicArticleData?.userId;

  const authorName = uid ? user?.findUserById.userName : author?.userName;
  const bio = uid ? user?.findUserById.bio : author?.bio;
  const profileImage = uid
    ? user?.findUserById.profileImage
    : author?.profileImage;
  const follow = useFollow(userId, authorName, profileImage);

  if (error) {
    return <div>{error.message}</div>;
  }
  if (loading || loadingInstant) return <LoadingSpinner open={loading} />;
  return (
    <RoutingGuard skipValidation>
      <main className="dark:bg-gray-950 bg-white">
        {userId && idArticle && (
          <ArticleModal authorId={userId} postId={idArticle} />
        )}
        <ForceLogin />
        <FontSettings />
        <PostModals />
        <IndexModal
          content={
            instantId
              ? JSON.parse(
                  instant?.findInstantById.content
                    ? instant?.findInstantById.content
                    : "[]"
                )
              : content
          }
        />
        {zoomImage && <ImageZoom />}
        {articleBg && (
          <Image
            src={articleBg}
            fill
            alt="custom background image for post"
            className="bg-repeat object-cover opacity-5 "
          />
        )}
        <Header
          initHeader={initHeader}
          onBack={() =>
            setFont({
              fontFamily: "roboto",
              fontSizeMoltiplier: 0,
            })
          }
          profileImage={profileImage != undefined ? profileImage : ""}
          userId={instantId ? instant?.findInstantById.userId : userId}
          className={showHeader ? "" : "hidden"}
          authorName={authorName != undefined ? authorName : ""}
        />
        {/**Desktop */}

        {/**Desktop */}
        <button
          className={`hidden md:block fixed z-50 m-2 -left-5 top-[calc(50%+30px)]  rounded-full ${
            openModal.open && openModal.type === ModalType.ARTICLE
              ? "bg-blue-500"
              : "bg-white dark:bg-slate-800"
          } p-2 shadow-lg`}
          onClick={() =>
            setOpenModal({
              open: true,
              type: ModalType.ARTICLE,
              postType: PostType.ARTICLE,
            })
          }
        >
          <RiMore2Line
            size="24"
            className={`ml-2 ${
              openModal.open && openModal.type === ModalType.ARTICLE
                ? "text-white"
                : "text-gray-500"
            }`}
          />
        </button>
        {/**Desktop */}
        <div className="absolute h-[500px] w-full hidden md:block ">
          <div className="relative h-[500px]">
            {/*
             *@ts-ignore */}
            <ImageVideo
              opacityEffect
              onClick={() => null}
              src={
                instantId
                  ? handleImageType(instant?.findInstantById.image)
                  : handleImageType(image)
              }
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-300/10 to-white dark:from-gray-950/30 dark:to-gray-950"></div>
          </div>
        </div>
        <article
          data-te-spy="scroll"
          data-te-target="#scrollspy1"
          data-te-offset="200"
          className="relative py-16 md:pt-40 max-w-3xl m-auto"
        >
          <div className="px-6 w-full">
            <Title
              className="mt-6"
              color="text-gray-600 lg:text-gray-700"
              weight="font-medium lg:font-bold"
              size="text-3xl lg:text-5xl"
            >
              {instantId ? instant?.findInstantById.title : title}
            </Title>
            {/**Mobile */}
            <div className="flex items-center w-full justify-between mt-4 md:hidden">
              <div className="flex items-center">
                <div className="flex space-x-3 items-center">
                  <Text
                    className="flex items-center"
                    weight="font-normal"
                    color="text-gray-500"
                    size="text-xs"
                  >
                    <span>
                      {!instant && !createdAt
                        ? ""
                        : new Date(
                            instantId
                              ? instant?.findInstantById.createdAt
                                ? instant?.findInstantById.createdAt
                                : ""
                              : createdAt != undefined
                              ? createdAt
                              : ""
                          ).toLocaleString("default", {
                            month: "long",
                            day: "2-digit",
                          })}
                    </span>
                    <div
                      style={{ width: 5, height: 5 }}
                      className="inline-block bg-gray-300 rounded-full mx-1"
                    />
                    <span>
                      {instantId
                        ? calculateReadTime(
                            extractTextFromContent(
                              JSON.parse(
                                instant?.findInstantById.content
                                  ? instant.findInstantById.content
                                  : "[]"
                              )
                            )
                          )
                        : readTime}
                      min read
                    </span>
                  </Text>
                </div>
              </div>
              <div className="py-1 px-2 rounded-xl bg-gray-100 dark:bg-gray-700">
                <Text
                  size="text-xs"
                  color="text-gray-500"
                  className="mt-1"
                  weight="font-normal"
                >
                  {categoriesList && categoriesList[0]?.name}
                </Text>
              </div>
            </div>
            {/*Desktop */}

            <div className="md:flex items-center w-full justify-between my-6 hidden">
              <button className="flex items-center group relative">
                {/* Dropdown Card */}
                <div
                  className="absolute top-10 scale-0 transition-opacity group-hover:scale-100 inline-block z-10 max-w-xs cursor-default bg-gray-900 divide-y divide-gray-700 shadow-lg rounded-xl dark:bg-black"
                  role="tooltip"
                >
                  {/* Body */}
                  <div className="p-4 sm:p-5">
                    <div className="mb-2 flex w-full sm:items-center gap-x-5 sm:gap-x-3">
                      <button
                        onClick={() =>
                          uid != undefined
                            ? uid == userId
                              ? router.push(
                                  "/author/@" + authorName + "?id=" + userId
                                )
                              : router.push("/me")
                            : null
                        }
                        className="flex-shrink-0"
                      >
                        <Image
                          width={32}
                          height={32}
                          className="rounded-full"
                          src={profileImage ? profileImage : ""}
                          alt="Image Description"
                        />
                      </button>

                      <div className="grow">
                        <p className="text-lg font-semibold text-gray-200">
                          {authorName}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{bio}</p>
                  </div>
                  {/* End Body */}
                </div>
                {/* End Dropdown Card */}
                <div className="flex space-x-3 items-center">
                  <Avatar src={profileImage} />
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-1">
                      <Text
                        className="flex items-center"
                        weight="font-normal"
                        color="text-gray-500"
                        size="text-xs"
                      >
                        By
                      </Text>
                      <Text
                        className="flex items-center"
                        weight="font-bold"
                        color="text-gray-500"
                        size="text-xs"
                      >
                        {authorName}
                      </Text>

                      <Text
                        className="flex items-center"
                        weight="font-normal"
                        color="text-gray-500"
                        size="text-xs"
                      >
                        <div
                          style={{ width: 6, height: 6 }}
                          className="inline-block bg-gray-100 rounded-full mx-1"
                        />
                        <span>
                          {!instant && !createdAt
                            ? ""
                            : new Date(
                                instantId
                                  ? instant?.findInstantById.createdAt
                                    ? instant?.findInstantById.createdAt
                                    : ""
                                  : createdAt != undefined
                                  ? createdAt
                                  : ""
                              ).toLocaleString("default", {
                                month: "long",
                                day: "2-digit",
                              })}
                        </span>
                      </Text>
                    </div>
                    <Text
                      className="flex items-center"
                      weight="font-normal"
                      color="text-gray-500"
                      size="text-xs"
                    >
                      <span>
                        {instantId
                          ? calculateReadTime(
                              extractTextFromContent(
                                JSON.parse(
                                  instant?.findInstantById.content
                                    ? instant.findInstantById.content
                                    : "[]"
                                )
                              )
                            )
                          : readTime}
                        min read
                      </span>
                    </Text>
                  </div>
                </div>
              </button>
              {uid !== userId && (
                <button
                  className="pl-6"
                  onClick={() =>
                    follow({
                      variables: {
                        type: userId,
                      },
                    })
                  }
                >
                  {myProfile != undefined &&
                  userId != undefined &&
                  myProfile.me.follow.includes(userId) ? (
                    <AiOutlineUserDelete
                      size="30"
                      className="bg-blue-500 text-white rounded-full border p-1 border-blue-500"
                    />
                  ) : (
                    <AiOutlineUserAdd
                      size="30"
                      className="text-blue-500 rounded-full border p-1 border-blue-500"
                    />
                  )}
                </button>
              )}
            </div>

            {/**mobile */}
            <div className="relative mb-6 mt-5 px-4 h-64 md:hidden">
              {/*
               *@ts-ignore */}
              <ImageVideo
                onClick={() =>
                  setZoomImage(
                    instantId ? instant?.findInstantById.image : image
                  )
                }
                src={
                  instantId
                    ? handleImageType(instant?.findInstantById.image)
                    : handleImageType(image)
                }
              />
            </div>

            <div className={`w-full ${getFontClassName(font.fontFamily)}`}>
              {instantId ? (
                <ReadOnlyInstantEditor
                  isInsideArticle={true}
                  content={JSON.parse(
                    instant?.findInstantById
                      ? instant?.findInstantById.content
                      : "[]"
                  )}
                />
              ) : (
                content && <Editor readOnly content={content} />
              )}
            </div>

            <div className="my-4 grid grid-cols-10 md:grid-cols-12 grid-flow-row-dense gap-2 md:gap-4">
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
            <div className="w-full mt-5">
              {/* <Text size="text-2xl">Similar Articles</Text> */}
              {/* <SimilarArticle
                authorName="Carolina Genovese"
                authorSrc={avatar}
                imageSrc={bgImage}
                title="5 Python Frameworks You Shouldn't Learn"
              /> */}
            </div>
          </div>
        </article>
        <Footer
          initHeader={initHeader}
          title={instantId ? instant?.findInstantById.title : title}
          userId={instantId ? instant?.findInstantById.userId : userId}
          id={idArticle}
          className={showHeader ? "" : "hidden"}
          ratingAverage={
            instantId
              ? instant?.findInstantById != undefined &&
                instant.findInstantById.ratingsNumber > 0
                ? (
                    instant?.findInstantById.ratingSum /
                    instant?.findInstantById.ratingsNumber
                  ).toFixed(1)
                : 0
              : ratingNumber != undefined &&
                ratingSum != undefined &&
                ratingNumber > 0
              ? (ratingSum / ratingNumber).toFixed(1)
              : 0
          }
        />

        <ScrollSpyButton
          content={
            instantId
              ? JSON.parse(
                  instant?.findInstantById.content
                    ? instant?.findInstantById.content
                    : "[]"
                )
              : convertedArticleContent
          }
        />
      </main>
    </RoutingGuard>
  );
};

export default Article;

function Header({
  authorName,
  className,
  userId,
  profileImage,
  onBack,
  initHeader,
}: {
  authorName: string;
  className?: string;
  userId: string | undefined;
  profileImage: string;
  onBack: () => void;
  initHeader: boolean;
}) {
  const router = useRouter();
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const uid = useUid();
  const { data: myProfile } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(
    GET_MY_PROFILE_PRIMARY_STATS,
    { skip: !uid, variables: { skip: !uid } }
  );
  const follow = useFollow(userId, authorName, profileImage);
  if (!userId) return <></>;

  return (
    <div className={className}>
      <header
        className={`md:hidden bg-white  dark:bg-slate-900 dark:border-gray-700 px-4 py-4 items-center flex justify-between border-gray-200 fixed w-full top-0 md:left-0 z-[3] shadow`}
      >
        <ProgressBar />
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={() => {
              onBack && onBack();
              router.back();
            }}
          >
            <BiChevronLeft size="30" className="text-blue-500 scale-125" />
          </button>
          <button
            onClick={() =>
              !uid
                ? setOpenModal({
                    open: true,
                    type: ModalType.FORCE_LOGIN,
                    postType: PostType.ARTICLE,
                  })
                : userId != uid
                ? router.push("/author/@" + authorName + "?id=" + userId)
                : router.push("/me")
            }
          >
            <Text immutable color="text-gray-600">
              {authorName.slice(0, 13) + (authorName.length > 13 ? "..." : "")}
            </Text>
          </button>
          {uid != null ? (
            uid !== userId && (
              <button
                className="pl-6"
                onClick={() =>
                  follow({
                    variables: {
                      type: userId,
                    },
                  })
                }
              >
                {myProfile && myProfile.me.follow.includes(userId) ? (
                  <AiOutlineUserDelete
                    size="30"
                    className="bg-blue-500 text-white rounded-full border p-1 border-blue-500"
                  />
                ) : (
                  <AiOutlineUserAdd
                    size="30"
                    className="text-blue-500 rounded-full border p-1 border-blue-500"
                  />
                )}
              </button>
            )
          ) : (
            <button
              onClick={() => router.replace("/access/login")}
              className="bg-blue-500 text-white px-2 rounded-md py-1"
            >
              Sign In
            </button>
          )}
        </div>

        <button
          onClick={() =>
            setOpenModal({
              open: true,
              type: ModalType.ARTICLE,
              postType: PostType.ARTICLE,
            })
          }
        >
          <RiMore2Line size="24" className="text-gray-500 md:hidden" />
        </button>
      </header>
      <header
        style={{ backgroundColor: initHeader ? "transparent" : "" }}
        className={`hidden md:flex md:bg-white dark:bg-slate-900  dark:border-gray-700 px-4 py-4 items-center  justify-between border-gray-200 fixed w-full top-0 md:left-0 z-[3] ${
          initHeader ? "" : "shadow"
        }`}
      >
        <ProgressBar />
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={() => {
              onBack && onBack();
              router.back();
            }}
          >
            <BiChevronLeft size="30" className="text-blue-500 scale-125" />
          </button>
          <button
            onClick={() =>
              !uid
                ? setOpenModal({
                    open: true,
                    type: ModalType.FORCE_LOGIN,
                    postType: PostType.ARTICLE,
                  })
                : router.push("/me")
            }
          >
            <Text immutable color="text-gray-600">
              {authorName.slice(0, 13) + (authorName.length > 13 ? "..." : "")}
            </Text>
          </button>
          {uid != null ? (
            uid !== userId && (
              <button
                className="pl-6"
                onClick={() =>
                  follow({
                    variables: {
                      type: userId,
                    },
                  })
                }
              >
                {myProfile && myProfile.me.follow.includes(userId) ? (
                  <AiOutlineUserDelete
                    size="30"
                    className="bg-blue-500 text-white rounded-full border p-1 border-blue-500"
                  />
                ) : (
                  <AiOutlineUserAdd
                    size="30"
                    className="text-blue-500 rounded-full border p-1 border-blue-500"
                  />
                )}
              </button>
            )
          ) : (
            <button
              onClick={() => router.replace("/access/login")}
              className="bg-blue-500 text-white px-2 rounded-md py-1"
            >
              Sign In
            </button>
          )}
        </div>

        <button
          onClick={() =>
            setOpenModal({
              open: true,
              type: ModalType.ARTICLE,
              postType: PostType.ARTICLE,
            })
          }
        >
          <RiMore2Line size="24" className="text-gray-500 md:hidden" />
        </button>
        <Image
          onClick={() => router.push("/home")}
          src={getiverseLogo}
          alt="getiverse logo"
          className="w-40 ml-2 hidden md:block"
        />
        <div className="w-full md:flex justify-center hidden pr-28">
          <div className="w-full max-w-xl">
            <CustomInput
              value=""
              padding="py-3 pl-3 pr-2 hidden md:block"
              width="full"
              height="h-10"
              placeHolder="Search on  Getiverse"
              onChange={(e) => router.push("/search")}
              Icon={<CgClose size={17} className="text-gray-100" />}
            />
          </div>
        </div>
        {uid ? (
          <Avatar
            onClick={() =>
              !uid
                ? setOpenModal({
                    open: true,
                    type: ModalType.FORCE_LOGIN,
                    postType: PostType.ARTICLE,
                  })
                : userId != uid
                ? router.push(
                    "/author/@" + myProfile?.me.userName + "?id=" + uid
                  )
                : router.push("/me")
            }
            className="hidden md:block"
            src={myProfile?.me.profileImage}
          />
        ) : (
          <div className="hidden"></div>
        )}
      </header>
    </div>
  );
}

function Footer({
  initHeader = false,
  className,
  id,
  title,
  userId,
  ratingAverage,
}: {
  initHeader: boolean;
  className: string;
  id: string | undefined;
  title: string | undefined;
  userId: string | undefined;
  ratingAverage: string | number;
}) {
  const router = useRouter();
  const [openMoreModal, setOpenMoreModal] = useRecoilState(moreModal);
  const uid = useUid();
  const [openModal, setOpenModal] = useRecoilState(moreModal);

  return (
    <div className={className}>
      {/**Mobile */}
      <div
        className={`md:hidden fixed bottom-0 md:left-0 w-full bg-white dark:bg-slate-900 dark:border-gray-700 flex items-center py-4 justify-between px-5 border-t-2 border-gray-200`}
      >
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center justify-center mb-1">
            <AiFillStar
              size={26}
              className="text-gray-300 dark:text-slate-500 hover:text-blue-500 cursor-pointer"
              onClick={() =>
                uid
                  ? router.push(
                      "/rating/" +
                        title +
                        "?postId=" +
                        id +
                        "&type=" +
                        PostType.ARTICLE +
                        "&userId=" +
                        userId +
                        "&isOutside=false"
                    )
                  : setOpenModal({
                      open: true,
                      type: ModalType.FORCE_LOGIN,
                      postType: PostType.ARTICLE,
                    })
              }
            />
            <Text
              size="text-xs"
              weight="font-thin"
              color="text-blue-500"
              disableDark
              className="absolute bottom-1"
            >
              {ratingAverage}
            </Text>
          </div>
          <RiSendPlaneFill
            className={`hover:text-blue-400 cursor-pointer ${
              openMoreModal.type == ModalType.SHARE && openMoreModal.open
                ? "text-blue-500"
                : "text-gray-300 dark:text-slate-500"
            }`}
            onClick={() =>
              setOpenMoreModal((prev) => ({
                ...prev,
                type: ModalType.SHARE,
                open: true,
                postType: PostType.ARTICLE,
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
              type: uid ? ModalType.SAVE_TO : ModalType.FORCE_LOGIN,
              postId: id,
              open: true,
              postType: PostType.ARTICLE,
            }))
          }
          className={`hover:text-blue-400 cursor-pointer text-gray-300 dark:text-slate-500`}
          size={21}
        />
      </div>
      {/**Desktop */}
      <div
        className={`hidden fixed bottom-0 md:left-0 w-full bg-white dark:bg-slate-900 dark:border-gray-700 ${
          initHeader ? "" : "md:flex"
        } items-center py-4 justify-around px-32 xl:px-96 border-t-2 border-gray-200`}
      >
        <div className="flex flex-col items-center justify-center mb-1">
          <AiFillStar
            size={26}
            className="text-gray-300 dark:text-slate-500 hover:text-blue-500 cursor-pointer"
            onClick={() =>
              uid
                ? router.push(
                    "/rating/" +
                      title +
                      "?postId=" +
                      id +
                      "&type=" +
                      PostType.ARTICLE +
                      "&userId=" +
                      userId +
                      "&isOutside=false"
                  )
                : setOpenModal({
                    open: true,
                    type: ModalType.FORCE_LOGIN,
                    postType: PostType.ARTICLE,
                  })
            }
          />
          <Text
            size="text-xs"
            weight="font-thin"
            color="text-blue-500"
            disableDark
            className="absolute bottom-1"
          >
            {ratingAverage}
          </Text>
        </div>
        <RiSendPlaneFill
          className={`hover:text-blue-400 cursor-pointer ${
            openMoreModal.type == ModalType.SHARE && openMoreModal.open
              ? "text-blue-500"
              : "text-gray-300 dark:text-slate-500"
          }`}
          onClick={() =>
            setOpenMoreModal((prev) => ({
              ...prev,
              type: ModalType.SHARE,
              open: true,
              postType: PostType.ARTICLE,
              url: process.env.NEXT_PUBLIC_HOST + "/article/" + id,
            }))
          }
          size={26}
        />
        <BsFillBookmarkFill
          onClick={() =>
            setOpenMoreModal((prev) => ({
              ...prev,
              type: uid ? ModalType.SAVE_TO : ModalType.FORCE_LOGIN,
              postId: id,
              open: true,
              postType: PostType.ARTICLE,
            }))
          }
          className={`hover:text-blue-400 cursor-pointer text-gray-300 dark:text-slate-500`}
          size={21}
        />
      </div>
    </div>
  );
}

function ScrollSpyButton({ content }: { content: any | undefined }) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  if (!content) return <></>;
  return getIndexIds(content).length > 0 ? (
    <button
      className={`fixed -left-5 top-1/2 -translate-y-1/2 rounded-full ${
        openModal.open && openModal.type === ModalType.INDEX
          ? "bg-blue-500"
          : "bg-white dark:bg-slate-800"
      } p-2 shadow-lg`}
      onClick={() => {
        setOpenModal((prev) => ({
          ...prev,
          open: true,
          type: ModalType.INDEX,
        }));
      }}
    >
      <BiMenu
        size="25"
        className={`ml-3 ${
          openModal.open && openModal.type === ModalType.INDEX
            ? "text-white"
            : "text-gray-500 dark:text-gray-500"
        }`}
      />
    </button>
  ) : (
    <></>
  );
}

function ProgressBar() {
  const [indicator, setIndicator] = useState(0);

  const scroller = () => {
    var element = document.documentElement,
      top = element.scrollTop || document.body.scrollTop,
      height = element.scrollHeight || document.body.scrollHeight;
    var calculate = (top / (height - element.clientHeight)) * 100;
    setIndicator(calculate);
  };
  useEffect(() => {
    if (typeof window == "undefined") return;
    window.addEventListener("scroll", scroller);
    return () => window.removeEventListener("scroll", scroller);
  });

  return indicator > 5 ? (
    <div className="w-full h-1 bg-blue-200 dark:bg-slate-800 bottom-0 absolute left-0">
      <div
        style={{ width: indicator + "%" }}
        className={`h-1 bg-blue-600 rounded-r-xl`}
      />
    </div>
  ) : (
    <></>
  );
}

function SimilarArticle({
  authorSrc,
  authorName,
  title,
  imageSrc,
}: {
  authorSrc: string;
  authorName: string;
  title: string;
  imageSrc: string;
}) {
  return (
    <div className="w-full border-b rounded-xl p-3 flex items-center my-3 shadow-sm border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900">
      <div className="h-full flex-1 mr-2">
        <span className="flex items-center space-x-2">
          <Avatar height="h-8" width="w-8" src={authorSrc} />
          <Text color="text-gray-700" size="text-md" weight="font-bold">
            {authorName}
          </Text>
        </span>
        <Text size="text-xl" color="text-gray-600" className="py-1">
          {title}
        </Text>
      </div>
      <Image src={imageSrc} alt="image" className="w-20 h-20 rounded-2xl" />
    </div>
  );
}

function ImageZoom() {
  const [zoomImage, setZoomImage] = useRecoilState(zoomImageState);

  return (
    <div className="fixed w-full h-full left-0 top-0 z-[100] bg-slate-900">
      <div className="relative w-full h-full flex flex-col justify-center items-center">
        <button onClick={() => setZoomImage(null)}>
          <AiOutlineClose
            size="30"
            className="absolute text-white right-5 top-5"
          />
        </button>
        <div>
          <TransformWrapper>
            <TransformComponent>
              <div className="relative w-screen h-96 m-auto md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px] xl:h-[800px] xl:w-[800px]">
                <ImageVideo muted={false} src={handleImageType(zoomImage)} />
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>
    </div>
  );
}
