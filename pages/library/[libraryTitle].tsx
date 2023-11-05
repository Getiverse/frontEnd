import { useMutation, useQuery } from "@apollo/client";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import empty from "/public/emptyLibrary.png";
import Container from "../../components/container/Container";
import InstantList from "../../components/instants/InstantsList";
import Header from "../../components/logged_in/layout/Header";
import RoutingGuard from "../../components/RoutingGuard";
import SearchFilter from "../../components/SearchFIlterComponents/SearchFilter";
import ModifyLibraryModal from "../../components/specialModals/ModifyLibraryModal";
import SearchFilterModal from "../../components/specialModals/SearchFilterModal";
import Text from "../../components/Text";
import Title from "../../components/Title";
import { ModalType } from "../../components/types/Modal";
import CustomInput from "../../components/input/CustomInput";
import { IoIosArrowBack } from "react-icons/io";
import { BiSave } from "react-icons/bi";
import { REMOVE_LIBRARY, UPDATE_LIBRARY } from "../../graphql/mutation/me";
import { useRecoilState, useRecoilValue } from "recoil";
import { FIND_LIBRARY_BY_ID } from "../../graphql/query/library";
import ConfirmModal from "../../components/specialModals/ConfirmModal";
import { moreModal } from "../../utils/atoms/moreModal";
import ArticlesList from "../../components/articles/ArticlesList";
import TextSkeleton from "../../components/skeletons/TextSkeleton";
import useUid from "../../hooks/useUid";
import useLibraryArticleFetch from "../../hooks/library/useLibraryArticleFetch";
import useLibraryInstantFetch from "../../hooks/library/useLibraryInstantFetch";
import Loading from "../../components/Loading";
import { handleImageType } from "../../utils/functions";
import PostModals from "../../components/specialModals/PostModals";
import { GET_MY_LIBRARIES } from "../../graphql/query/me";
import { LIBRARY_PAGEABLE_SIZE } from "../../utils/constants";
import { toast } from "react-toastify";

