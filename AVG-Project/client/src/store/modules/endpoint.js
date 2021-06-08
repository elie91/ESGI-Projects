import {ENDPOINTS} from "../../../config/entrypoint";

export default {
  state: {
    currentEndpoint: localStorage.getItem('endpoint') ? JSON.parse(localStorage.getItem('endpoint')) : ENDPOINTS[0],
  },
  getters: {
    getEndpointImage: state => {
      return require("@/assets/" + state.currentEndpoint.image);
    },
    getEndpointLabel: state => {
      return state.currentEndpoint.label;
    },
    getEndpointUrl: state => {
      return state.currentEndpoint.url;
    },
    apiSelected: state => {
      return !(state.currentEndpoint.label === ENDPOINTS[0].label)
    }
  },
  mutations: {
    switchEndpoint(state, payload) {
      state.currentEndpoint = ENDPOINTS[payload ? 1 : 0];
    },
  },
  actions: {},
};
