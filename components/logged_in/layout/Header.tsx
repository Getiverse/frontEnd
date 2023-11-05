import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { IoIosArrowBack, IoMdNotificationsOutline } from "react-icons/io";
import getiverseLogo from "../../../public/getiverse-gradiento-logo.png";
import { useRouter } from "next/router";
import Text from "../../Text";
import { useRecoilState, useRecoilValue } from "recoil";
import { moreModal } from "../../../utils/atoms/moreModal";
import { ModalType } from "../../types/Modal";
import { isIos } from "../../../utils/atoms/isIos";
import Avatar from "../../Avatar";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../../../graphql/query/me";
import { useQuery } from "@apollo/client";
import { PostType } from "../../../graphql/types/enums";
import AvatarSkeleton from "../../skeletons/AvatarSkeleton";
import { useScrollPosition } from "../../../hooks/useScrollPosition";
import { useState } from "react";
import useUid from "../../../hooks/useUid";

function Header({
  instants = false,
  label = "",
  authorId = "",
  postId = "",
  hideIcons = false,
  modalType = ModalType.MORE,
  userImage = "",
  href = "",
  postType,
  hideMore = false,
}: {
  hideIcons?: boolean;
  instants?: boolean;
  label?: string;
  authorId?: string;
  href?: string;
  postId?: string;
  modalType?: ModalType;
  userImage?: string | null;
  postType?: PostType;
  hideMore?: boolean;
}) {
  const router = useRouter();
  const [openMoreModal, setOpenMoreModal] = useRecoilState(moreModal);
  const iosValue = useRecoilValue(isIos);
  const [showBg, setShowBg] = useState(false);
  const myUserId = useUid();
  const {
    data: me,
    loading,
    refetch: refetchDate,
  } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(GET_MY_PROFILE_PRIMARY_STATS, {
    skip: !myUserId,
  });
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y < -50;
      setShowBg(isShow);
    },
    [showBg],
    null,
    false,
    300
  );

  return (
    <div
      className={`z-50 lg:hidden ${
        iosValue ? "pt-8" : ""
      } bg-white dark:bg-slate-900 w-full max-w-3xl sticky top-0`}
    >
      {!instants ? (
        <div
          className={`flex w-full max-w-3xl py-4 border-b shadow border-gray-300 dark:border-gray-700 justify-between`}
        >
          {label ? (
            <div className="pl-4 flex items-center w-full">
              <IoIosArrowBack
                onClick={() => (href ? router.replace(href) : router.back())}
                size={28}
                className="text-gray-500 dark:text-gray-300"
              />
              <Text
                size={`text-md`}
                weight="font-medium"
                className={`${
                  hideIcons ? "text-center w-full pr-8" : "ml-4"
                } whitespace-nowrap`}
              >
                {label}
              </Text>
            </div>
          ) : (
            <Image
              onClick={() => router.push("/home")}
              src={getiverseLogo}
              alt="getiverse logo"
              className="w-32 ml-2"
            />
          )}
          {!hideIcons && (
            <div className="flex space-x-6 justify-end items-center pr-4 w-full max-w-3xl">
              {/* <IoMdNotificationsOutline
                size={26}
                color="#9CA3AF"
                className="cursor-pointer"
                onClick={() => router.push("/notifications")}
              /> */}
              <AiOutlineSearch
                size={26}
                color="#9CA3AF"
                className="cursor-pointer"
                onClick={() => router.push("/search")}
              />
              {loading ? (
                <AvatarSkeleton width="w-7" height="h-7" />
              ) : (
                <Avatar
                  onClick={() => router.push("/me")}
                  src={userImage ? userImage : me?.me.profileImage}
                  width="w-7"
                  height="h-7"
                  className="cursor-pointer"
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex w-full max-w-3xl justify-between py-5 px-3 fixed top-0 z-50 "bg-transparent`}
        >
          <IoIosArrowBack
            onClick={() => router.back()}
            size={showBg ? 33 : 26}
            className={`${
              showBg
                ? "bg-gray-500 bg-opacity-30 backdrop-blur-lg drop-shadow-lg text-white rounded-full p-1 active:bg-blue-500"
                : "text-white"
            } cursor-pointer`}
          />
          {!hideMore && (
            <FiMoreVertical
              onClick={() =>
                setOpenMoreModal({
                  authorId: authorId,
                  open: true,
                  postId: postId,
                  type: modalType,
                  postType: postType ? postType : PostType.ARTICLE,
                  hide: instants
                    ? {
                        followAuthor: true,
                      }
                    : {
                        followAuthor: false,
                        offlineDownload: false,
                      },
                })
              }
              size={showBg ? 33 : 26}
              className={`${
                showBg
                  ? "bg-gray-500 bg-opacity-30 backdrop-blur-lg drop-shadow-lg text-white rounded-full p-1 active:bg-blue-500"
                  : "text-white"
              } cursor-pointer`}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
