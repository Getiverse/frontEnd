import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation {
    login {
    id
  }
}
`;
export const LOGOUT = gql`
  mutation {
    logout {
    id
  }
}
`;
