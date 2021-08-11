<template>
  <v-app app>
    <div v-if="authenticated()">
      <NavigationMenu />
    </div>
    <v-main>
      <v-container fluid>
        <v-snackbar v-model="this.$store.isMessageVisible" :timeout="timeout">
          <template v-slot:action="{ attrs }">
            <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <v-dialog
          v-model="this.$store.getters.dialogLoading"
          hide-overlay
          persistent
          width="300"
        >
          <v-card color="primary" dark>
            <v-card-text>
              Please stand by
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>

        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import NavigationMenu from "./views/NavigationMenu.vue";
// import Testaxios from "./views/Testaxios.vue";

export default {
  name: "App",

  components: {
    NavigationMenu,
    // Testaxios,
  },
  data: () => ({
    snackbar: false,
    timeout: 3000,
  }),
  methods: {
    authenticated() {
      return this.$store.getters.authenticated;
    },
    popUpMessage() {
      return this.$store.getters.setisMessageVisible;
    },
    delee() {
      this.$store.state.isAdmin = true;
    },
    dialogLoading() {
      return this.$store.getters.dialogLoading;
    },
  },
  mounted() {
    try {
      this.$store.dispatch("checkAuthenticated");
      if (this.$store.getters.authenticated) {
        // this.$router.push({ name: "Home" });
      } else {
        this.$router.push({ name: "login" });
      }
    } catch (error) {
      this.errors = error;
    }
  },
};
</script>
