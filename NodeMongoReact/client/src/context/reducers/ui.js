export const initialState = {
  selectedBoard: undefined,
  message: undefined,
};

/**
 * action = {type: String, payload: any}
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case "SELECT_BOARD":
      return {
        ...state,
        selectedBoard: action.payload,
      };
    case "RECEIVE_NEW_LIST":
      return {
        ...state,
        message: "Operation terminée",
      };
    default:
      return state;
  }
};
