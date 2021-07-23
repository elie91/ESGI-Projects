import React, { createContext, useContext, useState, useMemo } from "react";
import jwt_decode from "jwt-decode";
import {
  signIn,
  signUp,
  resetPassword,
  updateUser,
  fetchUser,
  tokenResetPassword,
  deleteUser,
} from "./actions/security";
import { LS_JWT_TOKEN, LS_USER } from "../config/constant";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export const AuthContext = createContext({ user: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem(LS_USER) ? JSON.parse(localStorage.getItem(LS_USER)) : null);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const actions = {
    signIn: function (email, password) {
      return new Promise(((resolve, reject) => {
        return signIn(email, password).then((token) => {
          localStorage.setItem(LS_JWT_TOKEN, token);
          const profile = jwt_decode(token);
          return this.fetchUser(profile.id).then((r => {
            let user = {
              ...profile,
              ...r,
            };
            localStorage.setItem(LS_USER, JSON.stringify(user));
            setUser(user);
            resolve(user);
          }));

        }).catch((e) => reject(e));
      }));

    },
    signUp: async (values) => await signUp(values),
    signOut: () => {
      localStorage.removeItem(LS_USER);
      localStorage.removeItem(LS_JWT_TOKEN);
      setUser(null);
    },
    fetchUser: (id) => {
      return fetchUser(id).then((result) => {
        return result;
      });
    },
    deleteUser: (id) => {
      return deleteUser(id);
    },
    resetPassword: (values) => resetPassword(values),
    tokenResetPassword: (values) => tokenResetPassword(values),
    update: async (values) => {
      if (!values.id) values.id = user.id;
      let _user = await updateUser(values);
      _user = { ...values, ..._user };
      localStorage.setItem(LS_USER, JSON.stringify(_user));
      setUser(_user);
      return _user;
    },
    refreshUser: async (values) => {
      const user = await fetchUser(values.id);
      let data = {
        ...values,
        ...user,
      };
      localStorage.setItem(LS_USER, JSON.stringify(data));
      setUser(data);
      return data;
    },
    receiveUpdateAgent: (agent) => {
      const temp = {
        ...user,
        agent,
      };
      enqueueSnackbar(t("agent." + (agent.isConfirmed ? "approved": "disapproved")), { variant: "info" });
      localStorage.setItem(LS_USER, JSON.stringify(temp));
      setUser(temp);
    },
  };

  if (user && (user.exp * 1000 < new Date().getTime())) {
    actions.signOut();
  }

  const selectors = {};

  return useMemo(
    () => (
      <AuthContext.Provider value={{ user, actions, selectors }}>
        {children}
      </AuthContext.Provider>
    ),
    [children, user, selectors, actions]);
};

export const useAuth = () => {
  return useContext(AuthContext);
};
