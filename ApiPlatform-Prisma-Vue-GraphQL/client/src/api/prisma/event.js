import { EVENT_QUERY, EVENTS_QUERY } from '@/apollo/Query/event';
import { CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT } from '@/apollo/Mutation/event';
import { EVENT_STATUS } from "../../../config/constant";

export const getEvents = async (values, apollo) => {
  let params = {}
  if (values.startDate) {
    params = {
      ...params,
      startDate_gt: values.startDate.after
    }
  }
  if (values.endDate) {
    params = {
      ...params,
      endDate_lt: values.endDate.before
    }
  }
  if (values['rent.owner'] && values.isRenter) {
    params = {
      ...params,
      rent: {
        home: {
          owner: {
            id: values['rent.owner']
          }
        }
      }
    }
  } else {
    params = {
      ...params,
      rent: {
        owner: {
          id: values['rent.owner']
        }
      }
    }
  }
  if (values.status) {
    params = {
      ...params,
      status: values.status
    }
  }
  return new Promise((resolve, reject) => {
    apollo.query({
      query: EVENTS_QUERY,
      variables: {
        where: params,
        orderBy: 'createdAt_DESC',
        first: values.first,
        skip: values.skip
      }
    }).then((result) => {
      resolve(result.data.events);
    })
      .catch((error) => reject(error));
  });
};

export const getEvent = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.query({
      query: EVENT_QUERY,
      variables: {
        eventId: values
      }
    }).then((result) => {
      result.data.event.rent.services = result.data.event.rent.rentService
      resolve(result.data.event);
    })
      .catch((error) => reject(error));
  });
};

export const createEvent = async (values, apollo) => {
  let data = {
    name: values.name,
    peopleLimit: values.peopleLimit,
    description: values.description,
    startDate: values.startDate,
    endDate: values.endDate,
    status: EVENT_STATUS.CREATED
  };
  if (values.rent) {
    data = { ...data, rent: { connect: { id: values.rent } } }
  }
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: CREATE_EVENT,
      variables: {
        data
      }
    }).then((result) => {
      resolve(result.data.event);
    })
      .catch((error) => reject(error));
  });
};

export const editEvent = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: UPDATE_EVENT,
      variables: {
        data: {
          name: values.name,
          peopleLimit: values.peopleLimit,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate
        },
        eventId: values.id
      }
    }).then((result) => {
      resolve(result.data.event);
    })
      .catch((error) => reject(error));
  });
};

export const deleteEvent = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: DELETE_EVENT,
      variables: {
        data: {
          deletedAt: new Date(),
        },
        eventId: values
      }
    }).then((result) => {
      resolve(result.data.event);
    })
      .catch((error) => reject(error));
  });
};

export const updateStatus = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: UPDATE_EVENT,
      variables: {
        data: {
          status: values.status
        },
        eventId: values.id
      }
    }).then((result) => {
      resolve(result.data.event);
    })
      .catch((error) => reject(error));
  });
}

