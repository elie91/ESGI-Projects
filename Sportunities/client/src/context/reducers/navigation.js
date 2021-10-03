import { TOGGLE_NAVIGATION } from "../actions/navigation";

export const initialState = {
  open: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case TOGGLE_NAVIGATION:
      return {
        ...state,
        open: action.payload.open,
      };
    default:
      return state;
  }
};
