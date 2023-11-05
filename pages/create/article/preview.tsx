import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Button from "../../../components/buttons/Button";
import Category from "../../../components/Category";
import Container from "../../../components/container/Container";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CreateHeader from "../../../components/logged_in/layout/CreateHeader";
import RoutingGuard from "../../../components/RoutingGuard";
import PostCreationInformation from "../../../components/specialModals/PostCreationInformation";
import PublishModal from "../../../components/specialModals/PublishModal";
import Text from "../../../components/Text";
import Title from "../../../components/Title";
import { ModalType } from "../../../components/types/Modal";
import { Article } from "../../../components/types/Article";
import {
  ADD_ARTICLE,
  UPDATE_ARTICLE,
} from "../../../graphql/mutation/articles";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { createdArticle } from "../../../utils/atoms/createdArticle";
import { moreModal } from "../../../utils/atoms/moreModal";
import {
  calculateReadTime,
  extractTextFromContent,
  getDate,
} from "../../../utils/functions";

import { removeArticle } from "../../../inMemoryData/create/article/article";
import { GraphqlCategory } from "../../../graphql/types/category";
import { GET_ALL_CATEGORIES } from "../../../graphql/query/category";
import { GET_MY_ARTICLES } from "../../../graphql/query/me";
import { ARTICLE_PAGEABLE_PAGE_SIZE } from "../../../utils/constants";
import useUid from "../../../hooks/useUid";
import { toast } from "react-toastify";
import { GET_ARTICLE_BY_ID } from "../../../graphql/query/article";
import Editor from "@/components/plate/editor";

