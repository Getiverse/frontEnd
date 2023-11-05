import { NextPage } from "next";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useState } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { BiMicrophone, BiSearch } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilState, useRecoilValue } from "recoil";
import ArticlesList from "../components/articles/ArticlesList";
import Button from "../components/buttons/Button";
import Container from "../components/container/Container";
import FilterHeader from "../components/FilterHeader";
import CustomInput from "../components/input/CustomInput";
import Instant from "../components/Instant";
import InstantList from "../components/instants/InstantsList";
import RoutingGuard from "../components/RoutingGuard";
import HistorySearch from "../components/search/HistorySearch";
import SuggestedSearch from "../components/search/SuggestedSearch";
import PostModals from "../components/specialModals/PostModals";
import Title from "../components/Title";
import { GraphqlArticle } from "../graphql/types/article";
import { GraphqlInstant } from "../graphql/types/instant";
import { selectedFilter } from "../utils/atoms/selectedFilter";
import { searchQuery, SearchType, User } from "../utils/fetch/public/query";
import { checkIfAlreadyFollowed, delay } from "../utils/functions";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList as List } from "react-window";
import RecomandedAuthor from "../components/RecomandedAuthor";
import { GET_MY_FOLLOW_USER_ID } from "../graphql/query/me";
import { useQuery } from "@apollo/client";
import AvatarSkeleton from "../components/skeletons/AvatarSkeleton";
import TextSkeleton from "../components/skeletons/TextSkeleton";
import LoadingSpinner from "../components/LoadingSpinner";
import useUid from "../hooks/useUid";

