<template>
  <div>
    <div v-if="addDepartments_visible">
      <v-form ref="form" v-model="valid" lazy-validation>
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
          <div class="text-overline mb-4">Department Created successfully</div>
          <v-list-item-title class="text-h5 mb-1">
            {{ department_remainder }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>

    <v-dialog v-model="dialogLoading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by while we add the department
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
  name: "AddDepartments",

  data: () => ({
    nameRules: [(v) => !!v || "Name is required"],
    valid: false,
    department_name: "",
    department_remainder: "",
    addDepartments_visible: true,
    message: "",
    timeout: 2000,
    dialogLoading: false,
    snackbar: false,
    errors: {},
  }),

  methods: {
    validate() {},

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
            });
        });
      }
    },
  },
};
</script>
