import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

// Storing data in the browser of the user
export default new Vuex.Store({
  plugins: [
    createPersistedState({
      // getState: (key) =>Cookies.getJSON(key),
      // setState: (key, state) => Cookies.set(key, state, {expires: 3, secure: true})
      storage: window.sessionStorage,
    }),
  ],

  state: {
    // is authenticated
    authenticated: false,

    // storing user data
    user: null,

    // state for admin
    isAdmin: false,

    // state for Transort Officer
    isTransportOfficer: false,

    // to view pop up
    isMessageVisible: false,
    message: null,

    // for loading using progress linear
    dialogLoading: false,
  },
  getters: {
    // getters for auth
    authenticated(state) {
      return state.authenticated;
    },
    // getters for user
    user(state) {
      return state.user;
    },
    // getters for admin
    isAdmin(state) {
      return state.isAdmin;
    },
    // getters for Tansport Officer
    isTransportOfficer(state) {
      return state.isTransportOfficer;
    },
    // getters for message
    isMessageVisible(state) {
      return state.isMessageVisible;
    },
    // getters for dialog
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
      state.isTransportOfficer = payload;
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
    // action for sign out
    async signOut({ commit }) {
      commit("setUser", null);
      commit("setauthenticated", false);
      commit("setAdmin", false);
      commit("setTransportOfficer", false);

      window.sessionStrorage.clear();
    },
    // action for dialog loading
    async DialogLoading({ commit }, payload) {
      commit("setDialogLoading", payload);
    },
    // action for message
    async isMessageVisible({ commit }, payload) {
      commit("setMessage", payload);
      commit("setisMessageVisible", true);
    },
    // action for signIn
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
              });
          })
          .then(() => {
            axios
              .get("/api/istransportofficer")
              .then((res2) => {
                commit("setTransportOfficer", res2.data.isTransportOfficer);
              })
              .catch(() => {
                commit("setTransportOfficer", false);
              });
          });
      } catch (e) {
        throw "User cannot be authenticated";
      }
    },
  },
  // action for checking if authenticated
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
