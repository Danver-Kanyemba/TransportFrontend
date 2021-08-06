import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      // getState: (key) =>Cookies.getJSON(key),
      // setState: (key, state) => Cookies.set(key, state, {expires: 3, secure: true})
      storage: window.sessionStorage,
    }),
  ],

  state: {
    authenticated: false,
    user: null,
    isAdmin: false,
    isTransportOfficer: false,

    // to view pop up
    isMessageVisible: false,
    message: null,

    // for loading using progress linear
    dialogLoading: false,
  },
  getters: {
    authenticated(state) {
      return state.authenticated;
    },
    user(state) {
      return state.user;
    },
    isAdmin(state) {
      return state.isAdmin;
    },
    isTransportOfficer(state) {
      return state.isTransportOfficer;
    },
    isMessageVisible(state) {
      return state.isMessageVisible;
    },    
    dialogLoading(state) {
      return state.dialogLoading;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setAdmin(state, payload) {
      state.isAdmin = payload;
    },
    setTransportOfficer(state, payload) {
      state.isAdmin = payload;
    },
    setauthenticated(state, payload) {
      state.authenticated = payload;
    },
    setisMessageVisible(state, payload) {
      state.isMessageVisible = payload;
    },
    setMessage(state, payload) {
      state.message = payload;
    },
    setDialogLoading(state, payload) {
      state.dialogLoading = payload;
    },    
  },
  actions: {
    async signOut({ commit }) {
      commit("setUser", null);
      commit("setauthenticated", false);
      commit("setAdmin", false);
      commit("setTransportOfficer", false);

      window.sessionStrorage.clear();
    },

    async DialogLoading({ commit }, payload) {
      commit("setDialogLoading", payload);
    },    

    async isMessageVisible({ commit }, payload) {
      commit("setMessage", payload);
      commit("setisMessageVisible", true);

    },

    async signIn({ commit }, payload) {
      try {
        await axios.get("/sanctum/csrf-cookie");

        const res = await axios.post("/api/authenticate", payload);
        if (res.data.status_code != 200) {
          throw res.data.message;
        }
        //

        axios
          .get("/api/user")
          .then((res) => {
            commit("setUser", res.data);
            commit("setauthenticated", true);
          })
          .catch(() => {
            commit("setUser", null);
            commit("setauthenticated", false);
          })
          .then(() => {

        axios
          .get("/api/isadmin")
          .then((res1) => {
            commit("setAdmin", res1.data.isAdmin);
          })
          .catch(() => {
            commit("setAdmin", false);
          })}).then(() => {

        axios
          .get("/api/istransportofficer")
          .then((res2) => {
            commit("setTransportOfficer", res2.data.isTransportOfficer);
          })
          .catch(() => {
            commit("setTransportOfficer", false);
          })});
      } catch (e) {
        throw "User cannot be authenticated";
      }
    },
  },
  async checkAuthenticated({ commit }) {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const res = await axios.get("/api/authenticate");
      if (res.data.status_code != 200) {
        // throw res.data.message;
        commit("setUser", null);
        commit("setauthenticated", false);
      }
      if (res.data.status_code === 200) {
        commit("setUser", res.data);
        commit("setauthenticated", true);
      } else {
        commit("setUser", null);
        commit("setauthenticated", false);
      }
    } catch (e) {
      throw "User cannot be checked if authenticated ";
    }
  },
});
