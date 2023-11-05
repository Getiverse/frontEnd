import { useRouter } from "next/router";
import { CSSProperties, useEffect, useState } from "react";
import useFollow from "../hooks/mutation/useFollow";
import useUid from "../hooks/useUid";
import Avatar from "./Avatar";
import Button from "./buttons/Button";
import Text from "./Text";

interface IRecomandedAuthor {
  alt: string;
  src: string;
  author: string;
  bio: string;
  id: string;
  notification?: boolean;
  time?: string;
  text?: string;
  textPressed?: string;
  isFollowed?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  disableRedirect?: boolean;
}

function RecomandedAuthor({
  isFollowed = false,
  text = "Follow",
  textPressed = "UnFollow",
  src,
  alt,
  author,
  bio,
  id,
  notification = false,
  time = "",
  onClick,
  style,
  disableRedirect = false,
}: IRecomandedAuthor) {
  const follow = useFollow(id, author, src);
  function handleClick() {
    follow({ variables: { type: id } });
  }
  const router = useRouter();
  const uid = useUid();
  return (
    <div
      className="flex items-center w-full justify-between "
      style={style}
      onClick={() => {
        if (!id || !author || disableRedirect) return;
        if (uid == id) {
          router.push("/me");
        } else {
          router.push("/author/@" + author + "?id=" + id);
        }
      }}
    >
      <div className="flex items-center">
        <Avatar src={src} width="w-10" height="h-10" />
        <div className="mx-4">
          <Text
            size="text-lg"
            className="leading-none"
            color={disableRedirect ? "text-gray-200" : "text-gray-700"}
            weight="font-semibold"
          >
            {author.slice(0, 15)}
            {author.length >= 15 && "..."}
          </Text>
          <Text
            size="text-sm"
            color={disableRedirect ? "text-gray-200" : "text-gray-600"}
            weight="font-normal"
          >
            {bio.slice(0, 40)}
            {bio.length >= 40 && "..."}
          </Text>
          <p
            className={`text-xs mt-1 font-thin ${
              disableRedirect ? "text-gray-200" : "text-gray-600"
            } `}
          >
            {time}
          </p>
        </div>
      </div>
      <Button
        color={!isFollowed ? "bg-blue-500" : "bg-blue-900"}
        className="min-w-min px-2"
        type="primary"
        text={isFollowed ? textPressed : text}
        onClick={() => (onClick ? onClick() : handleClick())}
        textStyle="text-sm font-nomal scale-90"
        padding="py-2"
      />
    </div>
  );
}

export default RecomandedAuthor;
