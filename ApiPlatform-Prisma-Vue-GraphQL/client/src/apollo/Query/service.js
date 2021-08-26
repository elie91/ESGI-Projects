import gql from "graphql-tag";

export const SERVICES_QUERY = gql`
  query services($orderBy: ServiceOrderByInput, $first: Int, $skip: Int) {
    services(orderBy: $orderBy, first: $first, skip: $skip) {
      id,
      name,
      price
    }
  }
`;

export const SERVICE_QUERY = gql`
  query service($serviceId: ID!) {
    service(where: {id: $serviceId}) {
      id,
      name,
      price
    }
  }
`;
