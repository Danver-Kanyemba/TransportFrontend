<template>
  <div>
    <!-- for displaying form for adding departments -->
    <div v-if="addDepartments_visible">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
          <v-select
            :items="users_data"
            item-text="name"
            :menu-props="{ top: true, offsetY: true }"
            label="Users"
            item-value="id"
            v-model="user_id"
          ></v-select>

          <v-card-actions>
            <v-btn color="blue" @click="handleAdminAddUser"> Add User </v-btn>
          </v-card-actions>

          <p v-text="errors.department"></p>
        </v-container>
      </v-form>
    </div>
    <!-- for displaying message when a Department is added successfull -->
    <div v-else>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline mb-4">Admin Added successfully</div>
          <v-list-item-title class="text-h5 mb-1">
            {{ department_remainder }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
    <!-- dialog for adding new user -->
    <v-dialog v-model="dialogLoading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by while we add the User
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  name: "AddAdminUser",

  data: () => ({
    // for validation
    nameRules: [(v) => !!v || "Name is required"],
    valid: false,
    // for department name
    department_name: "",
    department_remainder: "",
    addDepartments_visible: true,
    message: "",
    // for dialog
    timeout: 2000,
    dialogLoading: false,
    snackbar: false,
    // for errors
    errors: {},

    users_data: [],
    user_id: "",
  }),

  mounted() {
    // for getting all users
    this.$http.get("/sanctum/csrf-cookie").then((res) => {
      this.$http
        .get("/api/allusers")
        .then((response) => {
          this.users_data = response.data;
          this.loading_items = false;
          console.log(res);
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
        });
    });
  },

  methods: {
    validate() {},
    // for adding user
    handleAdminAddUser() {
      if (this.$refs.form.validate()) {
        this.dialogLoading = true;

        this.$http.get("/sanctum/csrf-cookie").then((res) => {
          this.$http
            .post("/api/admincontrol", {
              id_user_to_add: this.user_id,
            })
            .then((response) => {
              console.log(res);
              this.message = response.data.message;
              this.dialogLoading = false;
              this.snackbar = true;
              this.department_remainder = this.department_name;
              this.department_name = "";
              this.addDepartments_visible = false;
            })
            .catch((errors) => {
              this.errors = errors.response.data.errors;
            });
        });
      }
    },
  },
};
</script>
