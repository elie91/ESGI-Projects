export const fetchBoards = () =>
  fetch("http://localhost:3002/boards").then((res) => res.json());
