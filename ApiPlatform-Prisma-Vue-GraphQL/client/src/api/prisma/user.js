import {USER_QUERY, USERS_QUERY} from '@/apollo/Query/user';
import {CREATE_USER, UPDATE_USER, DELETE_USER} from '@/apollo/Mutation/user';

export const getUsers = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.query({
      query: USERS_QUERY,
      variables: {
        orderBy: 'createdAt_DESC',
        first: values.first,
        skip: values.skip
      }
    }).then((result) => {
      const filtered = result.data.users.filter(user => user.deletedAt === null);
      resolve(filtered);
    })
      .catch((error) => reject(error));
  });
};

export const getUser = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.query({
      query: USER_QUERY,
      variables: {
        userId: values
      }
    }).then((result) => {
      resolve(result.data.user);
    })
      .catch((error) => reject(error));
  });
};

export const createUser = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: CREATE_USER,
      variables: {
        data: {
          email: values.email,
          firstname: values.firstname,
          lastname: values.lastname,
          phone: values.phone,
          roles: JSON.stringify(values.roles),
          password: values.plainPassword,
          company: values.company
        }
      }
    }).then((result) => {
      resolve(result.data.user);
    })
      .catch((error) => reject(error));
  });
};

export const editUser = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: UPDATE_USER,
      variables: {
        data: {
          email: values.email,
          firstname: values.firstname,
          lastname: values.lastname,
          phone: values.phone,
          company: values.company
        },
        userId: values.id
      }
    }).then((result) => {
      resolve(result.data.user);
    })
      .catch((error) => reject(error));
  });
};

export const deleteUser = async (values, apollo) => {
  return new Promise((resolve, reject) => {
    apollo.mutate({
      mutation: DELETE_USER,
      variables: {
        data: {
          deletedAt: new Date(),
        },
        userId: values
      }
    }).then((result) => {
      resolve(result.data.user);
    })
      .catch((error) => reject(error));
  });
};

