export const fetchLists = (board) =>
  fetch(`http://localhost:3002/boards/${board.id}/lists`).then((res) =>
    res.json()
  );

export const addList = (list) =>
  fetch(`http://localhost:3002/lists`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(list),
  }).then((res) => res.json());
