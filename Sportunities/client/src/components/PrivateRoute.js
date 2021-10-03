import React from "react";
import { Redirect, Route } from "react-router-dom";
import { RT_LOGIN } from "../config/routes";
import { useAuth } from "../context/AuthContext";
import { ROLE_ADMIN, ROLE_AGENT, ROLE_PLAYER, URL_BY_ROLES } from "../config/constant";

function PrivateRoute ({
  component: Component,
  admin = false,
  agent = false,
  player = false,
  loginPath = RT_LOGIN,
  ...rest
}) {
  const { user } = useAuth();

  const redirectUrl = () => {
    const getUrl = URL_BY_ROLES.find(item => item.role === user?.role[0]);

    if (getUrl) {
      if (admin && !user.role.includes(ROLE_ADMIN)) {
        return getUrl.url;
      }
      if (agent && !user.role.includes(ROLE_AGENT)) {
        return getUrl.url;
      }
      if (player && !user.role.includes(ROLE_PLAYER)) {
        return getUrl.url;
      }
    }
    return null;
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          if (redirectUrl()) {
            return <Redirect
              to={{
                pathname: redirectUrl(),
                state: { from: props.location },
              }}
            />;
          }
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: loginPath,
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
}

export default PrivateRoute;
