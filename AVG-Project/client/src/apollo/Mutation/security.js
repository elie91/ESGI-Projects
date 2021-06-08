import gql from "graphql-tag";

export const CHECK_LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    check_login(email: $email, password: $password) {
      token
    }
  }
`;
