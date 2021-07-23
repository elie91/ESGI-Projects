import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import { TOGGLE_NAVIGATION } from "../context/actions/navigation";

const useNavigation = () => {
  const {
    state: { navigation: navigationState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    toggleNavigation: (value) => {
      dispatch({
        type: TOGGLE_NAVIGATION,
        payload: { open: value },
      });
    },
  };

  const selectors = {
    isOpen: () => {
      return navigationState.open;
    },
  };

  return { actions, selectors };
};

export default useNavigation;
