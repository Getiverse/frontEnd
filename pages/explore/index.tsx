import { useQuery } from "@apollo/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import ArticlesList from "../../components/articles/ArticlesList";
import BackUpButton from "../../components/BackUpButton";
import Category from "../../components/Category";
import Container from "../../components/container/Container";
import InstantList from "../../components/instants/InstantsList";
import Header from "../../components/logged_in/layout/Header";
import TabBar from "../../components/logged_in/layout/TabBar";
import RoutingGuard from "../../components/RoutingGuard";
import Spinner from "../../components/skeletons/Spinner";
import PostModals from "../../components/specialModals/PostModals";
import WriteModal from "../../components/specialModals/WriteModal";
import Text from "../../components/Text";
import { useRecoilState } from "recoil";
import { GET_MY_SELECTED_CATEGORIES } from "../../graphql/query/me";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { delay } from "../../utils/functions";
import { filterByCategoryState } from "../../utils/atoms/filterByCategory";
import useExploreInstantFetch from "../../hooks/explore/useExploreInstantFetch";
import useExploreArticleFetch from "../../hooks/explore/useExploreArticleFetch";

const Explore: NextPage = () => {
  const [filterByCategory, setFilterByCategory] = useRecoilState(
    filterByCategoryState
  );
  const [showBackUpButton, setshowBackUpButton] = useState(false);
  const router = useRouter();
  const { data: categories, refetch: refetchCategories } =
    useQuery<GET_MY_SELECTED_CATEGORIES>(GET_MY_SELECTED_CATEGORIES);

  const {
    loadMoreInstants,
    instants,
    loadingInstants,
    instantsCount,
    instantPage,
    refetchInstants,
  } = useExploreInstantFetch();

  const {
    loadMoreArticles,
    articles,
    loadingArticles,
    articlesCount,
    refetchArticles,
  } = useExploreArticleFetch();

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y && currPos.y < -200;
      if (isShow !== showBackUpButton) {
        setshowBackUpButton(isShow);
      }
    },
    [showBackUpButton],
    null,
    false,
    300
  );

  async function handleRefresh() {
    await delay(500);
    refetchArticles({
      variables: {
        skip: !filterByCategory,
        type: filterByCategory,
      },
    });
    refetchInstants({
      variables: {
        skip: !filterByCategory,
        type: filterByCategory,
      },
    });
  }

  return (
    <RoutingGuard>
      <PostModals />
      <WriteModal />
      <Container bg="bg-[#E4E5F1]">
        <Header />
        <main className="flex-1">
          <div className="relative w-full border-black mt-5" id="categories">
            <div className="flex ml-14 w-[100%-32px] overflow-x-scroll scrollbar-hide space-x-4">
              {categories?.getCategories?.map(({ name, image, id }) => (
                <Category
                  category={name}
                  Icon={image}
                  id={id}
                  key={id}
                  selectedCategories={filterByCategory}
                  setSelectedCategories={setFilterByCategory}
                  filter={true}
                />
              ))}
            </div>
            <button
              onClick={() =>
                router.push({
                  pathname: "/categories",
                  query: { rollback: true },
                })
              }
              className="bg-blue-500 shadow-2xl text-3xl py-1 px-4 rounded-r-3xl text-white absolute left-0 bottom-0"
            >
              +
            </button>
          </div>
          <PullToRefresh
            className="text-blue-500"
            refreshingContent={<Spinner />}
            onRefresh={handleRefresh}
          >
            <Fragment>
              <Text
                className="underline pl-5 pt-12 underline-offset-8"
                weight="font-semibold"
                color="text-gray-500"
              >
                All Posts
              </Text>
              <ArticlesList
                articles={articles}
                count={articlesCount ? articlesCount : 0}
                loadMore={loadMoreArticles}
                loading={loadingArticles}
              />
              <InstantList
                page={instantPage}
                instants={instants ? instants : []}
                count={instantsCount ? instantsCount : 0}
                loadMore={loadMoreInstants}
                loading={loadingInstants}
              />
            </Fragment>
          </PullToRefresh>
          <BackUpButton show={showBackUpButton} hrefId="categories" />
        </main>
        <TabBar />
      </Container>
    </RoutingGuard>
  );
};

export default Explore;