function Preview() {
  const router = useRouter();
  const [article, setArticle] = useRecoilState(createdArticle);
  const uid = useUid();
  const editId = router.query.editId;
  const [updateArticle, { loading: loadingUpdate }] = useMutation<Article>(
    UPDATE_ARTICLE,
    {
      update: async (cache, { data, errors }) => {
        if (errors) {
          toast.error(errors.toString());
          return false;
        }
        const cachedArticles = await cache.readQuery<GET_MY_ARTICLES>({
          query: GET_MY_ARTICLES,
          variables: {
            page: {
              page: 0,
              size: ARTICLE_PAGEABLE_PAGE_SIZE,
            },
          },
        });

        if (cachedArticles && cachedArticles?.getMyArticles && data && uid) {
          await cache.writeQuery({
            query: GET_MY_ARTICLES,
            variables: {
              page: {
                page: 0,
                size: ARTICLE_PAGEABLE_PAGE_SIZE,
              },
            },
            data: {
              getMyArticles: {
                count: cachedArticles.getMyArticles.count,
                data: [
                  ...cachedArticles.getMyArticles.data.map((val) =>
                    val.id == editId
                      ? {
                          ...val,
                          categories: article.categories,
                          image: article.image,
                          content: JSON.stringify(article.content),
                          title: article.title,
                          readTime: calculateReadTime(
                            extractTextFromContent(article.content)
                          ),
                        }
                      : val
                  ),
                ],
              },
            },
          });
        }
        const cachedArticle = await cache.readQuery<GET_ARTICLE_BY_ID>({
          query: GET_ARTICLE_BY_ID,
          variables: {
            type: editId,
          },
        });

        if (cachedArticle)
          await cache.writeQuery({
            query: GET_ARTICLE_BY_ID,
            variables: {
              type: editId,
            },
            data: {
              findArticleById: {
                ...cachedArticle.findArticleById,
                categories: article.categories,
                image: article.image,
                content: JSON.stringify(article.content),
                title: article.title,
                readTime: calculateReadTime(
                  extractTextFromContent(article.content)
                ),
              },
            },
          });

        await removeArticle();
        setArticle({
          categories: [],
          content: [
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ],
          image: "",
          title: "",
        });
        toast.success("Aricle updated with success");
        router.replace("/home");
        router.push("/me");
        // setToast({
        //   open: true,
        //   value: "Articolo creato con successo",
        //   type: ToastStates.SUCCESS,
        // });
      },
    }
  );
  const [addArticle, { data, loading, error }] = useMutation<Article>(
    ADD_ARTICLE,
    {
      update: async (cache, { data, errors }) => {
        if (errors) {
          toast.error(errors.toString());
          return false;
        }
        const cachedArticles = await cache.readQuery<GET_MY_ARTICLES>({
          query: GET_MY_ARTICLES,
          variables: {
            page: {
              page: 0,
              size: ARTICLE_PAGEABLE_PAGE_SIZE,
            },
          },
        });

        let dataArticles = cachedArticles
          ? [...cachedArticles?.getMyArticles.data]
          : [];

        if (
          cachedArticles &&
          cachedArticles?.getMyArticles &&
          data &&
          dataArticles &&
          uid
        ) {
          dataArticles?.unshift({
            userId: uid,
            image: article.image,
            title: article.title,
            createdAt: data.createdAt,
            content: JSON.stringify(article.content),
            ratingSum: 0,
            ratingsNumber: 0,
            categories: article.categories,
            readTime: calculateReadTime(
              extractTextFromContent(article.content)
            ),
            id: data.id,
          });
          await cache.writeQuery({
            query: GET_MY_ARTICLES,
            variables: {
              page: {
                page: 0,
                size: ARTICLE_PAGEABLE_PAGE_SIZE,
              },
            },
            data: {
              getMyArticles: {
                count: cachedArticles.getMyArticles.count + 1,
                data: [...dataArticles],
              },
            },
          });
        } else if (!cachedArticles?.getMyArticles && data) {
          await cache.writeQuery({
            query: GET_MY_ARTICLES,
            variables: {
              page: {
                page: 0,
                size: ARTICLE_PAGEABLE_PAGE_SIZE,
              },
            },
            data: {
              getMyArticles: {
                count: 1,
                data: [
                  {
                    userId: uid,
                    image: article.image,
                    title: article.title,
                    createdAt: data.createdAt,
                    content: JSON.stringify(article.content),
                    ratings: [],
                    categories: article.categories,
                    readTime: calculateReadTime(
                      extractTextFromContent(article.content)
                    ),
                    id: data.id,
                    ratingAverage: 0,
                  },
                ],
              },
            },
          });
        }
        await removeArticle();
        setArticle({
          categories: [],
          content: [
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ],
          image: "",
          title: "",
        });
        toast.success("Aricle created with success");
        router.replace("/home");
        router.push("/me");
        // setToast({
        //   open: true,
        //   value: "Articolo creato con successo",
        //   type: ToastStates.SUCCESS,
        // });
      },
    }
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const {
    loading: loadingCategories,
    data: categoriesInfo,
    refetch,
  } = useQuery<{
    findAllCategories: GraphqlCategory[];
  }>(GET_ALL_CATEGORIES);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => {
    if (showCalendar) {
      setShowCalendar(false);
    }
  });

  return (
    <RoutingGuard>
      <LoadingSpinner open={loading || loadingUpdate} />
      <PublishModal
        mutatePost={
          !loading && !loadingUpdate
            ? editId != undefined
              ? updateArticle
              : addArticle
            : () => null
        }
        post={article}
        isArticle={true}
        setShowCalendar={setShowCalendar}
      />
      <PostCreationInformation text="Preview your instant is complete after you publish the instant it will be visible to all the People on Getiverse" />
      <Container bg="bg-white" className="flex flex-col ">
        <div className="sticky top-0 z-[3] bg-white dark:bg-gray-900 dark:border-gray-700 pb-3 border-b-2 border-gray-300 w-full px-5 shadow">
          <CreateHeader darkBg={false} title="Preview" />
        </div>
        <div className="px-6 w-full h-full overflow-y-scroll scrollbar-hide">
          <Title
            className="mt-6"
            color="text-gray-600"
            weight="font-medium"
            size="text-3xl"
          >
            {article.title}
          </Title>
          <div className="flex items-center w-full justify-between mt-1 mb-3">
            <div className="flex items-center">
              <Text
                className="flex items-center mr-3"
                weight="font-normal"
                color="text-gray-500"
                size="text-xs"
              >
                <span>{getDate()}</span>
                <div
                  style={{ width: 5, height: 5 }}
                  className="inline-block bg-gray-300 rounded-full mx-1"
                />
                <span>
                  {calculateReadTime(extractTextFromContent(article.content))}
                  min read
                </span>
              </Text>
            </div>
            <div className="pb-1 px-2 rounded-xl bg-gray-100 dark:bg-slate-500">
              <Text
                size="text-xs"
                color="text-gray-500"
                className="mt-1"
                weight="font-normal"
              >
                {article.categories.length > 0 &&
                  categoriesInfo?.findAllCategories.filter(
                    (val) => val.id === article.categories[0]
                  )[0].name}
              </Text>
            </div>
          </div>
          {/* <div className="flex space-x-3 items-center my-2">
            <span className="flex items-center space-x-1">
              <BsPlayCircle className="text-blue-500" size="20" />
              <Text
                size="text-sm"
                color="text-blue-500"
                className="mt-1"
                weight="font-normal"
              >
                listen
              </Text>
            </span>
          </div> */}
          <img
            src={article.image}
            className="rounded-xl mb-4 m-auto w-full max-h-64"
            alt="desert"
          />
          <div className="w-full pb-32 flex-1">
            <Editor readOnly />
            <div className="grid grid-flow-dense grid-cols-10 gap-2 w-full mt-4">
              {article.categories.length > 0 &&
                categoriesInfo?.findAllCategories
                  .filter((val) => article.categories.includes(val.id))
                  .map(
                    ({
                      name,
                      id,
                      image,
                    }: {
                      name: string;
                      image: string;
                      id: string;
                    }) => (
                      <Category key={id} Icon={image} category={name} id={id} />
                    )
                  )}
            </div>
          </div>
        </div>
        <div className="w-full max-w-3xl flex justify-around fixed z-[3] py-3 bottom-0 border-t-2 bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-700">
          <button
            disabled={showCalendar}
            onClick={() => router.back()}
            className="w-32 text-gray-500 bg-gray-100 rounded-md px-6 py-2 dark:bg-slate-700 dark:text-white"
          >
            BACK
          </button>
          <Button
            disabled={showCalendar || loading || data != undefined}
            onClick={() =>
              setOpenModal((prev) => ({
                ...prev,
                open: true,
                type: ModalType.PUBLISH,
              }))
            }
            type="primary"
            text={editId != undefined ? "Edit" : "Publish"}
            className="w-32"
          />
        </div>
      </Container>
    </RoutingGuard>
  );
}

export default Preview;
