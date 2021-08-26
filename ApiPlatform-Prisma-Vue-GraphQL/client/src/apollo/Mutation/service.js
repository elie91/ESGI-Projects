import gql from "graphql-tag";

export const CREATE_SERVICE = gql`
  mutation createService($data: ServiceCreateInput!) {
    createService(data: $data) {
      id
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation updateService($data: ServiceUpdateInput!, $serviceId: ID!) {
    updateService(data: $data, where: {id: $serviceId}) {
      id
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation deleteService($serviceId: ID!) {
    deleteService(where: {id: $serviceId}) {
      id
    }
  }
`;
