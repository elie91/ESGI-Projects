import gql from "graphql-tag";

export const RENTS_QUERY = gql`
  query rents($orderBy: RentOrderByInput, $first: Int, $skip: Int, $where: RentWhereInput) {
    rents(orderBy: $orderBy, first: $first, skip: $skip, where: $where) {
      id,
      startDate,
      endDate,
      totalPrice,
      home {
        id,
        name
      },
      owner {
        id
        email
        lastname
        firstname
        phone
      },
      createdAt
    }
  }
`;