const Library: NextPage = () => {
  const router = useRouter();
  const [filterCategories, setFilterCategories] = useState([]);
  // const [selectedValues, setSelectedValues] = useState({
  //   type: "All",
  //   sortBy: "Relevance",
  //   date: "Any Time",
  // });

  const libraryId = router.query.id as string;
  const isEditable = /^true$/i.test(router.query.editable as string);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const {
    loading: loadingCurrentLibrary,
    error,
    data: currentLibrary,
    refetch: refetchLibrary,
  } = useQuery<FIND_LIBRARY_BY_ID>(FIND_LIBRARY_BY_ID, {
    variables: {
      skip: !libraryId,
      type: libraryId,
    },
  });

  const [updateLibrary] = useMutation(UPDATE_LIBRARY, {
    update: async (cache, { data, errors }) => {
      const cachedLibraries = await cache.readQuery<FIND_LIBRARY_BY_ID>({
        query: FIND_LIBRARY_BY_ID,
        variables: {
          type: libraryId,
        },
      });

      const myLibrariesCached = await cache.readQuery<GET_MY_LIBRARIES>({
        query: GET_MY_LIBRARIES,
        variables: {
          type: {
            page: 0,
            size: LIBRARY_PAGEABLE_SIZE,
          },
        },
      });

      if (cachedLibraries?.findLibraryById && data && myLibrariesCached) {
        await cache.writeQuery({
          query: FIND_LIBRARY_BY_ID,
          variables: {
            type: libraryId,
          },
          data: {
            findLibraryById: {
              ...cachedLibraries.findLibraryById,
              isPrivate:
                currentLibrary && currentLibrary?.findLibraryById
                  ? currentLibrary.findLibraryById.isPrivate
                  : false,
              title: title,
              description: description,
              id: libraryId,
            },
          },
        });
        const tempData = [
          ...myLibrariesCached?.getMyLibraries.data.map((val) =>
            val.id == libraryId
              ? {
                  ...val,
                  title: title,
                  description: description,
                }
              : val
          ),
        ];
        await cache.writeQuery({
          query: GET_MY_LIBRARIES,
          variables: {
            type: {
              page: 0,
              size: LIBRARY_PAGEABLE_SIZE,
            },
          },
          data: {
            getMyLibraries: {
              count: myLibrariesCached?.getMyLibraries.count,
              data: [...tempData],
            },
          },
        });
        toast.success("Library Updated successfull");
        router.replace(
          `/library/${router.query.libraryTitle}?id=${router.query.id}`,
          undefined,
          { shallow: true }
        );
      }
    },
  });
  const uid = useUid();

  // const [modal, setModal] = useRecoilState(moreModal);

  const {
    loadMoreArticles,
    articles,
    loadingArticles,
    articlesCount,
    articlePage,
    refetchArticles,
  } = useLibraryArticleFetch();

  const {
    loadMoreInstants,
    instants,
    loadingInstants,
    instantsCount,
    instantPage,
    refetchInstants,
  } = useLibraryInstantFetch();

  useEffect(() => {
    if (
      currentLibrary?.findLibraryById &&
      !loadingCurrentLibrary &&
      title != currentLibrary.findLibraryById.title
    ) {
      setTitle(currentLibrary.findLibraryById.title);
      setDescription(currentLibrary.findLibraryById.description);
    }
  }, [currentLibrary]);

  function updateLibraryElements() {
    if (currentLibrary && currentLibrary.findLibraryById) {
      updateLibrary({
        variables: {
          type: {
            isPrivate:
              currentLibrary && currentLibrary?.findLibraryById
                ? currentLibrary.findLibraryById.isPrivate
                : false,
            title: title,
            description: description,
            id: libraryId,
          },
        },
      });
    } else {
      toast.error("We encounter an error please retry");
    }
  }

  return (
    <RoutingGuard>
      <PostModals />
      <ConfirmModal text="Are you Sure to continue? The Library will be permanently deleted" />
      {/* <SearchFilterModal
        filterCategories={filterCategories}
        setFilterCategories={setFilterCategories}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
      /> */}
      <ModifyLibraryModal />
      <Container bg="bg-[#E4E5F1]">
        {isEditable ? (
          <div className="flex w-full justify-between bg-transparent pt-4 px-3 fixed top-0 z-50">
            <IoIosArrowBack
              onClick={() => router.back()}
              size={28}
              className="bg-gray-500 bg-opacity-30 backdrop-blur-lg drop-shadow-lg text-white rounded-full p-1 active:bg-blue-500"
            />
            <BiSave
              size={35}
              className="bg-gray-500 bg-opacity-30 backdrop-blur-lg drop-shadow-lg text-white rounded-full p-1.5 active:bg-blue-500"
              onClick={() => updateLibraryElements()}
            />
          </div>
        ) : (
          currentLibrary?.findLibraryById && (
            <Header
              hideMore={uid !== currentLibrary?.findLibraryById.userId}
              modalType={ModalType.MODIFY_LIBRARY_MODAL}
              instants={true}
            />
          )
        )}
        <div className="w-full h-96 relative">
          {!loadingCurrentLibrary && (
            <Image
              fill
              className="object-cover object-center"
              alt="library image"
              src={
                currentLibrary?.findLibraryById &&
                currentLibrary?.findLibraryById.image
                  ? handleImageType(currentLibrary.findLibraryById.image)
                  : empty
              }
            />
          )}
          <div
            className={`absolute w-full h-full bg-gradient-to-b ${
              isEditable ? "from-black" : "from-transparent"
            } via-black to-black ${
              isEditable ? "opacity-50" : "opacity-40"
            } z-10`}
          />
          <div className="absolute left-4 top-20 z-20">
            {isEditable ? (
              <CustomInput
                onChange={(e) => setTitle(e.currentTarget.value)}
                transparent={true}
                disableDark={true}
                value={title}
                height="h-8"
                rounded={false}
                className=""
                textColor="text-gray-400 focus:text-blue-400"
                maxLength={25}
                placeHolder="Enter Library Title"
                border="border-b border-gray-400 focus:border-blue-400"
              />
            ) : loadingCurrentLibrary ? (
              <TextSkeleton width="w-20" height="h-5" />
            ) : (
              <Title size="text-4xl" color="text-white">
                {currentLibrary?.findLibraryById
                  ? currentLibrary.findLibraryById.title
                  : ""}
              </Title>
            )}
            {loadingCurrentLibrary ? (
              <TextSkeleton height="h-3" width="w-32" className="mt-5" />
            ) : (
              <div className="flex mt-3 z-20 space-x-1 items-center">
                <Text size="text-md" color="text-gray-50">
                  {currentLibrary?.findLibraryById
                    ? currentLibrary?.findLibraryById.articles.length
                    : 0}{" "}
                  article
                </Text>
                <span className="w-1 h-1 rounded-full bg-white" />
                <Text size="text-md" color="text-gray-50">
                  {currentLibrary?.findLibraryById
                    ? currentLibrary?.findLibraryById.instants.length
                    : 0}{" "}
                  instants
                </Text>
              </div>
            )}
          </div>
          <div className="absolute bottom-6 px-4 w-full z-20">
            <div
              className={`p-4 bg-gray-300 w-full  rounded-xl bg-opacity-30 backdrop-blur-xl drop-shadow-lg ${
                loadingCurrentLibrary ? "animate-pulse" : ""
              }`}
            >
              {isEditable ? (
                <CustomInput
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  transparent={true}
                  disableDark={true}
                  value={description}
                  height="h-8"
                  rounded={false}
                  className=""
                  textColor="text-gray-400 focus:text-blue-400"
                  placeHolder="Enter Library Description"
                  border="border-b border-gray-400 focus:border-blue-400"
                />
              ) : (
                <Text size="text-sm" color="text-white">
                  {!loadingCurrentLibrary && currentLibrary?.findLibraryById
                    ? currentLibrary.findLibraryById.description
                    : ""}
                </Text>
              )}
            </div>
          </div>
        </div>
        {/* <SearchFilter
          selectedType={selectedValues.type}
          filterCategories={filterCategories}
          setFilterCategories={setFilterCategories}
        /> */}
        <div className="bg-white dark:bg-slate-900 w-full h-6 border-b border-gray-300 dark:border-gray-700 shadow px-4"></div>
        {!loadingCurrentLibrary ? (
          <main className="flex flex-col w-full h-full">
            <ArticlesList
              isDeletable={isEditable}
              articles={articles}
              count={articlesCount ? articlesCount : 0}
              loadMore={loadMoreArticles}
              loading={loadingArticles}
            />
            <InstantList
              isEditable={isEditable}
              specialFetch="library"
              page={instantPage ? instantPage : 0}
              instants={instants ? instants : []}
              count={instantsCount ? instantsCount : 0}
              loadMore={loadMoreInstants}
              loading={loadingInstants}
            />
          </main>
        ) : (
          <Loading />
        )}
      </Container>
    </RoutingGuard>
  );
};

export default Library;
