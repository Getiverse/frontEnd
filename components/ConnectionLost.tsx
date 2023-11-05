import { GrArticle } from "react-icons/gr";
import { RiArticleLine, RiSignalWifiOffLine } from "react-icons/ri";
import Button from "./buttons/Button";
import Text from "./Text";
import Title from "./Title";

function ConnectionLost() {
  return (
    <div className="bg-gray-100 dark:bg-gray-950 h-full w-full flex flex-col items-center">
      <RiSignalWifiOffLine size={100} className="text-blue-500 mt-12" />
      <div className="w-20 rounded-full h-20 bg-blue-100 dark:bg-blue-800 scale-y-[30%]"/>
      <Title size="text-4xl" weight="font-bold" className="px-8 text-center">Connection Lost</Title>
      <Text size="text-lg" className="px-8 text-center my-4">
        looks like your connectiono is interrupted. Hit refresh and try again or
        read your offline articles
      </Text>
      <div className="w-44 mt-4">
        <Button
          type="primary"
          text="Try Again"
          onClick={() => console.log("cippa")}
        />
      </div>
      <div className="flex items-center mb-4 mt-6 px-8 w-full">
        <hr className="w-full mr-3 border-gray-300 dark:border-gray-700 border-t" />
        <p className="text-gray-500 dark:text-gray-600 font-medium mb-1">Or</p>
        <hr className="w-full ml-3 border-gray-300 dark:border-gray-700 border-t" />
      </div>
      <button className="w-44 py-2 bg-white border px-4 border-blue-500 flex text-blue-500 text-xl items-center rounded-md">
        <RiArticleLine
          className="mr-5 text-blue-500"
          size={30}
        />
        Offline
      </button>
    </div>
  );
}
export default ConnectionLost;
