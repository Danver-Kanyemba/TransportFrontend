<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-card class="mx-auto my-12">
          <v-card-text>
            <v-text-field
              v-model="names_of_people"
              :rules="nameRules"
              label="Name(s)"
              required
            ></v-text-field>

            <v-select
              :items="no_of_people"
              :menu-props="{ top: true, offsetY: true }"
              label="No of people"
              v-model="no_of_people_value"
            ></v-select>

            <v-text-field
              v-model="destination"
              :rules="nameRules"
              label="Destination"
              required
            ></v-text-field>

            <v-row justify="center">
              <v-col>
                <h3>Departure Date</h3>
                <br />
                <v-date-picker v-model="departure_date"></v-date-picker>
              </v-col>

              <v-col>
                <v-text-field
                  v-model="departure_time"
                  :rules="nameRules"
                  label="Departure Time"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row justify="center">
              <v-col>
                <h3>Return Date</h3>
                <br />
                <v-date-picker v-model="return_date"></v-date-picker>
              </v-col>

              <v-col>
                <v-text-field
                  v-model="return_time"
                  :rules="nameRules"
                  label="Return Time"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn color="blue" @click="handleRegister">
              Request for transport
            </v-btn>
          </v-card-actions>
        </v-card>
        <p v-text="errors.email"></p>
        <p v-text="errors.password"></p>
      </v-container>
    </v-form>
  </div>
</template>
<script>
export default {
  name: "RequestTransport",

  data: () => ({
    valid: false,
    names_of_people: "",
    destination: "",
    errors: {},
    no_of_people: [1, 2, 3, 4, 5, 6, 7],
    no_of_people_value: "",
    departure_date: "",
    departure_time: "",
    return_date: "",
    return_time: "",
    department_id: "",

    snackbar: false,
    timeout: 2000,
    message: "",

    nameRules: [(v) => !!v || "Name is required"],
  }),

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
    validate() {
      this.$refs.form.validate();
    },

    handleRegister() {
      this.snackbar = true;

      this.$http.get("/sanctum/csrf-cookie").then((res) => {
        this.$http
          .post("/api/transport", {
            names_of_people: this.names_of_people,
            no_of_People: this.no_of_people_value,
            destination: this.destination,
            departure_date: this.departure_date,
            departure_time: this.departure_time,
            return_date: this.return_date,
            return_time: this.return_time,
          })
          .then((response) => {
            console.log(response);
            this.$router.push("/");
            this.snackbar = true;

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
