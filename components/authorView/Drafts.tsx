import { BsChevronDown } from "react-icons/bs";
import InstantList from "../instants/InstantsList";
import PopularPostsList from "../PopularArticlesList";
import Post from "../articles/Article";
import SuggestedAuthors from "../SuggestedAuthors";
import Text from "../Text";

function Drafts() {
  return (
    <>
      <Text
        className="underline pb-5 pl-5 underline-offset-8 mt-12"
        weight="font-semibold"
        color="text-gray-500"
      >
        Recent Posts
      </Text>
      <div className="flex flex-col items-center space-y-4 mt-2 mb-4">
        {/* {POSTS.map(({ author, ...props }, idx) => (
          <Post isSketch={true} author={author} key={idx} {...props} />
        ))} */}
        <BsChevronDown size="30" className="text-gray-500" />
      </div>
      {/* <InstantList className="pb-12" /> */}
      <div className="mb-12" />
    </>
  );
}

export default Drafts;