const Search: NextPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const uid = useUid();
  const [articles, setArticles] = useState<{
    content: GraphqlArticle[];
    numberOfElements: number;
  }>({
    content: [],
    numberOfElements: 0,
  });
  const [users, setUsers] = useState<{
    content: User[];
    numberOfElements: number;
  }>({
    content: [],
    numberOfElements: 0,
  });

  const [instants, setInstants] = useState<{
    content: GraphqlInstant[];
    numberOfElements: number;
  }>({
    content: [],
    numberOfElements: 0,
  });
  const [prevSearch, setPrevSearch] = useState("");
  const [articlePage, setArticlePage] = useState({
    page: 0,
    size: 3,
  });
  const [instantPage, setInstantPage] = useState({
    page: 0,
    size: 3,
  });
  const [userPage, setUserPage] = useState({
    page: 0,
    size: 3,
  });
  const { data: authors, loading: authorsLoading } =
    useQuery<GET_MY_FOLLOW_USER_ID>(GET_MY_FOLLOW_USER_ID);
  const filter = useRecoilValue(selectedFilter);

  useEffect(() => {
    async function handleFetch() {
      await delay(500);
      if (search != "" && prevSearch != search) {
        if (filter == "Articles") {
          setLoading(true);
          const data = await searchQuery({
            name: search,
            page: articlePage,
            searchType: SearchType.ARTICLE,
          });
          setArticles(data);
          setLoading(false);
          setArticlePage({ size: 3, page: 0 });
        } else if (filter == "Instants") {
          setLoading(true);
          const data = await searchQuery({
            name: search,
            page: instantPage,
            searchType: SearchType.INSTANT,
          });
          setInstants(data);
          setLoading(false);
          setInstantPage({ size: 3, page: 0 });
        } else if (filter == "Users") {
          setLoading(true);
          const data = await searchQuery({
            name: search,
            page: userPage,
            searchType: SearchType.USER,
          });
          setUsers(data);
          setLoading(false);
          setUserPage({ size: 3, page: 0 });
        }
      }
      setPrevSearch(search);
    }
    handleFetch();
  }, [filter, search]);

  useEffect(() => {
    if (
      uid != undefined &&
      users.content.findIndex((user) => user.id == uid) >= 0
    ) {
      setUsers((prev) => ({
        ...prev,
        content: [...prev.content.filter((val) => val.id != uid)],
      }));
    }
  }, [users]);

  async function loadMore() {
    if (filter == "Articles") {
      await delay(500);
      setLoading(true);
      const data = await searchQuery({
        name: search,
        page: {
          size: articlePage.size,
          page: articlePage.page + 1,
        },
        searchType: SearchType.ARTICLE,
      });
      setLoading(false);
      setArticles((prev) => ({
        content: [...prev.content, ...data.content],
        numberOfElements: data.numberOfElements,
      }));
      setArticlePage((prev) => ({ ...prev, page: prev.page + 1 }));
    } else if (filter == "Instants") {
      await delay(500);
      setLoading(true);
      const data = await searchQuery({
        name: search,
        page: {
          size: instantPage.size,
          page: instantPage.page + 1,
        },
        searchType: SearchType.INSTANT,
      });
      setLoading(false);
      setInstants((prev) => ({
        content: [...prev.content, ...data.content],
        numberOfElements: data.numberOfElements,
      }));
      setInstantPage((prev) => ({ ...prev, page: prev.page + 1 }));
    } else if (filter == "Users") {
      setUserPage((prev) => ({ ...prev, page: prev.page + 1 }));
      await delay(500);
      setLoading(true);
      const data = await searchQuery({
        name: search,
        page: {
          size: userPage.size,
          page: userPage.page + 1,
        },
        searchType: SearchType.USER,
      });
      setLoading(false);
      setUsers((prev) => ({
        content: [...prev.content, ...data.content],
        numberOfElements: data.numberOfElements,
      }));
    }
  }
  const isItemLoaded = (index: number) =>
    users != null && index < users.content.length;

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    return users.content[index] != null && users.content[index] != undefined ? (
      <RecomandedAuthor
        style={style}
        isFollowed={checkIfAlreadyFollowed(
          authors?.me.follow,
          users.content[index].id
        )}
        key={users.content[index].id}
        id={users.content[index].id}
        src={users.content[index].profileImage}
        alt="profile image"
        author={users.content[index].userName}
        bio={users.content[index].bio}
      />
    ) : (
      <div className="flex items-center w-full justify-between" style={style}>
        <AvatarSkeleton height="h-10" width="w-10" />
        <div className="space-y-3">
          <TextSkeleton height="h-3" width="w-16" />
          <TextSkeleton height="h-2" width="w-40" />
        </div>
        <TextSkeleton height="h-8" className="rounded-xl" width="w-20" />
      </div>
    );
  };
  return (
    <RoutingGuard>
      <Container bg="bg-white">
        <LoadingSpinner open={loading} />
        <PostModals />
        <div className="flex flex-col w-full h-screen">
          <div className="flex items-center bg-white dark:bg-slate-900 px-3 py-4 w-full max-w-lg justify-between border-b border-gray-300 dark:border-gray-700">
            <IoIosArrowBack
              onClick={() => router.back()}
              size={28}
              className="text-gray-400"
            />
            <div className="mx-3 flex-1">
              <CustomInput
                padding="py-3 pl-3 pr-10"
                width="full"
                height="h-10"
                placeHolder="Search on  Getiverse"
                onChange={(e) => setSearch(e.currentTarget.value)}
                value={search}
                onIconClick={() => {
                  setSearch("");
                  setPrevSearch("");
                  setUsers({
                    content: [],
                    numberOfElements: 0,
                  });
                  setInstants({
                    content: [],
                    numberOfElements: 0,
                  });
                  setArticles({
                    content: [],
                    numberOfElements: 0,
                  });
                  setInstantPage({ size: 3, page: 0 });
                  setUserPage({ size: 3, page: 0 });
                  setArticlePage({ size: 3, page: 0 });
                }}
                Icon={<CgClose size={17} className="text-gray-300" />}
              />
            </div>
          </div>
          <main className="flex-1 overflow-y-scroll scrollbar-hide">
            <FilterHeader filters={["Articles", "Instants", "Users"]} />
            {filter == "Articles"
              ? articles != null &&
                articles.content != null && (
                  <ArticlesList
                    loadMore={loadMore}
                    loading={false}
                    articles={articles.content}
                    count={articles.numberOfElements}
                  />
                )
              : filter == "Instants"
              ? instants != null &&
                instants.content && (
                  <InstantList
                    page={instantPage.page}
                    loadMore={loadMore}
                    loading={false}
                    instants={instants.content}
                    count={instants.numberOfElements}
                  />
                )
              : users != null &&
                users.content && (
                  <div className="px-5 h-[calc(100%-100px)] w-full">
                    <AutoSizer>
                      {({
                        height,
                        width,
                      }: {
                        height: number;
                        width: number;
                      }) => (
                        <InfiniteLoader
                          isItemLoaded={isItemLoaded}
                          itemCount={
                            users.content.findIndex((user) => user.id == uid) >=
                            0
                              ? users.numberOfElements - 1
                              : users.numberOfElements
                          }
                          loadMoreItems={loadMore}
                        >
                          {({ onItemsRendered, ref }) => (
                            <List
                              className="List my-2 scrollbar-hide"
                              height={height}
                              itemCount={
                                users.content.findIndex(
                                  (user) => user.id == uid
                                ) >= 0
                                  ? users.numberOfElements - 1
                                  : users.numberOfElements
                              }
                              itemSize={62}
                              onItemsRendered={onItemsRendered}
                              ref={ref}
                              width={width}
                            >
                              {Row}
                            </List>
                          )}
                        </InfiniteLoader>
                      )}
                    </AutoSizer>
                  </div>
                )}
          </main>
        </div>
      </Container>
    </RoutingGuard>
  );
};

export default Search;
