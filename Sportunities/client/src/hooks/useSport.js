import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  addSport,
  deleteSport,
  fetchSports,
  fetchSport,
  updateSport,
  RECEIVE_SPORTS,
  RECEIVE_DELETE_SPORTS,
  RECEIVE_UPDATE_SPORTS,
  REQUEST_SPORTS,
  RECEIVE_ADD_SPORTS,
} from "../context/actions/sport";

const useSport = () => {
  const {
    state: { sports: sportsState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getSports: async (params) => {

      if (sportsState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_SPORTS });

      const sports = await fetchSports(params);

      dispatch({
        type: RECEIVE_SPORTS,
        payload: {
          sports: sports.data,
          metadata: sports.metadata,
        },
      });

      return sports;
    },
    addSport: async (values) => {
      return addSport(values).then((sport) => {
        dispatch({
          type: RECEIVE_ADD_SPORTS,
          payload: { sport },
        });
      });
    },
    fetchSport: async (id) => await fetchSport(id),
    updateSport: async (values) => {
      return updateSport(values).then((sport) => {
        dispatch({
          type: RECEIVE_UPDATE_SPORTS,
          payload: {
            sport,
          },
        });
      });
    },
    deleteSport: async (id) => {
      return deleteSport(id).then(() => {
        dispatch({
          type: RECEIVE_DELETE_SPORTS,
          payload: { id: id },
        });
      });
    },
  };

  const selectors = {
    getSports: () => {
      return sportsState.sports;
    },
    getSportsMetadata: () => {
      return sportsState.sports.metadata;
    },
    isLoading: () => {
      return sportsState.loading;
    },
    isEmpty: () => {
      return sportsState.sports.length === 0;
    },
    getMetadata: () => {
      return sportsState.metadata;
    },
  };

  return { actions, selectors };
};

export default useSport;
