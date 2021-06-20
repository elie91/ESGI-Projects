import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  CHANGE_MAP_LOCATION, MOBILE_DRAWER,
} from "../context/actions/map";

const useMap = () => {
  const {
    state: { map: mapState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    changeMapLocation: async (location) => {
      dispatch({
        type: CHANGE_MAP_LOCATION,
        payload: { location },
      });
    },
    openDrawer: async (value) => {
      dispatch({
        type: MOBILE_DRAWER,
        payload: { open: value },
      });
    },
  };

  const selectors = {
    getMapLocation: () => {
      return mapState.location;
    },
    isOpen: () => {
      return mapState.open;
    },

  };

  return { actions, selectors };
};

export default useMap;
