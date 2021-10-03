import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  addUser,
  deleteUser,
  fetchUsers,
  fetchUser,
  updateUser,
  RECEIVE_USERS,
  RECEIVE_DELETE_USERS,
  RECEIVE_UPDATE_USERS,
  REQUEST_USERS,
  RECEIVE_ADD_USERS,
} from "../context/actions/user";

const useUser = () => {
  const {
    state: { users: usersState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getUsers: async (params) => {
      if (usersState.loading) {
        return false;
      }
      dispatch({ type: REQUEST_USERS });

      const users = await fetchUsers(params);

      dispatch({
        type: RECEIVE_USERS,
        payload: {
          users: users.data,
          metadata: users.metadata,
        },
      });

      return users;
    },
    addUser: async (values) => {
      return addUser(values).then((user) => {
        dispatch({
          type: RECEIVE_ADD_USERS,
          payload: { user },
        });
      });
    },
    fetchUser: async (id) => await fetchUser(id),
    updateUser: async (values) => {
      return updateUser(values).then((user) => {
        dispatch({
          type: RECEIVE_UPDATE_USERS,
          payload: {
            user,
          },
        });
      });
    },
    deleteUser: async (id) => {
      console.log(id);
      return deleteUser(id).then(() => {
        dispatch({
          type: RECEIVE_DELETE_USERS,
          payload: { id: id },
        });
        return id;
      });
    },
  };

  const selectors = {
    getUsers: () => {
      return usersState.users;
    },
    isLoading: () => {
      return usersState.loading;
    },
    isEmpty: () => {
      return usersState.users.length === 0;
    },
    getMetadata: () => {
      return usersState.metadata;
    },
  };

  return { actions, selectors };
};

export default useUser;
