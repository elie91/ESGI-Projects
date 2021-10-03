import {
  RECEIVE_PLAYERS, RECEIVE_PLAYERS_FAMOUS,
  REQUEST_PLAYERS, REQUEST_PLAYERS_FAMOUS,
} from "../actions/player";

export const initialState = {
  players: [],
  famous: [],
  loading: false,
  loadingFamous: false
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_PLAYERS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_PLAYERS:
      return {
        ...state,
        players: action.payload.players,
        loading: false,
      };
    case REQUEST_PLAYERS_FAMOUS:
      return {
        ...state,
        loadingFamous: true,
      };
    case RECEIVE_PLAYERS_FAMOUS:
      return {
        ...state,
        famous: action.payload.players.rows,
        loadingFamous: false,
      };
    default:
      return state;
  }
};
