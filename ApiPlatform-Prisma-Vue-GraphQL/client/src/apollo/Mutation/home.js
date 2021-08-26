import gql from "graphql-tag";

export const CREATE_HOME = gql`
  mutation createHome($data: HomeCreateInput!) {
    createHome(data: $data) {
      id
    }
  }
`;

export const UPDATE_HOME = gql`
  mutation updateHome($data: HomeUpdateInput!, $homeId: ID!) {
    updateHome(data: $data, where: {id: $homeId}) {
      id
    }
  }
`;

export const DELETE_HOME = gql`
  mutation deleteHome($homeId: ID!) {
    deleteHome(where: {id: $homeId}) {
      id
    }
  }
`;
