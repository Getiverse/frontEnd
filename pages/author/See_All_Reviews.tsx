import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { BsStarFill } from "react-icons/bs";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilValue } from "recoil";
import Avatar from "../../components/Avatar";
import Container from "../../components/container/Container";
import DropDown from "../../components/DropDown";
import FilterHeader from "../../components/FilterHeader";
import RatingComponent from "../../components/Rating";
import RoutingGuard from "../../components/RoutingGuard";
import Text from "../../components/Text";
import { GET_ARTICLES_BY_USER_ID } from "../../graphql/query/article";
import { FIND_USER_PROFILE_BY_ID } from "../../graphql/query/author";
import { GET_INSTANTS_BY_USER_ID } from "../../graphql/query/instant";
import { FIND_RATINGS_BY_POST_ID } from "../../graphql/query/rating";
import { PostType } from "../../graphql/types/enums";
import { selectedFilter } from "../../utils/atoms/selectedFilter";
import { RATING_FILTERS } from "../../utils/constants";

function SeeAllReviews() {
  const filter = useRecoilValue(selectedFilter);
  const router = useRouter();
  const userId = router.query.id as string;
  const [activeFilter, setActiveFilter] = useState("Most Relevant");
  const {
    data: user,
    refetch,
    loading,
  } = useQuery<FIND_USER_PROFILE_BY_ID>(FIND_USER_PROFILE_BY_ID, {
    variables: {
      skip: !userId,
      type: userId,
    },
  });
  const { data: articles } = useQuery<GET_ARTICLES_BY_USER_ID>(
    GET_ARTICLES_BY_USER_ID,
    {
      variables: {
        skip: !userId,
        type: userId,
      },
    }
  );
  const { data: instants } = useQuery<GET_INSTANTS_BY_USER_ID>(
    GET_INSTANTS_BY_USER_ID,
    {
      variables: {
        skip: !userId,
        type: userId,
      },
    }
  );
  return (
    <RoutingGuard>
      <Container bg="bg-white bg-white dark:bg-gray-950">
        <div className="bg-white dark:bg-slate-900 border-b dark:border-gray-700 shadow w-full py-3 px-5 flex items-center sticky top-0 z-50">
          <IoIosArrowBack
            size="28"
            className="text-gray-500"
            onClick={() => router.back()}
          />
          <div className="flex-1 pl-10 flex items-center space-x-4">
            <Avatar
              width="w-10"
              height="h-10"
              src={user?.findUserById.profileImage}
            />
            <div>
              <Text
                weight="font-medium"
                size="text-lg"
                className="leading-none"
              >
                {user?.findUserById.userName}
              </Text>
              {articles && instants && (
                <Text className="leading-1" size="text-sm">
                  {articles?.getArticlesByUserId.count +
                    instants?.getInstantsByUserId.count +
                    " "}
                  ratings
                </Text>
              )}
            </div>
          </div>
        </div>
        <main className="bg-white dark:bg-gray-950 pb-2 h-full">
          <div className="py-1 border-b dark:border-gray-700">
            <FilterHeader filters={RATING_FILTERS} />
          </div>
          <div className="flex w-full justify-between px-4 py-4 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center space-x-1 text-gray-600">
              {/^-?\d+$/.test(filter) && (
                <AiFillStar size="20" className="pr-1" />
              )}
              <Text color="text-gray-600" size="text-md" weight="font-medium">
                {filter ? filter : RATING_FILTERS[0]}
              </Text>
            </div>
            <DropDown
              active={activeFilter}
              setActive={setActiveFilter}
              items={["Most Relevant", "Most Recent"]}
              Icon={HiMenuAlt2}
            />
          </div>
          <div className="px-5">
            {/* {articles?.getArticlesByUserId.data.map((props) => (
              <RatingsPerArticle
                title={props.title}
                date={props.createdAt}
                ratingAverage={props.ratingAverage}
                uid={props.userId}
                postId={props.id}
                postType={PostType.ARTICLE}
              />
            ))}
            {instants?.getInstantsByUserId.data.map((props) => (
              <RatingsPerArticle
                title={props.title}
                date={props.createdAt}
                ratingAverage={props.ratingAverage}
                uid={props.userId}
                postId={props.id}
                postType={PostType.INSTANT}
              />
            ))} */}
          </div>
        </main>
      </Container>
    </RoutingGuard>
  );
}
function RatingsPerArticle({
  title,
  date,
  ratingAverage,
  postId,
  postType,
  uid,
}: {
  title: string;
  date: string;
  ratingAverage: number;
  uid: string;
  postType: PostType;
  postId: string;
}) {
  const { data: ratings } = useQuery<FIND_RATINGS_BY_POST_ID>(
    FIND_RATINGS_BY_POST_ID,
    {
      variables: {
        postId: postId,
        postType: postType,
      },
    }
  );

  return (
    <div className="my-5">
      <div className="px-2 mb-5">
        <Text size="text-3xl" weight="text-bold" color="text-gray-700">
          {title}
        </Text>
        <div className="my-4 flex w-full justify-between items-center">
          <span className="flex items-center space-x-1">
            <BsStarFill className="text-yellow-500" size={15} />
            <Text color="text-yellow-500" size="text-xs" weight="font-thin">
              {ratingAverage}
            </Text>
          </span>
          <Text size="text-xs">{date}</Text>
        </div>
      </div>
      {ratings?.findRatingsByPostId.data.map((props) => (
        <RatingComponent isActive {...props} />
      ))}
      <BiChevronDown className="text-gray-500 mx-auto mt-3" size={40} />
    </div>
  );
}

export default SeeAllReviews;
