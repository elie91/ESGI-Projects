import React from "react";
import useBoards from "../../../hooks/useBoards";

const List = ({ list }) => {
  const { selectors } = useBoards();
  const boards = selectors.getBoards();

  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
      {list.name}
      <span>Count {boards.length}</span>
    </div>
  );
};

export default List;
