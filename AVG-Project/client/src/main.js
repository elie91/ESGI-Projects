import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import RouterPrefetch from "vue-router-prefetch";
import router from "./router/index";
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";
import apolloProvider from "./plugins/apollo";
import store from "./store";
import vueDebounce from "vue-debounce";
import VCalendar from 'v-calendar';
import "@/assets/sass/style.scss";

Vue.use(VueRouter);
Vue.use(RouterPrefetch);
Vue.use(vueDebounce);
Vue.use(VCalendar)

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  i18n,
  apolloProvider,
  render: h => h(App),
}).$mount("#app");
