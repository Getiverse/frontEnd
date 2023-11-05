import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import BackUpButton from "../../components/BackUpButton";
import Container from "../../components/container/Container";
import FilterHeader from "../../components/FilterHeader";
import FollowedAuthorsList from "../../components/FollowedAuthorsList";
import InstantList from "../../components/instants/InstantsList";
import Header from "../../components/logged_in/layout/Header";
import TabBar from "../../components/logged_in/layout/TabBar";
import { moreModal } from "../../utils/atoms/moreModal";
import { ModalType } from "../../components/types/Modal";
import WriteModal from "../../components/specialModals/WriteModal";
import PostModals from "../../components/specialModals/PostModals";
import { FILTERS } from "../../utils/constants";
import { useQuery } from "@apollo/client";
import { checkInternetConnection, delay } from "../../utils/functions";
import ConnectionLost from "../../components/ConnectionLost";
import RoutingGuard from "../../components/RoutingGuard";
import { GET_MY_FOLLOW_USER_ID } from "../../graphql/query/me";

import { GET_ALL_CATEGORIES } from "../../graphql/query/category";
import { GraphqlCategory } from "../../graphql/types/category";
import ArticlesList from "../../components/articles/ArticlesList";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import PullToRefresh from "react-simple-pull-to-refresh";
import Spinner from "../../components/skeletons/Spinner";
import useHomeArticlesFetch from "../../hooks/home/index/useHomeArticlesFetch";
import useHomeInstantsFetch from "../../hooks/home/index/useHomeInstantsFetch";
import "react-spring-bottom-sheet/dist/style.css";
import { BottomSheet } from "react-spring-bottom-sheet";
import Button from "../../components/buttons/Button";
import Sidebar from "../../components/desktop/Sidebar";
import Layout from "../../components/container/Layout";

const Home: NextPage = () => {
  const [showBackUpButton, setshowBackUpButton] = useState(false);
  const [modal, setModal] = useRecoilState(moreModal);
  const [open, setOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const { data: me } = useQuery<GET_MY_FOLLOW_USER_ID>(GET_MY_FOLLOW_USER_ID);

  const {
    loadMoreArticles,
    articles,
    loadingArticles,
    articlesCount,
    refetchArticles,
  } = useHomeArticlesFetch();

  const {
    loadMoreInstants,
    instants,
    loadingInstants,
    instantsCount,
    instantPage,
    refetchInstants,
  } = useHomeInstantsFetch();

  const [areCategoriesSavedInMemory, setAreCategoriesSavedInMemory] =
    useState(true);
  const { loading: loadingCategories, data: allCategories } = useQuery<{
    findAllCategories: GraphqlCategory[];
  }>(GET_ALL_CATEGORIES, {
    skip: areCategoriesSavedInMemory,
  });

  useEffect(() => {
    async function handleInternetConnection() {
      setIsConnected(await checkInternetConnection());
    }
    handleInternetConnection();
  }, []);

  const followsId = me?.me.follow;

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

  useEffect(() => {
    setModal((prev) => ({ ...prev, type: ModalType.MORE }));
  }, []);

  async function handleRefresh() {
    await delay(500);
    refetchArticles({
      variables: {
        skip: followsId?.length == 0,
        type: followsId,
      },
    });
    refetchInstants({
      variables: {
        skip: followsId?.length == 0,
        type: followsId,
      },
    });
    // refetchAuthors();
  }

  return (
    <RoutingGuard>
      <Layout>
        <Sidebar />
        <Container showSidebarAndHeader>
          <PostModals />
          <WriteModal />
          <Header />
          {isConnected ? (
            <main className="bg-[#E4E5F1] dark:bg-gray-950">
              {followsId && followsId.length > 0 && <FollowedAuthorsList />}
              {/* <FilterHeader filters={FILTERS} /> */}
              {/* <PullToRefresh
              className="text-blue-500"
              refreshingContent={<Spinner />}
              onRefresh={handleRefresh}
            > */}
              {/* <Fragment> */}
              <ArticlesList
                articles={articles}
                count={articlesCount ? articlesCount : 0}
                loadMore={loadMoreArticles}
                loading={loadingArticles}
              />
              <InstantList
                page={instantPage ? instantPage : 0}
                instants={instants ? instants : []}
                count={instantsCount ? instantsCount : 0}
                loadMore={loadMoreInstants}
                loading={loadingInstants}
              />
              {/* </Fragment> */}
              {/* </PullToRefresh> */}
              {followsId && followsId.length > 0 && (
                <BackUpButton show={showBackUpButton} hrefId="authors" />
              )}
            </main>
          ) : (
            <ConnectionLost />
          )}
          <TabBar />
        </Container>
      </Layout>
    </RoutingGuard>
  );
};

export default Home;
