import gql from "graphql-tag";

export const CREATE_USER = gql`
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($data: UserUpdateInput!, $userId: ID!) {
    updateUser(data: $data, where: {id: $userId}) {
      id
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($data: UserUpdateInput!, $userId: ID!) {
    updateUser(data: $data, where: {id: $userId}) {
      id
    }
  }
`;
