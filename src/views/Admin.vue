<template>
  <div>
    <br />{{ adminVisible }}
    <v-row justify="center">
      <v-card elevation="0">
        <v-list v-for="item in AdminOptions" :key="item.key">
          <v-list-item :to="item.link">
            <v-list-item-content>
              <v-icon>{{ item.icon }}</v-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "Admin",
  data: () => ({
    adminVisible: false,
    AdminOptions: [
      {
        key: "0",
        icon: "mdi-group",
        title: "Departments",
        link: "/DepartmentsList",
      },
      { key: "1", icon: "mdi-account", title: "Users", link: "/UsersList" },
    ],
  }),
  mounted() {
    if (this.$store.getters.isAdmin) {
      this.adminVisible = true;
    } else {
      this.$router.push({ name: "Home" });
    }
  },
};
</script>
