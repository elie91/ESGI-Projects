import Vue from "vue";
import Vuex from "vuex";
import endpoint from "@/store/modules/endpoint";
import user from "@/store/modules/user";
import event from "@/store/modules/event";
import flash from "@/store/modules/flash";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    endpoint: endpoint,
    user: user,
    flash: flash,
    event: event
  },
});
