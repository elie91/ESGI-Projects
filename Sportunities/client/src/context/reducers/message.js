import {
  RECEIVE_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_MERCURE_MESSAGES,
} from "../actions/message";

export const initialState = {
  messages: [],
  loading: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_MESSAGES:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_MESSAGES:
      return {
        ...state,
        messages: action.payload.messages,
        loading: false,
      };
    case RECEIVE_MERCURE_MESSAGES:
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };
    default:
      return state;
  }
};
