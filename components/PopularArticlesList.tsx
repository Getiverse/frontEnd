import Text from "./Text";
import PopularPost from "./PopularArticle";
import { useState } from "react";
import { Article } from "./types/Article";

const POPULAR_POSTS: Article[] = [];

function PopularArticlesList() {
  const [scrollIndex, setScrollIndex] = useState(0);
  function handleScroll(leftScroll: number, clientWidth: number) {
    if (leftScroll < clientWidth * 0.8) {
      setScrollIndex(1);
    } else if (leftScroll < clientWidth * 2 * 0.8) {
      setScrollIndex(2);
    } else if (leftScroll < clientWidth * 3 * 0.8) {
      setScrollIndex(3);
    } else if (leftScroll < clientWidth * 4 * 0.8) {
      setScrollIndex(4);
    } else if (leftScroll < clientWidth * 5 * 0.9) {
      setScrollIndex(5);
    } else if (leftScroll < clientWidth * 6 * 0.9) {
      setScrollIndex(6);
    } else if (leftScroll < clientWidth * 7 * 0.9) {
      setScrollIndex(7);
    } else if (leftScroll < clientWidth * 8 * 0.9) {
      setScrollIndex(8);
    } else if (leftScroll < clientWidth * 9 * 0.9) {
      setScrollIndex(9);
    } else {
      setScrollIndex(10);
    }
  }

  return (
    <div className="mt-8">
      <Text
        className="underline pb-5 pl-5 underline-offset-8"
        weight="font-semibold"
        color="text-gray-500"
      >
        Treding Post
      </Text>
      <div className="pl-3">
        <div
          onScroll={({ currentTarget }) =>
            handleScroll(currentTarget.scrollLeft, currentTarget.clientWidth)
          }
          className="flex w-full px-2 overflow-x-scroll scrollbar-hide space-x-4 snap-x snap-mandatory "
        >
          {POPULAR_POSTS.map(({ author, ...props }, idx) => (
            <PopularPost author={author} key={idx} {...props} />
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="flex self-center space-x-1 mt-2 ">
          {POPULAR_POSTS.map((value, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 ${
                scrollIndex == idx + 1
                  ? "bg-blue-500"
                  : "bg-gray-50 dark:bg-gray-900"
              } rounded-full`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default PopularArticlesList;
