import { useContext } from "react";
import jwtDecode from "jwt-decode";
import RootContext from "../context/boardContext";
import { login } from "../context/actions/auth";

const useAuth = () => {
  const {
    state: { auth: authState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    login: (data) => {
      login(data).then((data) => {
        console.log(data);
        const user = jwtDecode(data.token);
        localStorage.setItem("token", data.token);
        dispatch({
          type: "LOGIN",
          payload: {
            user,
            token: data.token,
          },
        });
      });
    },
  };

  const selectors = {
    isConnected: () => {
      return Boolean(authState.token);
    },
  };

  return { selectors, actions };
};

export default useAuth;
