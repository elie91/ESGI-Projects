import {
  RECEIVE_EVENTS,
  REQUEST_EVENTS,
  OPEN_MODAL,
  CLOSE_MODAL,
} from "../actions/event";

export const initialState = {
  events: [],
  loading: false,
  metadata: {
    count: 0,
    location: null,
  },
  modal: {
    open: false,
    event: null,
  },
};

export const reducer = (state, action) => {
  switch (action.type) {

    case REQUEST_EVENTS:
      return {
        ...state,
        loading: true,
      };

    case RECEIVE_EVENTS:

      let object = {
        ...state,
        loading: false,
        metadata: action.payload.metadata,
      };

      if (action.payload.metadata.location === state.metadata.location) {
        if (action.payload.filter) {
          object = {
            ...object,
            events: action.payload.events,
            metadata: {
              ...object.metadata,
              count: 0,
              page: 1,
            },
          };
        } else {
          object = {
            ...object,
            events: [...state.events, ...action.payload.events],
          };
        }

      } else {
        object = {
          ...object,
          events: action.payload.events,
          metadata: {
            ...object.metadata,
            count: 0,
            page: 1,
          },
        };

      }

      return object;
    case OPEN_MODAL:
      return {
        ...state,
        modal: {
          open: true,
          event: action.payload,
        },
      };

    case CLOSE_MODAL:
      return {
        ...state,
        modal: {
          open: false,
          event: null,
        },

      };
    default:
      return state;
  }
};
