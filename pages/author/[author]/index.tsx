import { NextPage } from "next";
import userFlip from "public/user-bg-flip.jpg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Container from "../../../components/container/Container";
import Header from "../../../components/logged_in/layout/Header";
import Avatar from "../../../components/Avatar";
import Text from "../../../components/Text";
import Image from "next/image";
import { AUTHOR_TABS } from "../../../utils/constants";
import Tabs from "../../../components/Tabs";
import { FaExchangeAlt } from "react-icons/fa";
import RoutingGuard from "../../../components/RoutingGuard";
import { useMutation, useQuery } from "@apollo/client";
import {
  FIND_USER_PROFILE_BY_ID,
  GET_USER_POST_RATINGS_STARS,
  GET_USER_POST_VIEWS,
} from "../../../graphql/query/author";
import { handleImageType } from "../../../utils/functions";
import Button from "../../../components/buttons/Button";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../../../graphql/query/me";
import PostModals from "../../../components/specialModals/PostModals";
import useFollow from "../../../hooks/mutation/useFollow";

const Author: NextPage = () => {
  const router = useRouter();
  const authorName = router.query.author as string;
  const authorId = router.query.id as string;

  return (
    <RoutingGuard>
      <PostModals />
      <Container bg="bg-[#E4E5F1] dark:bg-gray-950">
        <Header label={authorName} instants={true} />
        <main className="bg-[#51525e] dark:bg-gray-950">
          <ProfileBanner authorName={authorName} userId={authorId} />
          <Tabs tabs={AUTHOR_TABS} />
        </main>
      </Container>
    </RoutingGuard>
  );
};

export default Author;

