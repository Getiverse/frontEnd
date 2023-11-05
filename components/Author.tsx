import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useState } from "react";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import { CgBlock, CgUnblock } from "react-icons/cg";
import { BLOCK_USER, FOLLOW } from "../graphql/mutation/me";
import {
  GET_MY_FOLLOW,
  GET_MY_FOLLOW_USER_ID,
  GET_MY_PROFILE_PRIMARY_STATS,
} from "../graphql/query/me";
import useUid from "../hooks/useUid";
import { AUTHORS_PAGEABLE_PAGE_SIZE } from "../utils/constants";
import Avatar from "./Avatar";
import Text from "./Text";

const Author = ({
  src,
  name,
  id,
  isFollow = false,
  block = false,
  style,
  className = "px-4",
}: {
  src: string;
  name: string;
  id: string;
  isFollow: boolean;
  block?: boolean;
  style?: CSSProperties;
  className?: string;
}) => {
  const router = useRouter();
  const uid = useUid();
  const [follow, { loading: loadingFollow }] = useMutation<String[]>(FOLLOW);
  const [blockUser, { data: blockedUser }] =
    useMutation<BLOCK_USER>(BLOCK_USER);

  return (
    <div
      className={`flex w-full items-center ${className}`}
      style={style}
      onClick={() => router.push("/author/" + "@" + name + "?id=" + id)}
    >
      <div className="flex w-full items-center space-x-6">
        <Avatar src={src} />
        <Text size="text-lg" className="break-words">
          {name}
        </Text>
      </div>
      {loadingFollow && (
        <div className={`w-8 h-8 bg-gray-500 animate-pulse rounded-full`} />
      )}
      {!loadingFollow && uid != id && (
        <button
          onClick={() => {
            if (block) {
              blockUser({
                variables: {
                  type: id,
                },
              });
            } else {
              follow({
                variables: {
                  type: id,
                },
                update: (cache, { data, errors }) => {
                  const cachedFollowedAuthors =
                    cache.readQuery<GET_MY_PROFILE_PRIMARY_STATS>({
                      query: GET_MY_PROFILE_PRIMARY_STATS,
                    });
                  if (cachedFollowedAuthors?.me.follow) {
                    cache.writeQuery({
                      query: GET_MY_PROFILE_PRIMARY_STATS,
                      data: {
                        me: {
                          follow: cachedFollowedAuthors?.me.follow.includes(id)
                            ? [
                                ...cachedFollowedAuthors.me.follow.filter(
                                  (val) => val !== id
                                ),
                              ]
                            : [...cachedFollowedAuthors?.me.follow, id],
                        },
                      },
                    });
                  }
                },
              });
            }
          }}
        >
          {block ? (
            isFollow ? (
              <CgBlock
                size="30"
                className="bg-blue-500 text-white rounded-full border p-1 border-blue-500"
              />
            ) : (
              <CgUnblock
                size="30"
                className="text-white bg-slate-400 rounded-full p-1"
              />
            )
          ) : isFollow ? (
            <AiOutlineUserDelete
              size="30"
              className="bg-blue-500 text-white rounded-full border p-1 border-blue-500"
            />
          ) : (
            <AiOutlineUserAdd
              size="30"
              className="text-white bg-slate-400 rounded-full p-1"
            />
          )}
        </button>
      )}
    </div>
  );
};

export default Author;
