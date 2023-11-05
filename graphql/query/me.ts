import { gql } from "@apollo/client";

export const GET_MY_FOLLOW = gql`
  query GetFollow($page: Page!) {
    getFollow(page: $page) {
      count
      data {
        id
        userName
        profileImage
      }
    }
  }
`;
export type GET_MY_FOLLOW = {
  getFollow: {
    count: number;
    data: {
      id: string;
      userName: string;
      profileImage: string;
    }[];
  };
};

export const GET_MY_FOLLOWERS_ID = gql`
  query {
    me {
      followers
    }
  }
`;
export type GET_MY_FOLLOWERS_ID = {
  me: {
    followers: string[];
  };
};
export const GET_MY_FOLLOWERS = gql`
  query GetFollowers($page: Page!) {
    getFollowers(page: $page) {
      count
      data {
        id
        userName
        profileImage
      }
    }
  }
`;
export type GET_MY_FOLLOWERS = {
  getFollowers: {
    count: number;
    data: {
      id: string;
      userName: string;
      profileImage: string;
    }[];
  };
};

export const GET_MY_FOLLOW_USER_ID = gql`
  query {
    me {
      follow
    }
  }
`;

export type GET_MY_FOLLOW_USER_ID = {
  me: {
    follow: string[];
  };
};

export const FIND_ALL_FOLLOW_BY_USER_ID = gql`
  query FindAllFollowByUserId($type: String!) {
    findAllFollowByUserId(userID: $type) {
      id
    }
  }
`;

export type FIND_ALL_FOLLOW_BY_USER_ID = {
  findAllFollowByUserId: {
    id: string;
  }[];
};

export const GET_MY_PROFILE_PRIMARY_STATS = gql`
  query {
    me {
      bio
      userName
      name
      profileImage
      follow
      followers
      numberOfArticles
      numberOfInstants
      backgroundImage
      socialLinks
      blockedUsers
      contact
      selectedCategories
      links {
        name
        url
      }
    }
  }
`;

export type GET_MY_PROFILE_PRIMARY_STATS = {
  me: {
    bio: string;
    userName: string;
    name: string;
    profileImage: string;
    follow: string[];
    followers: string[];
    selectedCategories: string[];
    backgroundImage: string;
    blockedUsers: string[];
    numberOfInstants: number;
    numberOfArticles: number;
    socialLinks: string[];
    contact: string;
    links: {
      name: string;
      url: string;
    }[];
  };
};

export const GET_MY_RATING_STARS = gql`
  query {
    getRating {
      stars
    }
  }
`;

export type GET_MY_RATING_STARS = {
  getRating: {
    stars: number[];
  };
};

export const GET_MY_POST_VIEWS = gql`
  query {
    getPostViews
  }
`;

export type GET_MY_POST_VIEWS = {
  getPostViews: number;
};

export const GET_MY_SELECTED_CATEGORIES = gql`
  query {
    getCategories {
      id
      name
      image
    }
  }
`;

export type GET_MY_SELECTED_CATEGORIES = {
  getCategories: {
    id: string;
    name: string;
    image: string;
  }[];
};

export const GET_MY_ARTICLES = gql`
  query GetMyArticles($page: Page!) {
    getMyArticles(page: $page) {
      count
      data {
        userId
        image
        title
        createdAt
        content
        ratingsNumber
        categories
        readTime
        id
        ratingSum
      }
    }
  }
`;

export type GET_MY_ARTICLES = {
  getMyArticles: {
    count: number;
    data: {
      userId: string;
      image: string;
      title: string;
      createdAt: string;
      content: string;
      ratingsNumber: number;
      categories: string[];
      readTime: number;
      id: string;
      ratingSum: number;
    }[];
  };
};

export const GET_MY_INSTANTS = gql`
  query GetMyInstants($page: Page!) {
    getMyInstants(page: $page) {
      count
      data {
        userId
        image
        title
        createdAt
        content
        ratingsNumber
        categories
        id
        ratingSum
      }
    }
  }
`;

export type GET_MY_INSTANTS = {
  getMyInstants: {
    count: number;
    data: {
      userId: string;
      image: string;
      title: string;
      createdAt: string;
      content: string;
      ratingsNumber: number;
      categories: string[];
      id: string;
      ratingSum: number;
    }[];
  };
};

export const GET_MY_LIBRARIES = gql`
  query GetMyLibraries($type: Page!) {
    getMyLibraries(page: $type) {
      count
      data {
        id
        isPrivate
        instants
        articles
        image
        createdAt
        title
      }
    }
  }
`;

export type GET_MY_LIBRARIES = {
  getMyLibraries: {
    count: number;
    data: {
      id: string;
      userId: string;
      isPrivate: boolean;
      instants: string[];
      articles: string[];
      image: string;
      createdAt: string;
      title: string;
    }[];
  };
};
