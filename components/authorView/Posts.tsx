import { Fragment } from "react";
import useProfileArticleFetch from "../../hooks/useProfileArticleFetch";
import useProfileInstantFetch from "../../hooks/useProfileInstantFetch";
import ArticlesList from "../articles/ArticlesList";
import InstantList from "../instants/InstantsList";
import Text from "../Text";

/**
 * Posts is used for Me and Author
 */
function Posts() {
  const { loadMoreArticles, articles, loadingArticles, articlesCount } =
    useProfileArticleFetch();
  const {
    loadMoreInstants,
    instants,
    loadingInstants,
    instantsCount,
    instantPage,
  } = useProfileInstantFetch();

  if (loadingArticles || loadingInstants) return <></>;

  return (
    <>
      {/* <PopularPostsList /> */}
      {articles && articles?.length > 0 && (
        <Fragment>
          <Text
            className="underline pb-2 pl-5 underline-offset-8 mt-12"
            weight="font-semibold"
            color="text-gray-500"
          >
            Recent Posts
          </Text>
          <ArticlesList
            loading={loadingArticles}
            loadMore={loadMoreArticles}
            count={articlesCount ? articlesCount : 0}
            articles={articles}
          />
        </Fragment>
      )}
      <InstantList
        loading={loadingInstants}
        page={instantPage}
        specialFetch="profile"
        loadMore={loadMoreInstants}
        count={instantsCount ? instantsCount : 0}
        instants={instants ? instants : []}
      />
      {/* <SuggestedAuthors /> */}
    </>
  );
}

export default Posts;
