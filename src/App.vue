<template>
  <v-app app>
    <div v-if="authenticated()">
      <!-- <v-btn @click="delee()" to="login">ff</v-btn> -->
      <NavigationMenu />
    </div>
    <v-main>
      <v-snackbar :v-model="popUpMessage()" :timeout="timeout">
        {{ $store.getters.message }}

        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>

      <router-view />
      <!-- <Testaxios /> -->
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
