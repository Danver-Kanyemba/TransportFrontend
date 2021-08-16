<template>
  <div>
    <!-- this is for Changing the HOD -->
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <DepartmentChangeHOD :selectedID="department_id" />

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="blue darken-1"
              text
              :to="/DepartmentInformation/ + this.department_id"
              @click="dialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="mx-auto" max-width="750">
          <v-btn icon large to="/DepartmentsList">
            <v-icon color="blue"> mdi-arrow-left </v-icon>
          </v-btn>
          <div v-if="loading_items">
            <v-skeleton-loader
              v-bind="attrs"
              type="article"
            ></v-skeleton-loader>
          </div>
          <div class="text-center" v-else>
            <!-- This is responsible for Renaming Deparments-->
            <div v-if="departments_rename_form">
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row justify="right" class="text-right">
                  <v-col>
                    <v-btn text large @click="departments_rename_form = false">
                      <v-icon color="blue">mdi-close</v-icon>Close
                    </v-btn>
                  </v-col>
                </v-row>
                <v-container>
                  <v-text-field
                    v-model="department_rename_name"
                    :rules="nameRules"
                    label="Rename Department Name"
                    required
                  ></v-text-field>

                  <v-card-actions>
                    <v-btn color="blue" @click="handleRenamingDepatments()">
                      Rename
                    </v-btn>
                  </v-card-actions>

                  <p v-text="errors.department"></p>
                </v-container>
              </v-form>
            </div>
            <v-toolbar color="blue" dark>
              <v-toolbar-title>Department</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                depressed
                small
                @click="
                  handleDepartmentDelete(),
                    (departments_changing_hod_function = false)
                "
              >
                Delete

                <v-icon color="orange darken-4" right> mdi-delete </v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-title>
              {{ department_department_name_view }}
              <v-btn icon @click="departments_rename_form = true">
                <v-icon>mdi-pen</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-subtitle>
              <div v-if="department_hod_view">
                HOD: {{ department_name_view }}
              </div>
              <div v-else>Department has no HOD</div>
              <v-btn @click="dialog = true"> Change HOD </v-btn>
            </v-card-subtitle>
            <v-card-text>
              Created at: {{ department_created_at_view }}
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DepartmentChangeHOD from "./DepartmentChangeHOD.vue";

export default {
  name: "DepartmentInformation",

  components: {
    DepartmentChangeHOD,
  },

  data: () => ({
    valid: false,
    loading_items: true,
    // for opening modal
    dialog: false,

    // department data
    department_data: null,
    department_department_name_view: null,
    department_hod_view: null,
    department_created_at_view: null,

    //  department rename
    departments_rename_form: false,
    department_rename_name: null,
    errors: "",
    // name rules
    nameRules: [(v) => !!v || "Name is required"],
  }),
  props: ["department_id"],

  mounted() {
    // to get department details
    this.$http.get("/sanctum/csrf-cookie").then((res) => {
      this.$http
        .get("/api/hodAndDepartments/" + this.department_id)
        .then((response) => {
          this.department_data = response.data;
          this.department_name_view = this.department_data.data[0].name;
          this.department_hod_view = this.department_data.data[0].hod;
          this.department_department_name_view =
            this.department_data.data[0].department_name;
          this.department_created_at_view =
            this.department_data.data[0].created_at;
          this.loading_items = false;
          console.log(res);
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
          this.loading_items = false;
        });
    });
  },

  methods: {
    handleRenamingDepatments() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("DialogLoading", true);

        this.$http.get("/sanctum/csrf-cookie").then((res) => {
          this.$http
            .put("/api/departments/" + this.department_id, {
              name: this.department_rename_name,
            })
            .then((response) => {
              console.log(res);
              this.message = response.data.message;
              this.$store.dispatch("DialogLoading", false);
              this.$store.dispatch("isMessageVisible", response.data.message);

              this.dialogLoading = false;
              this.snackbar = true;
              this.department_rename_remainder = this.department_name;

              this.addDepartments_visible = false;
              this.departments_rename_form = false;
            })
            .catch((errors) => {
              this.errors = errors.response.data.errors;
              this.dialogLoading = false;
              this.$store.dispatch("DialogLoading", false);
            })
            .then(() => {
              this.$http
                .get("/api/hodAndDepartments/" + this.department_id)
                .then((response) => {
                  this.department_data = response.data;
                  this.department_name_view = this.department_data.data[0].name;
                  this.department_hod_view = this.department_data.data[0].hod;
                  this.department_department_name_view =
                    this.department_data.data[0].department_name;
                  this.department_created_at_view =
                    this.department_data.data[0].created_at;
                  this.loading_items = false;
                  console.log(res);
                })
                .catch((errors) => {
                  this.errors = errors.response.data.errors;
                  this.loading_items = false;
                });
            });
        });
      }
    },

    // for deleting Departments
    handleDepartmentDelete() {
      this.$store.dispatch("DialogLoading", true);

      this.$http.get("/sanctum/csrf-cookie").then((res) => {
        this.$http
          .delete("/api/departments/" + this.department_id)
          .then((response) => {
            console.log(response);

            this.message = response.data.message;
            this.snackbar = true;
            console.log(res);
            this.loading_items = true;
            this.$store.dispatch("DialogLoading", false);
            this.$router.push({ name: "DepartmentsList" });
          })
          .catch((errors) => {
            this.errors = errors.response.data.errors;
            this.dialogLoading = false;
            this.$store.dispatch("DialogLoading", false);
          });
      });
    },
  },
};
</script>
