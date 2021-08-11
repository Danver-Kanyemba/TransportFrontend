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
         Change Department
        </v-card-title>


      <!-- This is responsible for Changing HOD Deparments-->
      <div v-if="departments_changing_hod_function">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-subtitle ></v-card-subtitle>
          <v-container>
          <v-select
            :items="department"
            item-text="department_name"
            :menu-props="{ top: true, offsetY: true }"
            label="Department"
            item-value="id"
            v-model="department_id"
          ></v-select>

            <v-card-actions>
              <v-btn color="blue"
               @click="handleChangingDepertment(), 
               buttoLoading = true" 
               :loading="buttoLoading">
                Change Department
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
    name: 'UserChangeDepartment',
data:() => ({
  users_data: [],
  department: [],
    departments_changing_hod_function: true,
errors: {},
buttoLoading: false,

}),
props: ['selectedID', 'message',],


 mounted() {
    console.log("component is mounted"),
      this.$http
        .get("/api/departments")
        .then((res) => {
          this.department = res.data;
        })
        .catch((errors) => {
          this.errors = errors.response.data.errors;
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
    handleChangingDepertment() {
      if (this.$refs.form.validate()) {
        this.dialogLoading = true;

        this.$http.get("/sanctum/csrf-cookie").then((res) => {
          this.$http
            .put("/api/munhuwacho/" + this.selectedID, {
              name: "admin_update_user_department",
              department_id: this.department_id,
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