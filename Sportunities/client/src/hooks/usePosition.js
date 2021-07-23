import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  addPosition,
  deletePosition,
  fetchPositions,
  fetchPosition,
  updatePosition,
  RECEIVE_POSITIONS,
  RECEIVE_DELETE_POSITIONS,
  RECEIVE_UPDATE_POSITIONS,
  REQUEST_POSITIONS,
  RECEIVE_ADD_POSITIONS,
} from "../context/actions/position";

const usePosition = () => {
  const {
    state: { positions: positionsState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getPositions: async (params) => {

      if (positionsState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_POSITIONS });

      const positions = await fetchPositions(params);

      dispatch({
        type: RECEIVE_POSITIONS,
        payload: {
          positions: positions.data,
          metadata: positions.metadata,
        },
      });

      return positions;
    },
    addPosition: async (values) => {
      return addPosition(values).then((position) => {
        dispatch({
          type: RECEIVE_ADD_POSITIONS,
          payload: { position },
        });
      });
    },
    fetchPosition: async (id) => await fetchPosition(id),
    updatePosition: async (values) => {
      return updatePosition(values).then((position) => {
        dispatch({
          type: RECEIVE_UPDATE_POSITIONS,
          payload: {
            position,
          },
        });
      });
    },
    deletePosition: async (id) => {
      return deletePosition(id).then(() => {
        dispatch({
          type: RECEIVE_DELETE_POSITIONS,
          payload: { id: id },
        });
      });
    },
  };

  const selectors = {
    getPositions: () => {
      return positionsState.positions;
    },
    getPositionsBySport: (id) => {
      return positionsState.positions.filter(position => position.sport_id === parseInt(id, 10));
    },
    isLoading: () => {
      return positionsState.loading;
    },
    isEmpty: () => {
      return positionsState.positions.length === 0;
    },
    getMetadata: () => {
      return positionsState.metadata;
    },
  };

  return { actions, selectors };
};

export default usePosition;
