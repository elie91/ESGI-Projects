import gql from "graphql-tag";

export const EVENT_USERS_QUERY = gql`
  query eventUsers($where: EventUserWhereInput) {
    eventUsers(where: $where) {
      id,
      event {
        id,
        name,
        description,
        startDate,
        endDate,
        status
      }
    }
  }
`;
