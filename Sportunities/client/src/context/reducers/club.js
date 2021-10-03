import {
  RECEIVE_ADD_CLUBS,
  RECEIVE_DELETE_CLUBS,
  RECEIVE_CLUBS,
  RECEIVE_UPDATE_CLUBS,
  REQUEST_CLUBS,
} from "../actions/club";

export const initialState = {
  clubs: [],
  loading: false,
  metadata: {
    count: 0,
    page: 1
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_CLUBS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_CLUBS:
      return {
        ...state,
        clubs: action.payload.metadata.page > 1 ? [...state.clubs, ...action.payload.clubs] : action.payload.clubs,
        metadata: {
          ...state.metadata,
          ...action.payload.metadata,
        },
        loading: false,
      };
    case RECEIVE_ADD_CLUBS:
      return {
        ...state,
        clubs: [...state.clubs, action.payload.club],
      };
    case RECEIVE_UPDATE_CLUBS:
      return {
        ...state,
        clubs: state.clubs.map(item => {
          if (item.id === action.payload.club.id) {
            return action.payload.club;
          }
          return item;
        }),
      };
    case RECEIVE_DELETE_CLUBS:
      return {
        ...state,
        clubs: state.clubs.filter(item => item.id !== action.payload.id),
      };
    default:
      return state;
  }
};
