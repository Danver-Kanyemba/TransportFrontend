<template>
  <div>
    <v-navigation-drawer app permanent expand-on-hover color="blue" dark>
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar color="brown" size="48">
            <span class="white--text text-h5">{{
              user.data[0].name.charAt(0)
            }}</span>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link three-line>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ user.data[0].name }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ user.data[0].department_name }}
            </v-list-item-subtitle>

            <v-list-item-subtitle>
              {{ user.data[0].email }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item link to="/welcome">
          <v-list-item-icon>
            <v-icon>mdi-hand</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Welcome</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/">
          <v-list-item-icon>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/RequestTransport">
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Request Transport</v-list-item-title>
        </v-list-item>

        <v-list-item
          link
          to="/TransportManagerHome"
          v-if="isTransportOfficer()"
        >
          <v-list-item-icon>
            <v-icon>mdi-car</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Transport Manager</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/about">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>About</v-list-item-title>
        </v-list-item>
        <div v-if="isAdmin()">
          <v-list-group :value="false" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>mdi-account</v-icon>
                  Admin</v-list-item-title
                >
              </v-list-item-content>
            </template>

            <v-list-item link to="/DepartmentsList">
              <v-list-item-icon>
                <v-icon>mdi-group</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Departments</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/UsersList">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Users</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/Adminlist">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Admins</v-list-item-title>
            </v-list-item>  
            <v-list-item link to="/TransportList">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Transport Officers</v-list-item-title>
            </v-list-item>                       
          </v-list-group>
        </div>

        <v-list-item link @click="logout()">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
    </v-navigation-drawer>
  </div>
</template>
<script>
export default {
  name: "NavigationMenu",
  data: () => ({
    user: [],
    // <!-- <v-btn to="/login" text>Login</v-btn>
    // <v-btn to="/Register">Register</v-btn>
    // <v-btn to="/DepartmentsList">Departments List</v-btn> -->
    //
  }),
  methods: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    isTransportOfficer() {
      return this.$store.getters.isTransportOfficer;
    },
    logout() {
      // store for signing out
      this.$store.dispatch("signOut");

      this.$http.get("/sanctum/csrf-cookie").then((res) => {
        this.$http
          .post("/api/logout")
          .then((response) => {
            console.log(res);
            console.log(response);
            window.sessionStorage.clear();
            this.$router.push("/login");
            this.$router.go();
          })
          .catch((errors) => {
            this.errors = errors.response.data.errors;
          });
      });
    },
  },
  mounted() {
    this.$http.get("/api/munhuwacho").then((res) => {
      this.user = res.data;
      console.log(res);
    });
  },
};
</script>
