<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container>
      <v-card class="mx-auto my-12" max-width="350" :loading="isloading">
        <v-card-text>
          <v-img :src="'/MUASTLOGO.png'"></v-img>
          <v-card-title>Transport Requisition System</v-card-title>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="passwordRules"
            type="password"
            label="password"
            required
          ></v-text-field>
        </v-card-text>
        {{ errors }}
        <v-card-actions>
          <v-btn color="blue" @click="handleLogin"> Login </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-form>
</template>

<style scoped></style>

<script>
export default {
  name: "Login",
  data: () => ({
    valid: false,

 


    isloading: false,

    email: "",
    password: "",

    message: "",
    errors: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => v.length >= 1 || "Password is invalid",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    async handleLogin() {
      this.isloading = true;
      this.$refs.form.validate();
      this.errors = "";

      //  action here

      try {
        await this.$store.dispatch("signIn", {
          email: this.email,
          password: this.password,
        });
        this.$router.push({ name: "welcome" });
      } catch (error) {
        this.errors = error;
      }
    },
  },
};

</script>
