import { gql } from '@apollo/client';

export const ADD_INSTANT = gql`
    mutation AddInstant($type: createInstantInput!) {
        addInstant(input: $type) {
            createdAt
            id
        }
    }
`
export const UPDATE_INSTANT = gql`
  mutation UpdateInstant($type: updateInstantInput!) {
    updateInstant(input: $type) {
      createdAt
      id
    }
  }
`;
