import Text from "./Text";
import Avatar from "./Avatar";
import Button from "./buttons/Button";

function SuggestedAuthors() {
  return (
    <div className="mt-8">
      <Text
        className="underline pb-5 pl-5 underline-offset-8"
        weight="font-semibold"
        color="text-gray-500"
      >
        Treding Post
      </Text>
      <div className="flex w-full bg-white dark:bg-slate-900 border-y border-gray-300 dark:border-gray-700 py-8 px-5 space-x-12 overflow-x-scroll scrollbar-hide">
        {/* {SUGGESTED_AUTHORS.map((props, idx) => <Author {...props} key={idx} />)} */}
      </div>
    </div>
  );
}
export default SuggestedAuthors;

const Author = ({
  src,
  authorName,
  followers,
}: {
  src: string;
  authorName: string;
  followers: number;
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Avatar width="w-24" height="h-24" src={src} />
      <Text
        weight="font-semibold"
        color="text-gray-500"
        size="text-lg"
        className="mt-1"
      >
        {authorName}
      </Text>
      <Text color="text-gray-500" className="mb-3" size="text-sm">
        {followers} followers
      </Text>
      <Button
        text="Follow"
        onClick={() => console.log("cippa Lippa")}
        className="w-24"
        type="primary"
        padding="py-2"
      />
    </div>
  );
};
