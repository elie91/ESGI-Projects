import {
  CHANGE_MAP_LOCATION, MOBILE_DRAWER,
} from "../actions/map";

export const initialState = {
  location: [47.0035268306476, 2.65755284784513],
  open: false,
};

export const reducer = (state, action) => {
  switch (action.type) {

    case CHANGE_MAP_LOCATION:
      return {
        ...state,
        location: action.payload,
      };
    case MOBILE_DRAWER:
      return {
        ...state,
        open: action.payload.open,
      };

    default:
      return state;
  }
};
