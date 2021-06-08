export const fetchLists = async (board) => {
  const key = "lists-" + board.id;
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const addList = async (list) => {
  const key = "lists-" + list.boardId;
  const lists = JSON.parse(localStorage.getItem(key)) || [];
  localStorage.setItem(key, JSON.stringify([...lists, list]));
  return list;
};
