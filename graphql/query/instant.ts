import { gql } from "@apollo/client";

export const GET_ALL_INSTANTS = gql`
  query Get_Instants(
    $page: Page!
    $filterType: FilterType
    $filterValue: String
  ) {
    findAllInstants(
      page: $page
      filterType: $filterType
      filterValue: $filterValue
    ) {
      count
      data {
        content
        userId
        id
        image
        createdAt
        title
        categories
        ratingsNumber
        ratingSum
      }
    }
  }
`;

export type GET_ALL_INSTANTS = {
  findAllInstants: {
    count: number;
    data: {
      content: string;
      userId: string;
      id: string;
      image: string;
      createdAt: string;
      title: string;
      categories: string[];
      ratingsNumber: number;
      ratingSum: number;
    }[];
  };
};

export const GET_INSTANTS_BY_USER_IDS = gql`
  query GetInstantsByUserIds($type: [String!]!, $page: Page!) {
    getInstantsByUserIds(userIds: $type, page: $page) {
      count
      data {
        categories
        createdAt
        id
        image
        content
        views
        userId
        title
        ratingsNumber
        ratingSum
      }
    }
  }
`;
export type GET_INSTANTS_BY_USER_IDS = {
  getInstantsByUserIds: {
    count: number;
    data: {
      categories: string[];
      createdAt: string;
      id: string;
      image: string;
      content: string;
      views: number;
      ratingSum: number;
      ratingsNumber: number;
      userId: string;
      title: string;
    }[];
  };
};

export const GET_INSTANTS_BY_USER_ID = gql`
  query GetInstantsByUserId($type: String!, $page: Page!) {
    getInstantsByUserId(userId: $type, page: $page) {
      count
      data {
        categories
        createdAt
        id
        image
        content
        views
        userId
        ratingSum
        ratingsNumber
        title
      }
    }
  }
`;
export type GET_INSTANTS_BY_USER_ID = {
  getInstantsByUserId: {
    count: number;
    data: {
      categories: string[];
      createdAt: string;
      id: string;
      image: string;
      ratingSum: number;
      ratingsNumber: number;
      content: string;
      views: number;
      userId: string;
      title: string;
    }[];
  };
};

export const GET_INSTANTS_BY_CATEGORIES = gql`
  query GetInstantsByCategories($type: [String!]!, $page: Page!) {
    getInstantsByCategories(categories: $type, page: $page) {
      count
      data {
        categories
        createdAt
        id
        image
        content
        ratingsNumber
        ratingSum
        views
        userId
        title
      }
    }
  }
`;
export type GET_INSTANTS_BY_CATEGORIES = {
  getInstantsByCategories: {
    count: number;
    data: {
      categories: string[];
      createdAt: string;
      ratingSum: number;
      ratingsNumber: number;
      id: string;
      image: string;
      content: string;
      views: number;
      userId: string;
      title: string;
    }[];
  };
};

export const GET_INSTANTS_BY_CATEGORY = gql`
  query GetInstantsByCategory($type: String!, $page: Page!) {
    getInstantsByCategory(category: $type, page: $page) {
      count
      data {
        categories
        createdAt
        id
        ratingsNumber
        image
        content
        views
        ratingSum
        userId
        title
      }
    }
  }
`;
export type GET_INSTANTS_BY_CATEGORY = {
  getInstantsByCategory: {
    count: number;
    data: {
      categories: string[];
      createdAt: string;
      id: string;
      ratingsNumber: number;
      ratingSum: number;
      image: string;
      content: string;
      views: number;
      userId: string;
      title: string;
    }[];
  };
};

export const FIND_INSTANTS_BY_IDS = gql`
  query FindInstantsByIds($type: [String!]!, $page: Page!) {
    findInstantsByIds(ids: $type, page: $page) {
      count
      data {
        categories
        createdAt
        id
        image
        ratingSum
        ratingsNumber
        content
        views
        userId
        title
      }
    }
  }
`;
export type FIND_INSTANTS_BY_IDS = {
  findInstantsByIds: {
    count: number;
    data: {
      categories: string[];
      createdAt: string;
      ratingsNumber: number;
      id: string;
      image: string;
      content: string;
      ratingSum: number;
      views: number;
      userId: string;
      title: string;
    }[];
  };
};

export const FIND_INSTANT_BY_ID = gql`
  query FindInstantById($type: String!) {
    findInstantById(id: $type) {
      categories
      ratingsNumber
      createdAt
      id
      image
      content
      views
      userId
      ratingSum
      title
    }
  }
`;
export type FIND_INSTANT_BY_ID = {
  findInstantById: {
    categories: string[];
    createdAt: string;
    ratingsNumber: number;
    id: string;
    image: string;
    ratingSum: number;
    content: string;
    views: number;
    userId: string;
    title: string;
  };
};
