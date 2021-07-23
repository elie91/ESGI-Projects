import {
  RECEIVE_ADD_POSITIONS,
  RECEIVE_DELETE_POSITIONS,
  RECEIVE_POSITIONS,
  RECEIVE_UPDATE_POSITIONS,
  REQUEST_POSITIONS,
} from "../actions/position";

export const initialState = {
  positions: [],
  loading: false,
  metadata: {
    count: 0,
    page: 1
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_POSITIONS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_POSITIONS:

      return {
        ...state,
        positions: action.payload.metadata.page > 1 ? [...state.positions, ...action.payload.positions] : action.payload.positions,
        metadata: {
          ...state.metadata,
          ...action.payload.metadata,
        },
        loading: false,
      };
    case RECEIVE_ADD_POSITIONS:
      return {
        ...state,
        positions: [...state.positions, action.payload.position],
      };
    case RECEIVE_UPDATE_POSITIONS:
      return {
        ...state,
        positions: state.positions.map(item => {
          if (item.id === action.payload.position.id) {
            return action.payload.position;
          }
          return item;
        }),
      };
    case RECEIVE_DELETE_POSITIONS:
      return {
        ...state,
        positions: state.positions.filter(item => item.id !== action.payload.id),
      };
    default:
      return state;
  }
};
