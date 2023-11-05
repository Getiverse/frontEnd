import { gql } from "@apollo/client";

export const FIND_MY_LIBRARY_BY_ID = gql`
  query FindMyLibraryById($type: String!) {
    findMyLibraryById(id: $type) {
      id
      isPrivate
      instants
      articles
      image
      createdAt
      title
      description
      userId
    }
  }
`;

export type FIND_MY_LIBRARY_BY_ID = {
  findMyLibraryById: {
    id: string;
    userId: string;
    isPrivate: boolean;
    instants: string[];
    articles: string[];
    image: string;
    createdAt: string;
    title: string;
    description: string;
  };
};

export const FIND_LIBRARY_BY_ID = gql`
  query FindMyLibraryById($type: String!) {
    findLibraryById(id: $type) {
      id
      isPrivate
      instants
      articles
      image
      createdAt
      title
      description
      userId
    }
  }
`;

export type FIND_LIBRARY_BY_ID = {
  findLibraryById: {
    id: string;
    userId: string;
    isPrivate: boolean;
    instants: string[];
    articles: string[];
    image: string;
    createdAt: string;
    title: string;
    description: string;
  };
};

export const FIND_LIBRARIES_BY_USER_ID = gql`
  query FindLibrariesByUserId($page: Page!, $uid: String!) {
    findLibrariesByUserId(page: $page, uid: $uid) {
      count
      data {
        id
        isPrivate
        instants
        articles
        image
        createdAt
        title
        description
      }
    }
  }
`;

export type FIND_LIBRARIES_BY_USER_ID = {
  findLibrariesByUserId: {
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
      description: string;
    }[];
  };
};
