import { gql } from "@apollo/client";

export const ADD_ARTICLE = gql`
  mutation AddArticle($type: createArticleInput!) {
    addArticle(input: $type) {
      createdAt
      id
    }
  }
`;

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($type: updateArticleInput!) {
    updateArticle(input: $type) {
      createdAt
      id
    }
  }
`;

