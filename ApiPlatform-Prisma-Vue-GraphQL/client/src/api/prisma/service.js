import {SERVICE_QUERY, SERVICES_QUERY} from "@/apollo/Query/service";
import {CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE} from "@/apollo/Mutation/service";

export const getServices = async (values, apollo) => {
  let pagination = {};
  if(values && values.first && values.skip) {
    pagination = {
      first: values.first,
      skip: values.skip
    }
  }
  return new Promise((resolve, reject) => {
    apollo.query({
      query: SERVICES_QUERY,
      variables: {
        orderBy: 'id_DESC',
        pagination
      }
    }).then((result) => {
      resolve(result.data.services);
    })
      .catch((error) => reject(error));
  });
};

export const getService = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.query({
      query: SERVICE_QUERY,
      variables: {
        serviceId: values
      }
    }).then((result) => {
      resolve(result.data.service);
    })
      .catch((error) => reject(error));
  });
};

export const createService = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: CREATE_SERVICE,
      variables: {
        data: {
          name: values.name,
          price: values.price
        }
      }
    }).then((result) => {
      resolve(result.data.service);
    })
      .catch((error) => reject(error));
  });
};

export const editService = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: UPDATE_SERVICE,
      variables: {
        data: {
          name: values.name,
          price: values.price
        },
        serviceId: values.id
      }
    }).then((result) => {
      resolve(result.data.service);
    })
      .catch((error) => reject(error));
  });
};

export const deleteService = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: DELETE_SERVICE,
      variables: {
        serviceId: values
      }
    }).then((result) => {
      resolve(result.data.service);
    })
      .catch((error) => reject(error));
  });
};

