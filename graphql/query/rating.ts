import { PostType } from "./../types/enums";
import { gql } from "@apollo/client";

export const FIND_RATINGS_BY_POST_ID = gql`
  query FindRatingsByPostId(
    $postId: String!
    $postType: PostType!
    $page: Page!
  ) {
    findRatingsByPostId(postId: $postId, postType: $postType, page: $page) {
      count
      data {
        id
        userId
        stars
        createdAt
        comment
        notUsefulRating
        usefulRating
        postId
        postType
      }
    }
  }
`;

export type FIND_RATINGS_BY_POST_ID = {
  findRatingsByPostId: {
    count: number;
    data: {
      id: string;
      userId: string;
      stars: number;
      createdAt: string;
      comment: string;
      usefulRating: string[];
      notUsefulRating: string[];
      postId: string;
      postType: PostType;
    }[];
  };
};

export const FIND_RATING_BY_ID = gql`
  query FindRatingById($type: String!) {
    findRatingById(id: $type) {
      id
      userId
      stars
      createdAt
      comment
      notUsefulRating
      usefulRating
      postId
      postType
    }
  }
`;

export type FIND_RATING_BY_ID = {
  findRatingById: {
    id: string;
    userId: string;
    stars: number;
    createdAt: string;
    comment: string;
    usefulRating: string[];
    notUsefulRating: string[];
    postId: string;
    postType: PostType;
  };
};
