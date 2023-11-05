import { useQuery } from "@apollo/client";
import { NextPage } from "next";
import { useState } from "react";
import Author from "../../../components/Author";
import Container from "../../../components/container/Container";
import Header from "../../../components/logged_in/layout/Header";
import RoutingGuard from "../../../components/RoutingGuard";
import { BLOCK_USER } from "../../../graphql/mutation/me";
import { FIND_USER_BY_IDS } from "../../../graphql/query/author";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../../../graphql/query/me";

const Blocked: NextPage = () => {
  const { data: blockedUsersId } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(
    GET_MY_PROFILE_PRIMARY_STATS
  );
  const { data: blockedUsersList } = useQuery<FIND_USER_BY_IDS>(
    FIND_USER_BY_IDS,
    {
      variables: {
        skip: !blockedUsersId?.me || !blockedUsersId?.me.blockedUsers,
        type: blockedUsersId?.me.blockedUsers,
      },
    }
  );
  return (
    <RoutingGuard>
      <Container>
        <Header label="Blocked" hideIcons />
        <main className="space-y-5">
          {blockedUsersList?.findUsersByIds.map(
            ({ id, name, profileImage }) => (
              <Author
                block
                key={id}
                src={profileImage}
                name={name}
                id={id}
                isFollow={true}
              />
            )
          )}
        </main>
      </Container>
    </RoutingGuard>
  );
};
export default Blocked;
