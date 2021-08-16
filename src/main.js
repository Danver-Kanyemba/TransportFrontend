import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";
import axios from "axios";
import vuex from "vuex";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://job.danversoft.co.zw/public";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
new Vue({
  router,
  vuex,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
