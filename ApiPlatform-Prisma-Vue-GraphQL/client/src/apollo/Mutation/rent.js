import gql from "graphql-tag";

export const CREATE_RENT = gql`
  mutation createRent($data: RentCreateInput!) {
    createRent(data: $data) {
      id
    }
  }
`;
