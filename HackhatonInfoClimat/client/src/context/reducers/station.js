import {
  CLEAR_STATIONS,
  RECEIVE_STATIONS,
  REQUEST_STATIONS,
} from "../actions/station";

export const initialState = {
  stations: [],
  loading: false,
  metadata: {
    count: 0,
    location: null,
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_STATIONS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_STATIONS:
      return {
        ...state,
        loading: false,
        metadata: action.payload.metadata,
        stations: action.payload.stations,
      };
    case CLEAR_STATIONS:
      return {
        stations: [],
        metadata: {
          count: 0,
          location: null,
        },
      }
    default:
      return state;
  }
};
