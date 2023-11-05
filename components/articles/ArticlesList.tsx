import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { GraphqlArticle } from "../../graphql/types/article";
import Article from "./Article";
import { getHiddenPosts } from "../../inMemoryData/utils/hiddenPosts";
import { PostType } from "../../graphql/types/enums";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../../graphql/query/me";
import ArticleSkeleton from "../skeletons/ArticleSkeleton";
import LoadingBlock from "../LoadingBlock";

function ArticlesList({
  articles,
  isEditable = false,
  isDeletable = false,
  loading,
  count,
  loadMore,
}: {
  articles: GraphqlArticle[] | undefined;
  isEditable?: boolean;
  count: number;
  isDeletable?: boolean;
  loading: boolean;
  loadMore: () => void;
}) {
  // const [hiddenPosts, setHiddenPosts] = useState<string[]>([]);

  // const { data: blockedUsers } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(
  //   GET_MY_PROFILE_PRIMARY_STATS
  // );

  const loadMoreItems = async () => {
    if (articles != undefined && !loading && articles.length < count)
      await loadMore();
  };

  // useEffect(() => {
  //   async function getHidden() {
  //     const hiddenPosts = await getHiddenPosts();
  //     if (!hiddenPosts) return;
  //     const serializeHiddenPosts: { postId: string; postType: PostType }[] =
  //       JSON.parse(hiddenPosts);
  //     let result = [];
  //     for (let i = 0; i < serializeHiddenPosts.length; i++) {
  //       if (serializeHiddenPosts[i].postType === PostType.ARTICLE) {
  //         result.push(serializeHiddenPosts[i].postId);
  //       }
  //     }
  //     setHiddenPosts(result);
  //   }
  //   getHidden();
  // }, []);

  return (
    <div className="px-6 mt-5 pb-5 space-y-4 flex flex-col items-center">
      {articles != undefined &&
        articles.map(({ ...props }) => (
          <Article isDeletable={isDeletable} key={props.id} {...props} />
        ))}
      {loading && <ArticleSkeleton />}
      {!loading && articles != undefined && articles.length < count && (
        <BsChevronDown
          size="30"
          className="text-gray-500"
          onClick={() =>
            !loading &&
            articles != undefined &&
            articles.length < count &&
            loadMoreItems()
          }
        />
      )}
      {loading && <LoadingBlock />}

      {/* <ArticleAds
        style="display:block"
        data-ad-format="fluid"
        data-ad-layout-key="-5z+cg+0-3c+i6"
        data-ad-client="ca-pub-6977289759712746"
        data-ad-slot="1422204715"
      /> */}
    </div>
  );
}

export default ArticlesList;
