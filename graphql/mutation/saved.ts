import { gql } from "@apollo/client";

export const ADD_LIBRARY = gql`
  mutation AddLibrary($type: createLibraryInput!) {
    addLibrary(input: $type) {
      id
      createdAt
    }
  }
`;
export type ADD_LIBRARY = {
  addLibrary: {
    id: string;
    createdAt: string;
  };
};
