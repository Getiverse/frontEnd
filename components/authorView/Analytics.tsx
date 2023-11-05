import { useRouter } from "next/router";
import { BiChevronDown } from "react-icons/bi";
import AnalyticRating from "../AnalyticRating";
import Text from "../Text";

function Analytics() {
  const router = useRouter();
  const authorId = router.query.id as string;
  return (
    <>
      <AnalyticRating />
      <div className="w-full flex flex-col items-center justify-center mt-5 space-y-1">
        <Text size="text-md">See All Reviews</Text>
        <BiChevronDown
          onClick={() => router.push("See_All_Reviews?" + "id=" + authorId)}
          className="text-gray-500"
          size={30}
        />
      </div>
    </>
  );
}

export default Analytics;
