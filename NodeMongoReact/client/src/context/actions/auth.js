export const login = (data) => {
  return fetch("http://localhost:3003/login_check", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "application/json"
    }
  }).then((res) => res.json());
};
