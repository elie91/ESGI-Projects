import React from "react";
import Board from "./Board";
import useBoards from "../../hooks/useBoards";
import useUI from "../../hooks/useUI";

function BoardList() {
  const { selectors } = useBoards();
  const { selectors: UISelectors, actions } = useUI();
  const boards = selectors.getBoards();
  const currentBoard = UISelectors.getSelectedBoard();
  return (
    <React.Fragment>
      <nav style={{ display: "flex", justifyContent: "space-around" }}>
        {boards.map((board) => (
          <li
            key={board.id}
            className={
              Boolean(currentBoard) && currentBoard.id === board.id
                ? "active"
                : null
            }
            onClick={() => actions.select(board)}
          >
            {board.name}
          </li>
        ))}
      </nav>
      {Boolean(currentBoard) && <Board board={currentBoard} />}
      {!Boolean(currentBoard) && "No current Board selected"}
    </React.Fragment>
  );
}

export default BoardList;
