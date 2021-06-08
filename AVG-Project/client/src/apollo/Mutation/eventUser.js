import gql from "graphql-tag";

export const CREATE_EVENT_USER = gql`
  mutation createEventUser($data: EventUserCreateInput!) {
    createEventUser(data: $data) {
      id
    }
  }
`;
