<template>
  <!-- this is for desplaying the username 
not that important but for testing
-->

  <div class="about">
    <h1>This is an about {{ user }}</h1>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-btn @click="snackbar = true">open</v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: [],
    snackbar: false,
    timeout: 2000,
    message: "",
  }),
  mounted() {
    this.$http.get("/api/user").then((res) => {
      this.user = res.data.name;
      console.log(res);
    });
  },
};
</script>
