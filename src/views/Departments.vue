<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-container>
      <v-card class="mx-auto my-12">
        <v-card-text>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Full Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            v-model="cell"
            :rules="nameRules"
            label="Cell"
            required
          ></v-text-field>
          {{ department_id }}
          <v-select
            :items="department"
            item-text="name"
            :menu-props="{ top: true, offsetY: true }"
            label="Department"
            item-value="id"
            v-model="department_id"
          ></v-select>

          <v-text-field
            v-model="password"
            :rules="passwordRules"
            type="password"
            label="password"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn color="blue" @click="handleRegister"> Register </v-btn>
        </v-card-actions>
      </v-card>
      <p v-text="errors.email"></p>
      <p v-text="errors.password"></p>
    </v-container>
  </v-form>
</template>
<script>
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://api.larawithsanctum.test/";

export default {
  name: "Register",

  data: () => ({
    valid: false,
    name: "",
    email: "",
    cell: "",
    password: "",
    errors: {},
    department: [],
    department_id: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => v.length >= 1 || "Password is invalid",
    ],

    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    nameRules: [(v) => !!v || "Name is required"],
  }),

  mounted() {
    console.log("component is mounted"),
      axios
        .get("/api/departments")
        .then((res) => {
          this.department = res.data;
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
        });
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },

    handleRegister() {
      axios.get("/sanctum/csrf-cookie").then((res) => {
        axios
          .post("/api/register", {
            name: this.name,
            email: this.email,
            cell: this.cell,
            password: this.password,
            department_id: this.department_id,
            group_id: "1",
            device_name: "browser",
          })
          .then((response) => {
            console.log(response);

            this.$router.push("/");
            console.log(res);
          })
          .catch((errors) => {
            this.errors = errors.response.data.errors;
          });
      });
    },
  },
};
</script>
