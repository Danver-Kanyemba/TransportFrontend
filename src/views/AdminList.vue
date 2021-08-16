<template>
  <div>
    <v-card class="mx-auto" max-width="750">
      <!-- <v-btn icon large to="/Admin">
        <v-icon color="blue"> mdi-arrow-left </v-icon>
      </v-btn> -->
      <!-- for displaying the view of the Department -->
      <v-row justify="space-around">
        <v-col cols="auto">
          <v-dialog
            transition="dialog-bottom-transition"
            max-width="600"
            v-model="dialog_for_department_view"
          >
            <template>
              <v-card>
                <v-toolbar color="blue" dark>User Details</v-toolbar>
                <v-card-title>name: {{ user_user_name_view }} </v-card-title>
                <div v-if="department_hod_view">
                  <v-card-subtitle>HOD: {{ user_name_view }} </v-card-subtitle>
                </div>
                <div v-else>
                  <v-card-subtitle>Department has no HOD yet. </v-card-subtitle>
                </div>
                <div>
                  <v-card-subtitle
                    >Created at: {{ user_created_at_view }}
                  </v-card-subtitle>
                </div>
                <v-card-text> </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn text @click="dialog_for_department_view = false"
                    >Close</v-btn
                  >
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mx-auto" max-width="750">
      <v-card-title class="white--text blue">
        Admin User Details

        <v-spacer></v-spacer>

        <template>
          <v-btn
            color="white"
            rounded
            class="text--primary"
            dark
            @click="dialog = true"
          >
            <v-icon>mdi-plus</v-icon>Add
          </v-btn>
        </template>
      </v-card-title>

      <v-card-text class="pt-4"> This shows the List of Users </v-card-text>

      <v-divider></v-divider>
      <div v-if="loading_items">
        <v-skeleton-loader type="list-item, actions"></v-skeleton-loader>
      </div>
      <v-virtual-scroll
        :items="users"
        :key="componentKey"
        :item-height="50"
        height="300"
      >
        <template v-slot:default="{ item }">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-title>{{ item.email }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-row>
                <v-col> </v-col>
                <v-col>
                  <v-btn depressed small @click="handleAdminUser(item.id)">
                    <v-icon color="orange darken-4" left> mdi-delete </v-icon>
                    Remove user
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-card>
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <AddAdminUser />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="(dialog = false), getAdminUsers()"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row></template
    >

    <v-dialog v-model="dialogLoading" hide-overlay persistent width="300">
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
import AddAdminUser from "./AddAdminUser.vue";
export default {
  name: "AdminList",

  data: () => ({
    valid: false,

    // for changing the Department
    user_change_dept_dialog: false,
    update_department_id: "",
    // for ressetting password
    user_id_to_reset_password: null,
    user_password_reset: null,

    // for viewing users
    users: null,

    // for deleting Users
    users_id_to_delete: null,

    // for viewing department
    user_data: [],
    user_name_view: "",
    department_hod_view: "",
    user_user_name_view: "",
    user_created_at_view: "",
    department_id_to_view: "",

    // for showing the department view
    dialog_for_department_view: false,

    // for selecting users for HOD
    users_data: [],

    User_reset_password_function: false,
    user_id: "",
    department_id_to_make_hod: "",

    // for renaming user
    User_rename_function: false,
    user_rename_name: "",
    user_rename_data: [],
    user_id_to_rename: "",

    // for adding department
    users_function: false,
    user_name: "",
    department_remainder: "",

    addDepartments_visible: true,

    loading_items: false,
    dialog: false,
    dialogLoading: false,
    snackbar: false,
    timeout: 3000,
    errors: {},
    department: [],
    department_id_to_delete: "",
    componentKey: 0,
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
  components: { AddAdminUser },
  mounted() {
    this.loading_items = true;
    console.log("component is mounted"),
      this.$http
        .get("/api/admincontrol")
        .then((res) => {
          this.users = res.data.data;
          this.loading_items = false;
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
        });
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },

    // to get departments and HOD View
    get_depertment_HOD_view() {
      this.$http.get("/sanctum/csrf-cookie").then((res) => {
        this.$http
          .get("/api/hodAndDepartments/" + this.department_id_to_view)
          .then((response) => {
            this.user_data = response.data;
            this.user_name_view = this.user_data.data[0].name;
            this.department_hod_view = this.user_data.data[0].hod;
            this.user_user_name_view = this.user_data.data[0].user_name;
            this.user_created_at_view = this.user_data.data[0].created_at;
            this.loading_items = false;
            console.log(res);
          })
          .catch((errors) => {
            this.errors = errors.response.data.errors;
          });
      });
    },

    getAdminUsers() {
      this.$http
        .get("/api/admincontrol")
        .then((res) => {
          this.users = res.data.data;
          this.loading_items = false;
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
        });
    },

    // for retrieving users
    getUsers(idForHOD) {
      this.department_id_to_make_hod = idForHOD;
      this.$http.get("/sanctum/csrf-cookie").then((res) => {
        this.$http
          .get("/api/user")
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

    // for setting the HOD
    handleRenamingHOD() {
      if (this.$refs.form.validate()) {
        this.dialogLoading = true;

        this.$http.get("/sanctum/csrf-cookie").then((res) => {
          this.$http
            .put("/api/departments/" + this.department_id_to_make_hod, {
              name: "admin_update_HOD",
              hod: this.user_id,
              device_name: "browser",
            })
            .then((response) => {
              console.log(res);
              this.message = response.data.message;
              this.dialogLoading = false;
              this.snackbar = true;
              this.department_rename_remainder = this.user_name;

              this.addDepartments_visible = false;
              this.User_rename_function = false;
              this.User_reset_password_function = false;
            })
            .catch((errors) => {
              this.errors = errors.response.data.errors;
            })
            .then(() => {
              this.$http
                .get("/api/departments")
                .then((response2) => {
                  this.department = response2.data;
                  this.loading_items = false;
                })
                .catch((errors) => {
                  this.errors = errors.response.data.errors;
                });
            });
        });
      }
    },

    // for deleting Users
    handleAdminUser(idfordelete) {
      this.dialogLoading = true;
      this.users_id_to_delete = idfordelete;

      this.$http.get("/sanctum/csrf-cookie").then((res) => {
        this.$http
          .delete("/api/admincontrol/" + this.users_id_to_delete)
          .then((response) => {
            console.log(response);

            this.message = response.data.message;
            this.dialogLoading = false;
            this.snackbar = true;
            this.componentKey += 1;
            console.log(res);
            this.loading_items = true;
          })
          .catch((errors) => {
            this.errors = errors.response.data.errors;
          })
          .then(() => {
            this.$http
              .get("/api/admincontrol")
              .then((response2) => {
                this.users = response2.data.data;
                this.loading_items = false;
              })
              .catch((errors) => {
                this.errors = errors.response.data.errors;
              });
          });
      });
    },

    // for adding departments
    handleAddDepatments() {
      if (this.$refs.form.validate()) {
        this.dialogLoading = true;

        this.$http.get("/sanctum/csrf-cookie").then((res) => {
          this.$http
            .post("/api/departments", {
              name: this.user_name,
              device_name: "browser",
            })
            .then((response) => {
              console.log(res);
              this.message = response.data.message;
              this.dialogLoading = false;
              this.snackbar = true;
              this.department_remainder = this.user_name;
              this.user_name = "";
              this.addDepartments_visible = false;
            })
            .catch((errors) => {
              this.errors = errors.response.data.errors;
            })
            .then(() => {
              this.$http
                .get("/api/departments")
                .then((response2) => {
                  this.department = response2.data;
                  this.loading_items = false;
                })
                .catch((errors) => {
                  this.errors = errors.response.data.errors;
                });
            });
        });
      }
    },
  },
};
</script>
