import jwt_decode from "jwt-decode";

export const initialState = {
  user: localStorage.getItem("token")
    ? jwt_decode(localStorage.getItem("token"))
    : null,
  token: localStorage.getItem("token"),
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
