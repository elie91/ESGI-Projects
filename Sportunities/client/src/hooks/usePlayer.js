import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  fetchPlayers,
  fetchPlayer,
  RECEIVE_PLAYERS,
  REQUEST_PLAYERS,
  updatePlayer,
  RECEIVE_UPDATE_PLAYERS,
  addPlayer,
  REQUEST_PLAYERS_FAMOUS,
  RECEIVE_PLAYERS_FAMOUS,
  fetchFamousPlayers,
} from "../context/actions/player";

const usePlayer = () => {
  const {
    state: { players: playersState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getPlayers: async (params) => {
      if (playersState.loading) {
        return false;
      }
      dispatch({ type: REQUEST_PLAYERS });
      const players = await fetchPlayers(params);
      dispatch({
        type: RECEIVE_PLAYERS,
        payload: { players },
      });
      return players;
    },
    getFamousPlayers: async (params) => {
      if (playersState.loadingFamous) {
        return false;
      }
      dispatch({ type: REQUEST_PLAYERS_FAMOUS });

      const players = await fetchFamousPlayers(params);

      dispatch({
        type: RECEIVE_PLAYERS_FAMOUS,
        payload: { players },
      });
      return players;
    },
    fetchPlayer: async (id) => await fetchPlayer(id),
    updatePlayer: async (values) => {
      const player = await updatePlayer(values);

      dispatch({
        type: RECEIVE_UPDATE_PLAYERS,
        payload: {
          player,
        },
      });

      return player;
    },
    addPlayer: async (values) => await addPlayer(values),
  };

  const selectors = {
    getPlayers: () => {
      return playersState.players;
    },
    getFamousPlayers: () => {
      return playersState.famous;
    },
    isLoading: () => {
      return playersState.loading;
    },
    isLoadingFamous: () => {
      return playersState.loadingFamous;
    },
    isEmpty: () => {
      return playersState.players.length === 0;
    },
    isEmptyFamous: () => {
      return playersState.famous.length === 0;
    },
    getMetadata: () => {
      return {};
    },
  };

  return { actions, selectors };
};

export default usePlayer;
