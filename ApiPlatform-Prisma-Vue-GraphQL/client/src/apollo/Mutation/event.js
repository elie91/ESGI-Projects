import gql from "graphql-tag";

export const CREATE_EVENT = gql`
  mutation createEvent($data: EventCreateInput!) {
    createEvent(data: $data) {
      id
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation updateEvent($data: EventUpdateInput!, $eventId: ID!) {
    updateEvent(data: $data, where: {id: $eventId}) {
      id
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation deleteEvent($eventId: ID!) {
    deleteEvent(where: {id: $eventId}) {
      id
    }
  }
`;
