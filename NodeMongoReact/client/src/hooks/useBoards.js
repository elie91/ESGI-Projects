import { useContext } from "react";
import BoardContext from "../context/boardContext";
import { fetchLists, addList } from "../context/actions/lists";
import { fetchBoards } from "../context/actions/boards";

const useBoards = () => {
  const {
    state: { boards: boardsState },
    dispatch,
  } = useContext(BoardContext);

  const actions = {
    fetchBoards: function () {
      fetchBoards().then((data) => {
        dispatch({
          type: "RECEIVE_BOARDS",
          payload: data,
        });
        //this.select(data[0]);
      });
    },
    fetchList: (board) =>
      !boardsState.lists[board.id] &&
      fetchLists(board).then((data) =>
        dispatch({
          type: "RECEIVE_LISTS",
          payload: {
            board,
            lists: data,
          },
        })
      ),
    addList: function (list, board) {
      list.boardId = board.id;
      addList(list).then((data) =>
        dispatch({
          type: "RECEIVE_NEW_LIST",
          payload: {
            board,
            list: data,
          },
        })
      );
    },
  };

  const selectors = {
    getLists: (board) => boardsState.lists[board.id],
    getList: (board, id) =>
      boardsState.lists[board.id].find((list) => list.id === id),
    getBoards: () => boardsState.boards,
  };

  return { selectors, actions };
};

export default useBoards;
