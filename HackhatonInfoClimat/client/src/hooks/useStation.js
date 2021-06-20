import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  fetchStations,
  fetchStation,
  RECEIVE_STATIONS,
  REQUEST_STATIONS, CLEAR_STATIONS,
  fetchStationGraph,
} from "../context/actions/station";

const useStation = () => {
  const {
    state: { stations: stationsState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getStations: async (params) => {

      if (stationsState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_STATIONS });

      const stations = await fetchStations(params);

      dispatch({
        type: RECEIVE_STATIONS,
        payload: {
          stations: stations.rows,
          metadata: {
            count: stations.count,
          },
        },
      });

      return stations;
    },
    fetchStation: async (id) => await fetchStation(id),
    clear: () => {
      dispatch({
        type: CLEAR_STATIONS,
      });
    },
    fetchStationGraph: async (params) => await fetchStationGraph(params),
  };

  const selectors = {
    getStations: () => {
      return stationsState.stations;
    },
    isLoading: () => {
      return stationsState.loading;
    },
    getLength: () => {
      return stationsState.stations.length;
    },
    isEmpty: () => {
      return stationsState.stations.length === 0;
    },
    getMetadata: () => {
      return stationsState.metadata;
    },
  };

  return { actions, selectors };
};

export default useStation;
