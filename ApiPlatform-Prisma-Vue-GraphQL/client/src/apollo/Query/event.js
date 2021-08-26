import gql from "graphql-tag";


export const EVENT_QUERY = gql`
  query getEvent($eventId: ID!) {
    event(where: {id: $eventId}) {
      id,
      name,
      description,
      peopleLimit,
      startDate,
      endDate,
      status,
      rent {
        startDate,
        endDate,
        owner {
          email,
          firstname,
          lastname,
          phone
        }
        rentService {
          id,
          name,
          price
        },
        home {
          name,
          description,
          price,
          owner {
            id
            email
          }
          address,
          homeOption {
            name
          },
          pictures {
            image,
            isMainPicture
          }
        }
      },
    }
  }
`;

export const EVENTS_QUERY = gql`
  query events($orderBy: EventOrderByInput, $where: EventWhereInput) {
    events(orderBy: $orderBy, where: $where) {
      id,
      description,
      name,
      peopleLimit,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      status,
      eventUsers {
        id
        user {
          id
        }
      },
      rent {
        owner {
          id
          email
        }
        rentService {
          name
        },
        home {
          owner {
            id
            email
          }
          address,
          homeOption {
            name
          },
          pictures {
            image,
            isMainPicture
          }
        }
      }
    }
  },
`;
