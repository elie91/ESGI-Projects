import React, { useState, useEffect, useContext } from "react";
import List from "./List";
import Form from "./Form";
import BoardContext from "../../context/boardContext";
import useBoards from "../../hooks/useBoards";
import useUI from "../../hooks/useUI";

function Board({ board }) {
  const { selectors, actions } = useBoards();
  const { selectors: UISelectors } = useUI();
  const lists = selectors.getLists(board);

  useEffect(() => {
    actions.fetchList(board);
  }, [board.id]);

  return (
    <>
      <h1>
        {board.name} {lists && lists.length}
      </h1>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Form addList={(list) => actions.addList(list, board)} />
        {lists &&
          lists.map((list) => {
            return <List key={list.id} list={list} />;
          })}
      </div>
      {UISelectors.getMessage() ? <p>{UISelectors.getMessage()}</p> : null}
    </>
  );
}

export default Board;
