<template>
  <div>
    <v-card class="mx-auto" max-width="750">
      <v-btn icon large to="/Admin">
        <v-icon color="blue"> mdi-arrow-left </v-icon>
      </v-btn>
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
                <v-toolbar color="blue" dark>Department Details</v-toolbar>
                <v-card-title
                  >name: {{ department_department_name_view }}
                </v-card-title>
                <div v-if="department_hod_view">
                  <v-card-subtitle
                    >HOD: {{ department_name_view }}
                  </v-card-subtitle>
                </div>
                <div v-else>
                  <v-card-subtitle>Department has no HOD yet. </v-card-subtitle>
                </div>
                <div>
                  <v-card-subtitle
                    >Created at: {{ department_created_at_view }}
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

      <!-- This is responsible for Changing HOD Deparments-->
      <div v-if="departments_changing_hod_function">
        <v-row justify="right" class="text-right">
          <v-col>
            <v-btn
              text
              large
              @click="departments_changing_hod_function = false"
            >
              <v-icon color="blue">mdi-close</v-icon>Close
            </v-btn>
          </v-col>
        </v-row>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-subtitle v-model="department_rename_data"></v-card-subtitle>
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
              <v-btn color="blue" @click="handleRenamingHOD()">
                Make HOD Department
              </v-btn>
            </v-card-actions>

            <p v-text="errors.department"></p>
          </v-container>
        </v-form>
      </div>


      <!-- This is responsible for Adding Departments -->
      <div v-if="departments_function">
        <div v-if="addDepartments_visible">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row justify="right" class="text-right">
              <v-col>
                <v-btn text large @click="addDepartments_visible = false">
                  <v-icon color="blue">mdi-close</v-icon>Close
                </v-btn>
              </v-col>
            </v-row>
            <v-container>
              <v-text-field
                v-model="department_name"
                :rules="nameRules"
                label="Department Name"
                required
              ></v-text-field>

              <v-card-actions>
                <v-btn color="blue" @click="handleAddDepatments">
                  Add Department
                </v-btn>
              </v-card-actions>

              <p v-text="errors.department"></p>
            </v-container>
          </v-form>
        </div>

        <div v-else>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">
                Department Created successfully
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ department_remainder }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </div>
    </v-card>
    <v-card class="mx-auto" max-width="750">
      <v-card-title class="white--text blue">
        Departments

        <v-spacer></v-spacer>

        <template>
          <v-btn
            color="white"
            class="text--primary"
            dark
            @click="
              (addDepartments_visible = true), (departments_function = true)
            "
          >
            <v-icon>mdi-plus</v-icon>Add Department
          </v-btn>
        </template>
      </v-card-title>

      <v-card-text class="pt-4">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi nobis a
        at voluptates culpa optio amet! Inventore deserunt voluptatem maxime a
        veniam placeat, eos impedit nulla quos? Officiis, aperiam ducimus.
      </v-card-text>

      <v-divider></v-divider>
      <div v-if="loading_items">
        <v-skeleton-loader type="list-item, actions"></v-skeleton-loader>
      </div>
      <v-virtual-scroll
        :items="department"
        :key="componentKey"
        :item-height="50"
        height="300"
      >
        <template v-slot:default="{ item }">
          <v-list-item 
                :to="/DepartmentInformation/ + item.id"
          
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.department_name }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-row>
                <v-col>
                  <v-btn
                    depressed
                    small
                    @click="
                      (departments_rename_function = true),
                        (departments_function = false),
                        get_depertment_id(item.id),
                        (department_rename_name_2 = item.item),
                        (departments_changing_hod_function = false)
                    "
                  >
                    Rename

                    <v-icon color="orange darken-4" right> mdi-pen </v-icon>
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    depressed
                    small
                    @click="
                      (departments_changing_hod_function = true),
                        (departments_function = false),
                        (departments_rename_function = false),
                        getUsers(item.id)
                    "
                  >
                    Edit HOD
                    <v-icon color="orange darken-4" right> mdi-account </v-icon>
                  </v-btn>
                </v-col>
                <v-col>
                </v-col>
                <v-col>

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
            <AddDepartments />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
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
import AddDepartments from "./AddDepartments.vue";

export default {
  name: "DepartmentsList",

  data: () => ({
    valid: false,
    // for viewing department
    department_data: [],
    department_name_view: "",
    department_hod_view: "",
    department_department_name_view: "",
    department_created_at_view: "",
    department_id_to_view: "",

    // for showing the department view
    dialog_for_department_view: false,

    // for selecting users for HOD
    users_data: [],

    departments_changing_hod_function: false,
    user_id: "",
    department_id_to_make_hod: "",

    // for renaming Department
    departments_rename_function: false,
    department_rename_name: "",
    department_rename_name_2: null,
    department_rename_data: [],
    department_id_to_rename: "",

    // for adding department
    departments_function: false,
    department_name: "",
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
  components: { AddDepartments },
  mounted() {
    this.loading_items = true;
    console.log("component is mounted"),
      this.$http
        .get("/api/departments")
        .then((res) => {
          this.department = res.data;
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
              this.department_rename_remainder = this.department_name;

              this.addDepartments_visible = false;
              this.departments_rename_function = false;
              this.departments_changing_hod_function = false;
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

    // for renaming departments

    get_depertment_id(id) {
      this.department_id_to_rename = id;
      this.$http.get("/sanctum/csrf-cookie").then((res) => {
        this.$http
          .get("/api/departments/" + this.department_id_to_rename)
          .then((response3) => {
            this.department_rename_data = response3.data.name;
            this.loading_items = false;
            console.log(res);
          })
          .catch((errors) => {
            this.errors = errors.response.data.errors;
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
              name: this.department_name,
              device_name: "browser",
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
