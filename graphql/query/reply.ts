import { gql } from "@apollo/client";

export const FIND_REPLIES_BY_RATING_ID = gql`
  query FindRepliesByRatingId($type: String!, $page: Page!) {
    findRepliesByRatingId(ratingId: $type, page: $page) {
      count
      data {
        id
        userId
        repliedUser
        ratingId
        comment
        createdAt
        notUsefulRating
        usefulRating
      }
    }
  }
`;

export type FIND_REPLIES_BY_RATING_ID = {
  findRepliesByRatingId: {
    count: number;
    data: {
      id: string;
      userId: string;
      repliedUser: string;
      ratingId: string;
      comment: string;
      createdAt: string;
      notUsefulRating: string[];
      usefulRating: string[];
    }[];
  };
};

export const FIND_REPLIES_IDS_BY_RATING_ID = gql`
  query FindRepliesByRatingId($type: String!, $page: Page!) {
    findRepliesByRatingId(ratingId: $type, page: $page) {
      count
    }
  }
`;

export type FIND_REPLIES_IDS_BY_RATING_ID = {
  findRepliesByRatingId: {
    count: number;
  };
};

export const FIND_REPLY_BY_ID = gql`
  query FindReplyById($type: String!) {
    findReplyById(id: $type) {
      id
      comment
      repliedUser
    }
  }
`;

export type FIND_REPLY_BY_ID = {
  findReplyById: {
    id: string;
    comment: string;
    repliedUser: string;
  };
};
