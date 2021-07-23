import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  addClub,
  deleteClub,
  fetchClubs,
  fetchClub,
  updateClub,
  RECEIVE_CLUBS,
  RECEIVE_DELETE_CLUBS,
  RECEIVE_UPDATE_CLUBS,
  REQUEST_CLUBS,
  RECEIVE_ADD_CLUBS,
} from "../context/actions/club";

const useClub = () => {
  const {
    state: { clubs: clubsState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getClubs: async (params) => {

      if (clubsState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_CLUBS })

      const clubs = await fetchClubs(params);

      dispatch({
        type: RECEIVE_CLUBS,
        payload: {
          clubs: clubs.data,
          metadata: clubs.metadata,
        },
      });

      return clubs;
    },
    addClub: async (values) => {
      return addClub(values).then((club) => {
        dispatch({
          type: RECEIVE_ADD_CLUBS,
          payload: { club },
        });
      });
    },
    fetchClub: async (id) => await fetchClub(id),
    updateClub: async (values) => {
      return updateClub(values).then((club) => {
        dispatch({
          type: RECEIVE_UPDATE_CLUBS,
          payload: {
            club,
          },
        });
      });
    },
    deleteClub: async (id) => {
      return deleteClub(id).then(() => {
        dispatch({
          type: RECEIVE_DELETE_CLUBS,
          payload: { id: id },
        });
      });
    },
  };

  const selectors = {
    getClubs: () => {
      return clubsState.clubs;
    },
    isLoading: () => {
      return clubsState.loading;
    },
    isEmpty: () => {
      return clubsState.clubs.length === 0;
    },
    getMetadata: () => {
      return clubsState.metadata;
    },
  };

  return { actions, selectors };
};

export default useClub;
