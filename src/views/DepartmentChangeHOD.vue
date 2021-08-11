<template>
<div>
  <div v-if="message">
<v-card-title >
{{message}}
</v-card-title>
</div>
 <div v-else>


            
        <v-row justify="right" class="text-right">
          <v-col>

            <v-btn
              icon
              large
              @click="departments_changing_hod_function = false"
            >
              <v-icon color="blue" >mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card-title class="white--text blue darken-4">
         Change HOD
        </v-card-title>


      <!-- This is responsible for Changing HOD Deparments-->
      <div v-if="departments_changing_hod_function">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-subtitle ></v-card-subtitle>
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
              <v-btn color="blue"
               @click="handleRenamingHOD(), 
               buttoLoading = true" 
               :loading="buttoLoading">
                Make HOD Department
              </v-btn>

            </v-card-actions>

            <p v-text="errors"></p>
          </v-container>
        </v-form>
      </div>
</div>
</div>


</template>

<script>
export default {
    name: 'DepartmentChangeHOD',

data:() => ({
    users_data: [],
    departments_changing_hod_function: true,
errors: {},
buttoLoading: false,

}),
props: ['selectedID', 'message',],

mounted() {
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
            .put("/api/departments/" + this.selectedID, {
              name: "admin_update_HOD",
              hod: this.user_id,
              device_name: "browser",
            })
            .then((response) => {
              console.log(res);
              this.message = response.data.message;
              this.buttoLoading = false;
            })
            .catch((errors) => {
              this.errors = errors.response.data.errors;
              this.buttoLoading = false;
            })
            // .then(() => {
            //   this.$http
            //     .get("/api/departments")
            //     .then((response2) => {
            //       this.department = response2.data;
            //       this.loading_items = false;
            //     })
            //     .catch((errors) => {
            //       this.errors = errors.response.data.errors;
            //     });
            // });
        });
      }
    },
    },
}
</script>