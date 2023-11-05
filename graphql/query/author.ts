import { gql } from "@apollo/client";

export const GET_ALL_AUTHORS = gql`
  query FindAllUsers($page: Page!) {
    findAllUsers(page: $page) {
      count
      data {
        id
        profileImage
        bio
        userName
      }
    }
  }
`;
export type GET_ALL_AUTHORS = {
  findAllUsers: {
    count: number;
    data: {
      id: string;
      profileImage: string;
      bio: string;
      userName: string;
    }[];
  };
};

export const FIND_USER_BY_ID = gql`
  query FindUserById($type: String!) {
    findUserById(id: $type) {
      id
      name
      userName
      profileImage
      bio
    }
  }
`;

export type FIND_USER_BY_ID = {
  findUserById: {
    id: string;
    userName: string;
    name: string;
    profileImage: string;
    bio: string;
  };
};

export const FIND_USER_BY_IDS = gql`
  query FindUserByIds($type: [String!]) {
    findUsersByIds(ids: $type) {
      id
      name
      userName
      profileImage
    }
  }
`;

export type FIND_USER_BY_IDS = {
  findUsersByIds: {
    id: string;
    userName: string;

    name: string;
    profileImage: string;
  }[];
};

export const FIND_USER_PROFILE_BY_ID = gql`
  query FindUserById($type: String!) {
    findUserById(id: $type) {
      name
      profileImage
      backgroundImage
      bio
      follow
      followers
      numberOfArticles
      numberOfInstants
      userName
      socialLinks
      contact
      links {
        name
        url
      }
    }
  }
`;

export type FIND_USER_PROFILE_BY_ID = {
  findUserById: {
    name: string;
    profileImage: string;
    backgroundImage: string;
    bio: string;
    follow: string[];
    followers: string[];
    numberOfArticles: number;
    numberOfInstants: number;
    userName: string;
    socialLinks: string[];
    contact: string;
    links: {
      name: string;
      url: string;
    }[];
  };
};

export const GET_USER_POST_VIEWS = gql`
  query GetUserPostViews($type: String!) {
    getUserPostViews(id: $type)
  }
`;

export type GET_USER_POST_VIEWS = {
  getUserPostViews: number;
};

export const GET_USER_POST_RATINGS_STARS = gql`
  query GetUserPostsRating($type: String!) {
    getUserPostsRating(id: $type) {
      stars
    }
  }
`;

export type GET_USER_POST_RATINGS_STARS = {
  getUserPostsRating: {
    stars: number[];
  };
};

export const GET_USER_FOLLOWERS = gql`
  query GetUserFollowers($type: String!, $page: Page!) {
    getUserFollowers(id: $type, page: $page) {
      count
      data {
        profileImage
        userName
        id
      }
    }
  }
`;

export type GET_USER_FOLLOWERS = {
  getUserFollowers: {
    count: number;
    data: {
      profileImage: string;
      userName: string;
      id: string;
    }[];
  };
};
export const GET_USER_FOLLOWING = gql`
  query GetUserFollowing($type: String!, $page: Page!) {
    getUserFollowing(id: $type, page: $page) {
      count
      data {
        profileImage
        userName
        id
      }
    }
  }
`;

export type GET_USER_FOLLOWING = {
  getUserFollowing: {
    count: number;
    data: {
      profileImage: string;
      userName: string;
      id: string;
    }[];
  };
};
