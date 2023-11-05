import { FOLLOWED_AUTHORS_PAGE_SIZE } from "./../../utils/constants";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { FOLLOW } from "../../graphql/mutation/me";
import { GET_MY_FOLLOW, GET_MY_FOLLOW_USER_ID } from "../../graphql/query/me";
import { AUTHORS_PAGEABLE_PAGE_SIZE } from "../../utils/constants";

function useFollow(
  id: string | undefined,
  author: string | undefined,
  src: string | undefined
) {
  const [follow] = useMutation<{ follow: string }>(FOLLOW, {
    update: (cache, { data, errors }) => {
      const cachedFollow = cache.readQuery<GET_MY_FOLLOW_USER_ID>({
        query: GET_MY_FOLLOW_USER_ID,
      });
      const cachedMyFollow = cache.readQuery<GET_MY_FOLLOW>({
        query: GET_MY_FOLLOW,
        variables: {
          page: {
            page: 0,
            size: FOLLOWED_AUTHORS_PAGE_SIZE,
          },
        },
      });
      if (cachedFollow?.me.follow && data?.follow)
        cache.writeQuery({
          query: GET_MY_FOLLOW_USER_ID,
          data: {
            me: {
              follow: cachedFollow?.me.follow.includes(data.follow)
                ? [
                    ...cachedFollow.me.follow.filter(
                      (val) => val != data.follow
                    ),
                  ]
                : [...cachedFollow?.me.follow, data.follow],
            },
          },
        });
      if (cachedMyFollow?.getFollow && data?.follow && id && src && author) {
        const result = [...cachedMyFollow?.getFollow.data];
        let increase = false;
        if (result.find((e) => e.id == data.follow)) {
          result.splice(
            result.findIndex((val) => val.id == data.follow),
            1
          );
        } else {
          result.push({
            id: id,
            userName: author,
            profileImage: src,
          });
          increase = true;
        }
        cache.writeQuery({
          query: GET_MY_FOLLOW,
          variables: {
            page: {
              page: 0,
              size: FOLLOWED_AUTHORS_PAGE_SIZE,
            },
          },
          data: {
            getFollow: {
              count: increase
                ? cachedMyFollow?.getFollow.count + 1
                : cachedMyFollow?.getFollow.count - 1,
              data: [...result],
            },
          },
        });
      }
    },
  });
  return follow;
}
export default useFollow;
