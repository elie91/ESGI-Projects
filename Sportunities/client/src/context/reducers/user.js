import {
  RECEIVE_ADD_USERS,
  RECEIVE_DELETE_USERS,
  RECEIVE_USERS,
  RECEIVE_UPDATE_USERS,
  REQUEST_USERS,
} from "../actions/user";

export const initialState = {
  users: [],
  loading: false,
  metadata: {
    count: 0,
    page: 1
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_USERS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_USERS:
      return {
        ...state,
        users: action.payload.metadata.page > 1 ? [...state.users, ...action.payload.users] : action.payload.users,
        metadata: {
          ...state.metadata,
          ...action.payload.metadata
        },
        loading: false,
      };
    case RECEIVE_ADD_USERS:
      return {
        ...state,
        users: [...state.users, action.payload.user],
      };
    case RECEIVE_UPDATE_USERS:
      return {
        ...state,
        users: state.users.map(item => {
          if (item.id === action.payload.user.id) {
            return action.payload.user;
          }
          return item;
        }),
      };
    case RECEIVE_DELETE_USERS:
      return {
        ...state,
        users: state.users.filter(item => item.id !== action.payload.id),
      };
    default:
      return state;
  }
};
