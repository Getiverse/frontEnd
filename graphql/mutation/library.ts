import { gql } from "@apollo/client";

export const REMOVE_ARTICLE_FROM_LIBRARY = gql`
  mutation RemoveArticleFromLibrary($libraryId: String!, $articleId: String!) {
    removeArticleFromLibrary(libraryId: $libraryId, articleId: $articleId)
  }
`;
export type REMOVE_ARTICLE_FROM_LIBRARY = {
  removeArticleFromLibrary: boolean;
};

export const REMOVE_INSTANT_FROM_LIBRARY = gql`
  mutation RemoveInstantFromLibrary($libraryId: String!, $instantId: String!) {
    removeInstantFromLibrary(libraryId: $libraryId, instantId: $instantId)
  }
`;
export type REMOVE_INSTANT_FROM_LIBRARY = {
  removeInstantFromLibrary: boolean;
};
