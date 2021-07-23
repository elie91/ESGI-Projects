import {
  RECEIVE_ADD_SPORTS,
  RECEIVE_DELETE_SPORTS,
  RECEIVE_SPORTS,
  RECEIVE_UPDATE_SPORTS,
  REQUEST_SPORTS,
} from "../actions/sport";

export const initialState = {
  sports: [],
  loading: false,
  metadata: {
    count: 0,
    page: 1
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_SPORTS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_SPORTS:
      return {
        ...state,
        sports: action.payload.metadata.page > 1 ? [...state.sports, ...action.payload.sports] : action.payload.sports,
        metadata: {
          ...state.metadata,
          ...action.payload.metadata,
        },
        loading: false,
      };
    case RECEIVE_ADD_SPORTS:
      return {
        ...state,
        sports: [...state.sports, action.payload.sport],
      };
    case RECEIVE_UPDATE_SPORTS:
      return {
        ...state,
        sports: state.sports.map(item => {
          if (item.id === action.payload.sport.id) {
            return action.payload.sport;
          }
          return item;
        }),
      };
    case RECEIVE_DELETE_SPORTS:
      return {
        ...state,
        sports: state.sports.filter(item => item.id !== action.payload.id),
      };
    default:
      return state;
  }
};
