import React from "react";
import useAuth from "../../hooks/useAuth";

function Login() {
  const { selectors, actions } = useAuth();

  function onSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    actions.login(data);
  }

  return (<>
      { selectors.isConnected() && <span>Connecté bien joué</span>}
      { !selectors.isConnected() && <span>Not Connected</span>}
      <form onSubmit={onSubmit}>
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="username"
          name="username"
        ></input>
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="password"
          name="password"
        ></input>
        <button type="submit">Connexion</button>
      </form>
    </>
  );
}

export default Login;
