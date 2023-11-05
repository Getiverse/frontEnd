import { gql } from "@apollo/client";

export const GET_ALL_ARTICLES = gql`
  query {
    findAllArticles {
      categories
      createdAt
      id
      image
      ratingSum
      content
      views
      userId
      title
    }
  }
`;

export type GET_ALL_ARTICLES = {
  findAllArticles: {
    categories: string[];
    createdAt: string;
    id: string;
    ratingSum: number;
    image: string;
    content: string;
    views: string;
    userId: string;
    title: string;
  }[];
};

export const GET_ARTICLE_BY_ID = gql`
  query FindArticleById($type: String!) {
    findArticleById(id: $type) {
      categories
      createdAt
      ratingsNumber
      id
      image
      content
      ratingSum
      views
      userId
      title
      readTime
    }
  }
`;
export type GET_ARTICLE_BY_ID = {
  findArticleById: {
    categories: string[];
    createdAt: string;
    id: string;
    ratingsNumber: number;
    image: string;
    content: string;
    views: number;
    ratingSum: number;
    userId: string;
    title: string;
    readTime: number;
  };
};
export const GET_ARTICLES_BY_USER_IDS = gql`
  query GetArticlesByUserIds($type: [String!]!, $page: Page!) {
    getArticlesByUserIds(userId: $type, page: $page) {
      count
      data {
        categories
        createdAt
        id
        ratingSum
        ratingsNumber
        image
        content
        views
        userId
        title
        readTime
      }
    }
  }
`;
export type GET_ARTICLES_BY_USER_IDS = {
  getArticlesByUserIds: {
    count: number;
    data: {
      categories: string[];
      createdAt: string;
      id: string;
      ratingSum: number;
      ratingsNumber: number;
      image: string;
      content: string;
      views: number;
      userId: string;
      title: string;
      readTime: number;
    }[];
  };
};
export const GET_ARTICLES_BY_USER_ID = gql`
  query GetArticlesByUserId($type: String!, $page: Page!) {
    getArticlesByUserId(userId: $type, page: $page) {
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
        readTime
      }
    }
  }
`;
export type GET_ARTICLES_BY_USER_ID = {
  getArticlesByUserId: {
    count: number;
    data: {
      categories: string[];
      createdAt: string;
      id: string;
      image: string;
      content: string;
      views: number;
      userId: string;
      ratingSum: number;
      ratingsNumber: number;
      title: string;
      readTime: number;
    }[];
  };
};

export const GET_ARTICLES_BY_CATEGORIES = gql`
  query getArticlesByCategories($type: [String!]!, $page: Page!) {
    getArticlesByCategories(categories: $type, page: $page) {
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
        readTime
      }
    }
  }
`;
export type GET_ARTICLES_BY_CATEGORIES = {
  getArticlesByCategories: {
    count: number;
    data: {
      categories: string[];
      createdAt: string;
      id: string;
      image: string;
      ratingsNumber: number;
      ratingSum: number;
      content: string;
      views: number;
      userId: string;
      title: string;
      readTime: number;
    }[];
  };
};

export const GET_ARTICLES_BY_CATEGORY = gql`
  query GetArticlesByCategory($type: String!, $page: Page!) {
    getArticlesByCategory(category: $type, page: $page) {
      count
      data {
        categories
        ratingSum
        ratingsNumber
        createdAt
        id
        image
        content
        views
        userId
        title
        readTime
      }
    }
  }
`;
export type GET_ARTICLES_BY_CATEGORY = {
  getArticlesByCategory: {
    count: number;
    data: {
      categories: string[];
      ratingSum: number;
      createdAt: string;
      id: string;
      ratingsNumber: number;
      image: string;
      content: string;
      views: number;
      userId: string;
      title: string;
      readTime: number;
    }[];
  };
};

export const FIND_ARTICLES_BY_IDS = gql`
  query FindArticlesByIds($type: [String!]!, $page: Page!) {
    findArticlesByIds(ids: $type, page: $page) {
      count
      data {
        categories
        createdAt
        ratingSum
        ratingsNumber
        id
        image
        content
        views
        userId
        title
        readTime
      }
    }
  }
`;
export type FIND_ARTICLES_BY_IDS = {
  findArticlesByIds: {
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
      readTime: number;
    }[];
  };
};