function ProfileBanner({
  userId,
  authorName,
}: {
  userId: string;
  authorName: string;
}) {
  const [flip, setFlip] = useState(false);
  const router = useRouter();

  const { data, refetch, loading } = useQuery<FIND_USER_PROFILE_BY_ID>(
    FIND_USER_PROFILE_BY_ID,
    {
      variables: {
        skip: !userId,
        type: userId,
      },
    }
  );
  const { data: views } = useQuery<GET_USER_POST_VIEWS>(GET_USER_POST_VIEWS, {
    variables: {
      skip: !userId,
      type: userId,
    },
  });

  const { data: ratings } = useQuery<GET_USER_POST_RATINGS_STARS>(
    GET_USER_POST_RATINGS_STARS,
    {
      variables: {
        skip: !userId,
        type: userId,
      },
    }
  );
  const { data: me } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(
    GET_MY_PROFILE_PRIMARY_STATS
  );
  const follow = useFollow(userId, authorName, data?.findUserById.profileImage);

  // useEffect(() => {
  //   if (!data?.findUserById.profileImage) {
  //     refetch({
  //       variables: {
  //         type: userId,
  //       },
  //     });
  //   }
  // }, [data]);

  if (loading) return <div className="w-full relative h-72 bg-gray-800"></div>;

  return (
    <div className="w-full relative h-72">
      <div
        className={`absolute top-0 left-0 w-full h-full z-[3] ${
          flip ? "my-rotate-y-180" : ""
        } duration-1000 perspective preserve-3d backface-hidden`}
      >
        <div className="absolute w-full h-full bg-black opacity-20 z-[1]" />
        <div className="w-full h-full flex flex-col justify-center items-center">
          {data?.findUserById.backgroundImage && (
            <Image
              src={handleImageType(data?.findUserById.backgroundImage)}
              fill
              className="object-cover backface-hidden"
              alt="user background"
            />
          )}
          <div className="absolute flex flex-col w-full items-center justify-center top-2 z-[2]">
            <div className="absolute top-8">
              <div className="relative">
                <Avatar
                  width="w-20"
                  height="h-20"
                  src={data?.findUserById.profileImage}
                />
                {/* <FaExchangeAlt
                  size={19}
                  onClick={() => setFlip(true)}
                  className="absolute text-white -right-5 bottom-2 cursor-pointer"
                /> */}
              </div>
            </div>
            <Text
              color="text-white"
              weight="font-semibold"
              className="top-32 absolute"
            >
              {authorName}
            </Text>
          </div>
          <div className="absolute flex w-full justify-around z-[2] top-44">
            <div className="flex flex-col items-center justify-center backface-hidden">
              <Text size="text-xl" color="text-white">
                {data
                  ? data?.findUserById.numberOfArticles +
                    data?.findUserById.numberOfInstants
                  : 0}
              </Text>
              <Text
                size="text-sm"
                color="text-white"
                className="w-16 text-center"
              >
                Posts
              </Text>
            </div>
            <button
              onClick={() =>
                router.push(authorName + "/following" + "?id=" + userId)
              }
              className="flex flex-col items-center justify-center"
            >
              <Text size="text-xl" color="text-white">
                {data?.findUserById.follow.length}
              </Text>
              <Text
                size="text-sm"
                className="w-16 text-center"
                color="text-white"
              >
                Following
              </Text>
            </button>
            <button
              onClick={() =>
                router.push(authorName + "/followers" + "?id=" + userId)
              }
              className="flex flex-col items-center justify-center"
            >
              <Text size="text-xl" color="text-white">
                {data?.findUserById.followers.length}
              </Text>
              <Text
                size="text-sm"
                color="text-white"
                className="w-16 text-center"
              >
                Followers
              </Text>
            </button>
          </div>
          <Button
            onClick={() =>
              follow({
                variables: {
                  type: userId,
                },
              })
            }
            type="primary"
            color={
              me?.me.follow.includes(userId) ? "bg-blue-600" : "bg-blue-500"
            }
            text={me?.me.follow.includes(userId) ? "Unfollow" : "Follow"}
            className={`w-32 absolute bottom-3 z-[3] opacity-80`}
            padding="py-2"
          />
        </div>
      </div>
      {/* <div
        className={`absolute top-0 left-0 w-full h-full ${
          flip ? "my-rotate-y-180 opacity-100" : "opacity-0"
        } duration-1000 perspective preserve-3d`}
      >
        <div className="absolute w-full h-full bg-black opacity-20 z-10" />
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Image
            src={userFlip}
            fill
            className="object-cover my-rotate-y-180"
            alt="user background"
          />
          <div className="absolute flex flex-col w-full items-center justify-center top-2 z-20 my-rotate-y-180">
            <div className="absolute top-8">
              <div className="relative">
                <Avatar
                  width="w-20"
                  height="h-20"
                  src={data?.findUserById.profileImage}
                />
                <FaExchangeAlt
                  size={19}
                  onClick={() => setFlip(false)}
                  className="absolute text-white -right-5 bottom-2 cursor-pointer"
                />
              </div>
            </div>
            <Text
              color="text-white"
              weight="font-semibold"
              className="top-32 absolute"
            >
              {authorName}
            </Text>
          </div>
          <div className="absolute flex w-full justify-around z-20 top-48 my-rotate-y-180">
            <div className="flex flex-col items-center justify-center backface-hidden">
              <Text size="text-xl" color="text-white">
                {views?.getUserPostViews ? views.getUserPostViews : 0}
              </Text>
              <Text
                size="text-xs"
                color="text-white"
                className="w-16 text-center"
              >
                Post Views
              </Text>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Text size="text-xl" color="text-white">
                {ratings && getRatingAverage(ratings?.getUserPostsRating.stars)}
              </Text>
              <Text
                size="text-xs"
                className="w-16 text-center"
                color="text-white"
              >
                Average Rating
              </Text>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Text size="text-xl" color="text-white">
                {ratings?.getUserPostsRating.stars
                  ? ratings?.getUserPostsRating?.stars?.length
                  : 0}
              </Text>
              <Text
                size="text-xs"
                color="text-white"
                className="w-16 text-center"
              >
                Comments Received
              </Text>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

function getRatingAverage(ratings: number[]) {
  let sum = 0;
  if (ratings === undefined || ratings.length > 0) {
    return 0;
  }
  for (let i = 0; i < ratings.length; i++) {
    sum += ratings[i];
  }
  return sum / ratings.length;
}
