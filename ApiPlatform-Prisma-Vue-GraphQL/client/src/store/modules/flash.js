export default {
  state: {
    flashMessages: [],
  },
  getters: {
    getFlashMessages: state => {
      return state.flashMessages;
    },
    hasFlashMessages: state => {
      return state.flashMessages.length !== 0;
    },
  },
  mutations: {
    addFlashMessage (state, payload) {
      state.flashMessages.push({ type: payload.type, message: payload.message });
    },
    clearFlashMessage (state) {
      state.flashMessages = [];
    },
  },
};
