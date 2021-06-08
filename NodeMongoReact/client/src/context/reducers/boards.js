export const initialState = {
  boards: [],
  lists: {},
};

/**
 * action = {type: String, payload: any}
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case "RECEIVE_BOARDS":
      return {
        ...state,
        boards: action.payload,
      };
    case "RECEIVE_LISTS":
      return {
        ...state,
        lists: {
          ...state.lists,
          [action.payload.board.id]: action.payload.lists,
        },
      };
    case "RECEIVE_NEW_LIST":
      return {
        ...state,
        lists: {
          ...state.lists,
          [action.payload.board.id]: [
            ...state.lists[action.payload.board.id],
            action.payload.list,
          ],
        },
      };
    case "RECEIVE_DELETE_LIST":
      return {
        ...state,
        lists: {
          ...state.lists,
          [action.payload.board.id]: state.lists[
            action.payload.board.id
          ].filter((list) => list.id !== action.payload.list.id),
        },
      };
    case "RECEIVE_UPDATE_LIST":
      return {
        ...state,
        lists: {
          ...state.lists,
          [action.payload.board.id]: state.lists[
            action.payload.board.id
          ].map((list) =>
            list.id !== action.payload.list.id ? list : action.payload.list
          ),
        },
      };
    default:
      return state;
  }
};
