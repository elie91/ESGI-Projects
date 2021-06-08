import {CREATE_EVENT_USER} from "@/apollo/Mutation/eventUser";
import {EVENT_USERS_QUERY} from "@/apollo/Query/eventUser";


export const getEventUsers = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.query({
      query: EVENT_USERS_QUERY,
      variables: {
        where: {
          user : {
            id: values.userId
          }
        }
      }
    }).then((result) => {
      resolve(result.data.eventUsers);
    })
      .catch((error) => reject(error));
  });
}


export const createEventUser = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: CREATE_EVENT_USER,
      variables: {
        data: {
          event: {
            connect: {
              id: values.event
            }
          },
          user: {
            connect: {
              id: values.user
            }
          },
          isOwner: false
        }
      }
    }).then((result) => {
      resolve(result.data.createEventUser);
    })
      .catch((error) => reject(error));
  });
}
