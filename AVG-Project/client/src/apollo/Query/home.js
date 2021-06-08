import gql from "graphql-tag";

export const HOMES_QUERY = gql`
  query homes($orderBy: HomeOrderByInput, $first: Int, $skip: Int, $where: HomeWhereInput) {
    homes(orderBy: $orderBy, first: $first, skip: $skip, where: $where) {
      id,
      name,
      address,
      city,
      country,
      price,
      type,
      createdAt,
      status,
      description,
      homeOption {
        id,
        name
      },
      pictures {
        id,
        image,
        isMainPicture
      },
    }
  }
`;

export const HOME_QUERY = gql`
  query home($homeId: ID!) {
    home(where: {id: $homeId}) {
      id,
      name,
      address,
      description,
      city,
      country,
      price,
      type,
      status,
      createdAt,
      homeOption {
        id,
        name
      },
      pictures {
        id,
        image,
        isMainPicture
      },
      owner {
        id,
        email,
        firstname,
        lastname
      }
    }
  }
`;
