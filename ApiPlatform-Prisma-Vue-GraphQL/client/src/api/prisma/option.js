import {OPTION_QUERY, OPTIONS_QUERY} from "@/apollo/Query/option";
import {CREATE_OPTION, UPDATE_OPTION, DELETE_OPTION} from "@/apollo/Mutation/option";

export const getOptions = async (values, apollo) => {
  let queryParams = {
    orderBy: 'id_DESC'
  }
  if (values && values.first && values.skip) {
    queryParams = {...queryParams, first: values.first, skip: values.skip}
  }
  return new Promise((resolve, reject) => {
    apollo.query({
      query: OPTIONS_QUERY,
      variables: queryParams
    }).then((result) => {
      resolve(result.data.options);
    })
      .catch((error) => reject(error));
  });
};

export const getOption = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.query({
      query: OPTION_QUERY,
      variables: {
        optionId: values
      }
    }).then((result) => {
      resolve(result.data.option);
    })
      .catch((error) => reject(error));
  });
};

export const createOption = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: CREATE_OPTION,
      variables: {
        data: {
          name: values.name
        }
      }
    }).then((result) => {
      resolve(result.data.option);
    })
      .catch((error) => reject(error));
  });
};

export const editOption = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: UPDATE_OPTION,
      variables: {
        data: {
          name: values.name
        },
        optionId: values.id
      }
    }).then((result) => {
      resolve(result.data.option);
    })
      .catch((error) => reject(error));
  });
};

export const deleteOption = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: DELETE_OPTION,
      variables: {
        optionId: values
      }
    }).then((result) => {
      resolve(result.data.option);
    })
      .catch((error) => reject(error));
  });
};

