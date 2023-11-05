import { NextPage } from "next";
import userFlip from "public/user-bg-flip.jpg";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import ConfirmModal from "../../components/specialModals/ConfirmModal";
import PostModals from "../../components/specialModals/PostModals";
import MyProfileModal from "../../components/specialModals/MyProfileModal";
import Container from "../../components/container/Container";
import Header from "../../components/logged_in/layout/Header";
import { ModalType } from "../../components/types/Modal";
import Tabs from "../../components/Tabs";
import { ME_TABS } from "../../utils/constants";
import Text from "../../components/Text";
import Avatar from "../../components/Avatar";
import RoutingGuard from "../../components/RoutingGuard";
import {
  GET_MY_POST_VIEWS,
  GET_MY_PROFILE_PRIMARY_STATS,
  GET_MY_RATING_STARS,
} from "../../graphql/query/me";
import { useQuery } from "@apollo/client";
import { handleImageType } from "../../utils/functions";
import LoadingSpinner from "../../components/LoadingSpinner";

const Me: NextPage = () => {
  return (
    <RoutingGuard>
      {/* <ConfirmModal text="This post will be deleted immediatly." /> */}
      <PostModals />
      <ConfirmModal text="Once deleted your post will not be available anymore" />
      <MyProfileModal />
      <Container bg="bg-[#E4E5F1]">
        <Header instants={true} modalType={ModalType.MY_PROFILE} />
        <main>
          <ProfileBanner />
          <Tabs tabs={ME_TABS} />
        </main>
      </Container>
    </RoutingGuard>
  );
};

export default Me;

function ProfileBanner() {
  const [flip, setFlip] = useState(false);
  const router = useRouter();
  const { data: me, loading } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(
    GET_MY_PROFILE_PRIMARY_STATS
  );

  const { data: ratings, loading: ratingsLoading } =
    useQuery<GET_MY_RATING_STARS>(GET_MY_RATING_STARS);

  const { data: views, loading: viewsLoading } =
    useQuery<GET_MY_POST_VIEWS>(GET_MY_POST_VIEWS);

  if (ratingsLoading || viewsLoading || loading)
    return <LoadingSpinner open={true} />;

  return (
    <div className="w-full relative h-72">
      <div
        className={`absolute top-0 left-0 w-full h-full z-[3] ${
          flip ? "my-rotate-y-180" : ""
        } duration-1000 perspective preserve-3d backface-hidden`}
      >
        <div className="absolute w-full h-full bg-black opacity-20 z-[1]" />
        <div className="w-full h-full flex flex-col justify-center items-center">
          {me?.me.backgroundImage && (
            <Image
              src={handleImageType(me?.me.backgroundImage)}
              fill
              className="object-cover backface-hidden"
              alt="user background"
            />
          )}
          <div className="absolute flex flex-col w-full items-center justify-center top-2 z-[2]">
            <div className="absolute top-8">
              <div className="relative">
                <Avatar width="w-20" height="h-20" src={me?.me.profileImage} />
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
              @{me?.me.userName}
            </Text>
          </div>
          <div className="absolute flex w-full justify-around z-[2] top-48">
            <div className="flex flex-col items-center justify-center backface-hidden">
              <Text size="text-xl" color="text-white">
                {me && me.me.numberOfArticles && me?.me.numberOfInstants
                  ? me?.me.numberOfArticles + me?.me.numberOfInstants
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
              onClick={() => router.push("me/following")}
              className="flex flex-col items-center justify-center"
            >
              <Text size="text-xl" color="text-white">
                {me ? me?.me.follow.length : 0}
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
              onClick={() => router.push("me/followers")}
              className="flex flex-col items-center justify-center"
            >
              <Text size="text-xl" color="text-white">
                {me ? me?.me.followers.length : 0}
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
                <Avatar width="w-20" height="h-20" src={me?.me.profileImage} />
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
              {me?.me.userName}
            </Text>
          </div>
          <div className="absolute flex w-full justify-around z-20 top-48 my-rotate-y-180">
            <div className="flex flex-col items-center justify-center backface-hidden">
              <Text size="text-xl" color="text-white">
                {views?.getPostViews ? views.getPostViews : 0}
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
                {ratings && getRatingAverage(ratings?.getRating.stars)}
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
                {ratings && ratings.getRating?.stars?.length
                  ? ratings?.getRating?.stars?.length
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
