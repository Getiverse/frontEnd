import { NextPage } from "next";
import { useEffect, useState } from "react";
import BackUpButton from "../../components/BackUpButton";
import Container from "../../components/container/Container";
import FilterHeader from "../../components/FilterHeader";
import FollowedAuthorsList from "../../components/FollowedAuthorsList";
import InstantList from "../../components/instants/InstantsList";
import Header from "../../components/logged_in/layout/Header";
import TabBar from "../../components/logged_in/layout/TabBar";
import { useRouter } from "next/router";
import Text from "../../components/Text";
import { FILTERS } from "../../utils/constants";
import RoutingGuard from "../../components/RoutingGuard";
import { useQuery } from "@apollo/client";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../../graphql/query/me";
import PostModals from "../../components/specialModals/PostModals";
import WriteModal from "../../components/specialModals/WriteModal";
import ArticlesList from "../../components/articles/ArticlesList";
import useAuthorArticleFetch from "../../hooks/home/author/useAuthorArticleFetch";
import useAuthorInstantFetch from "../../hooks/home/author/useAuthorInstantFetch";

const Author: NextPage = () => {
  const [scrollY, setscrollY] = useState(0);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const router = useRouter();
  const authorName = router.query.authorName as string;
  const authorId = router.query.id;
  const {
    loadMoreArticles,
    articles,
    loadingArticles,
    articlesCount,
    refetchArticles,
  } = useAuthorArticleFetch();

  const {
    loadMoreInstants,
    instants,
    loadingInstants,
    instantsCount,
    instantPage,
    refetchInstants,
  } = useAuthorInstantFetch();

  useEffect(() => {
    if (scrollY > prevScrollY && showHeader) {
      setShowHeader(false);
    } else if (scrollY < prevScrollY && !showHeader) {
      setShowHeader(true);
    }
    setPrevScrollY(scrollY);
  }, [scrollY]);

  const { data: authors, loading: authorsLoading } =
    useQuery<GET_MY_PROFILE_PRIMARY_STATS>(GET_MY_PROFILE_PRIMARY_STATS);

  return (
    <RoutingGuard>
      <PostModals />
      <WriteModal />
      <Container bg="bg-[#E4E5F1]">
        <div className="flex flex-col w-full h-screen">
          <Header
            href="/home"
            label={
              authorName.length > 13
                ? authorName.slice(0, 13) + "..."
                : authorName
            }
          />
          <main
            onScroll={(e) => setscrollY(e.currentTarget.scrollTop)}
            className="flex-1 overflow-y-scroll scrollbar-hide"
          >
            <FollowedAuthorsList />
            {/* <FilterHeader filters={FILTERS} /> */}
            <button
              onClick={() =>
                router.push("/author/" + "@" + authorName + "?id=" + authorId)
              }
            >
              <Text
                color="text-blue-500"
                disableDark
                size="text-sm"
                className="cursor-pointer my-4 w-full text-right px-4"
              >
                View Profile
              </Text>
            </button>
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
            {authors && authors?.me.follow.length > 0 && (
              <BackUpButton show={showHeader} hrefId="authors" />
            )}
          </main>
          <TabBar />
        </div>
      </Container>
    </RoutingGuard>
  );
  {
    /*</RoutingGuard>*/
  }
};

export default Author;
