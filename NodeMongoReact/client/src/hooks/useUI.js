import { useContext } from "react";
import BoardContext from "../context/boardContext";

const useUI = () => {
  const {
    state: { ui: uiState },
    dispatch,
  } = useContext(BoardContext);

  const actions = {
    select: (board) => dispatch({ type: "SELECT_BOARD", payload: board }),
  };

  const selectors = {
    getSelectedBoard: () => uiState.selectedBoard,
    getMessage: () => uiState.message,
  };

  return { selectors, actions };
};

export default useUI;
