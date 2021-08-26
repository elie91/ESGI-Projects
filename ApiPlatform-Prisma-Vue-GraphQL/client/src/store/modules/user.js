import {LS_TOKEN, LS_USER, ROLE_ADMIN, ROLE_RENTER} from "../../../config/constant";
import jwt_decode from "jwt-decode";

export default {
  state: {
    user: localStorage.getItem(LS_USER) ? JSON.parse(localStorage.getItem(LS_USER)) : null,
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    isAuthenticated: state => {
      return !!state.user;
    },
    isAdmin: state => {
      return state.user?.roles?.includes(ROLE_ADMIN);
    },
    isRenter: state => {
      return state.user?.roles?.includes(ROLE_RENTER);
    },
  },
  mutations: {
    signIn(state, payload) {
      const token = payload.token;
      localStorage.setItem(LS_TOKEN, token);
      let user = jwt_decode(token);
      if (!user['@id']) {
        user = {
          ...user,
          '@id': `/users/${user.id}`
        }
      }
      state.user = user;
      localStorage.setItem(LS_USER, JSON.stringify(user));
    },
    signOut(state) {
      state.user = null;
      localStorage.removeItem(LS_USER);
      localStorage.removeItem(LS_TOKEN);
    },
    refreshUser(state, payload) {
      state.user = payload;
      localStorage.setItem(LS_USER, JSON.stringify(payload));
    },
    checkValidity(state) {
      if (state.user) {
        const expired_at = new Date(state.user.exp * 1000).getTime();
        const now = new Date().getTime();
        if (now > expired_at) {
          state.user = null;
          localStorage.removeItem(LS_USER);
          localStorage.removeItem(LS_TOKEN);
        }
      }
    },
  },
  actions: {
    signOut({commit}) {
      return new Promise((resolve) => {
        commit("signOut");
        resolve();
      });
    },
  },
};
