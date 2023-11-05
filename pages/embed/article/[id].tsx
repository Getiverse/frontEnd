import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { GraphqlCategory } from "../../../graphql/types/category";
import {
  getArticleById,
  getCategories,
  getUserById,
  PublicArticle,
  User,
} from "../../../utils/fetch/public/query";
import { extractTextFromContent } from "../../../utils/functions";

function ArticleEmbed() {
  const [publicArticleData, setPublicArticleData] = useState<PublicArticle>();
  const [author, setAuthor] = useState<User>();
  const [categoriesData, setCategoriesData] = useState<GraphqlCategory[]>();
  const router = useRouter();
  const idArticle = router.query.id as string;
  const isDark = router.query.dark === "true";
  const [loading, setLoading] = useState(true);

  function getColor() {
    const colors = [
      "bg-blue-400",
      "bg-green-400",
      "bg-red-400",
      "bg-pink-400",
      "bg-slate-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  useEffect(() => {
    async function fetchData() {
      if (idArticle) {
        getArticleById(idArticle).then((val) => setPublicArticleData(val));
      }
      if (idArticle) getCategories().then((val) => setCategoriesData(val));
    }
    fetchData();
  }, [idArticle]);

  useEffect(() => {
    if (publicArticleData && publicArticleData?.userId)
      getUserById(publicArticleData?.userId).then((val) => {
        setAuthor(val);
        setLoading(false);
      });
  }, [publicArticleData]);

  return (
    <article className="w-full h-screen bg-transparent">
      <LoadingSpinner open={loading} />
      {!loading && (
        <Link
          target={"_blank"}
          href={process.env.NEXT_PUBLIC_HOST + "/article/" + idArticle}
          className={`h-full ${
            isDark ? "bg-gray-900" : "bg-white dark:bg-gray-900"
          }  flex flex-col pb-4`}
        >
          <img
            src={publicArticleData?.image}
            alt="article image"
            className="w-full max-h-48 object-cover"
          />
          <div
            className={`${
              isDark ? "text-white" : " text-gray-500 dark:text-white"
            } py-3 space-y-2 px-4 h-full`}
          >
            <span
              className={`${getColor()} py-1 px-3 text-white text-sm rounded-2xl`}
            >
              {categoriesData &&
                publicArticleData &&
                categoriesData.filter(
                  (category) => category.id == publicArticleData?.categories[0]
                )[0].name}
            </span>
            <h4 className="font-bold text-3xl">
              {publicArticleData?.title.slice(0, 30)}
              {publicArticleData &&
                publicArticleData?.title.length > 30 &&
                "..."}
            </h4>
            <p>
              {publicArticleData?.content &&
                extractTextFromContent(
                  JSON.parse(publicArticleData?.content)
                ).slice(0, 65)}
              {publicArticleData?.content &&
                extractTextFromContent(JSON.parse(publicArticleData?.content))
                  .length > 65 &&
                "..."}
            </p>
          </div>
          <div className="flex justify-between w-full px-4">
            <div className="flex items-center space-x-2">
              <img
                src={author?.profileImage}
                alt="user profile image"
                className="rounded-full w-9 h-9 object-cover"
              />
              <div
                className={
                  isDark ? "text-white" : "text-gray-500 dark:text-white"
                }
              >
                <h5 className="font-bold leading-none text-xs">
                  {author?.userName}
                </h5>
                <small className="font-light leading-none text-xs">
                  {publicArticleData &&
                    new Date(publicArticleData?.createdAt).toLocaleString(
                      "default",
                      {
                        month: "long",
                        day: "2-digit",
                      }
                    )}
                </small>
              </div>
            </div>
            <Link
              target={"_blank"}
              href={process.env.NEXT_PUBLIC_HOST + "/access/login"}
              className={`border hover:bg-gray-950 ${
                isDark
                  ? "border-gray-700 text-white"
                  : "text-gray-500 border-gray-300 dark:border-gray-700 dark:text-white"
              } px-2 text-sm rounded-xl flex items-center font-bold`}
            >
              <Image
                src="/icons/getiverse.svg"
                width={19}
                height={16}
                alt="getiverse logo"
                className="mr-2"
              />
              Subscribe
            </Link>
          </div>
        </Link>
      )}
    </article>
  );
}

export default ArticleEmbed;
