import gql from "graphql-tag";

export const USER_QUERY = gql`
  query getUser($userId: ID!) {
    user(where: {id: $userId}) {
      id,
      email,
      lastname,
      firstname,
      phone,
      roles,
      createdAt,
      updatedAt,
      homes {
        id,
        name,
        price,
        city,
        country
      }
    }
  }
`;

export const USERS_QUERY = gql`
  query users($orderBy: UserOrderByInput, $first: Int, $skip: Int) {
    users(orderBy: $orderBy, first: $first, skip: $skip) {
      id,
      email,
      lastname,
      firstname,
      phone,
      roles,
      createdAt,
      updatedAt,
      deletedAt
    }
  }
`;
