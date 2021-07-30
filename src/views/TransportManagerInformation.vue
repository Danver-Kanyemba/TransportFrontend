<template>
  <div>
    <v-btn icon>
      <v-icon> mdi-left </v-icon>
    </v-btn>
    <v-card
      class="mx-auto"
      max-width="500"
      v-for="item in transport_info"
      :key="item.id"
    >
      <v-card-title
        >Requested by: {{ item.name }} Cell {{ item.cell }}</v-card-title
      >

      <v-card-text>
        <v-row align="center" class="mx-0">
          <div class="grey--text ms-4">Department:</div>
        </v-row>

        <div></div>

        <div class="my-4 text-subtitle-1">
          Name(s): {{ item.names_of_people }}<br />
          Destination• {{ item.destination }}
        </div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Departure</v-card-title>

      <v-card-text>
        <v-chip-group
          v-model="selection"
          active-class="deep-purple accent-4 white--text"
          column
        >
          <v-chip>{{ item.departure_date }}</v-chip>

          <v-chip>{{ item.departure_time }}</v-chip>
        </v-chip-group>
      </v-card-text>
      <v-card-title>Return</v-card-title>

      <v-card-text>
        <v-chip-group
          v-model="selection"
          active-class="deep-purple accent-4 white--text"
          column
        >
          <v-chip>{{ item.return_date }}</v-chip>

          <v-chip>{{ item.return_time }}</v-chip>
        </v-chip-group>
      </v-card-text>
      <v-list two-line>
        <v-list-item-subtitle v-if="item.approved_by_hod">
          <v-icon color="blue lighten-1"> mdi-shield-check </v-icon>
          Approved by HOD
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          <v-icon color="red lighten-1"> mdi-shield </v-icon>
          not approved by HOD
        </v-list-item-subtitle>
      </v-list>
      <v-card-actions>
        <div v-if="is_transport_officer">
          <div v-if="!item.approved_by_transport">
            <v-list-item-subtitle>
              <v-icon color="red lighten-1"> mdi-shield </v-icon>

              Not yet approved for Transport
            </v-list-item-subtitle>
            <v-btn color="blue" @click="approve_transport(item.id)">
              Approve for Transport
              <v-icon color="red">mdi-heart</v-icon>
            </v-btn>
          </div>
          <div v-else>
            <v-list-item-subtitle>
              <v-icon color="blue lighten-1"> mdi-shield-check </v-icon>
              Approved for Transport
            </v-list-item-subtitle>
            <v-btn color="blue" @click="disapprove_transport(item.id)">
              Disapprove for Transport
              <v-icon color="red">mdi-heartbroken</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>

    <!--  for loading -->
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

    <!-- for dispplaying messages  -->
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
  name: "TransportManagerInformation",
  props: ["transport"],
  is_Hod: "",
  data: () => ({
    // for inforamation
    name: "",
    destination: "",
    no_of_people: [1, 2, 3, 4, 5, 6, 7],
    no_of_people_value: "",
    departure_date: "",
    departure_time: "",
    return_date: "",
    return_time: "",
    department_id: "",
    transport_info: [],
    is_transport_officer: false,

    // for loading
    dialogLoading: false,

    //for displaying message
    snackbar: false,
    message: "",
    timeout: 3000,
  }),
  methods: {
    approve_transport(item_id) {
      this.dialogLoading = true;
      this.$http.get("/sanctum/csrf-cookie").then((res) => {
        this.$http
          .put("/api/TransportOfficer/" + item_id, {
            name: "approve",
          })
          .then((response) => {
            console.log(res);
            this.message = response.data.message;
            this.dialogLoading = false;
            this.snackbar = true;
            this.reloadingPage();
          })
          .catch((errors) => {
            this.message = errors.response.data.errors;
            this.dialogLoading = false;
            this.snackbar = true;
          });
      });
    },

    // for disapproving
    disapprove_transport(item_id) {
      this.dialogLoading = true;
      this.$http.get("/sanctum/csrf-cookie").then((res) => {
        this.$http
          .put("/api/TransportOfficer/" + item_id, {
            name: "disapprove",
          })
          .then((response) => {
            console.log(res);
            this.message = response.data.message;
            this.dialogLoading = false;
            this.snackbar = true;
            this.reloadingPage();
          })
          .catch((errors) => {
            this.message = errors.response.data.errors;
            this.dialogLoading = false;
            this.snackbar = true;
          });
      });
    },

    // for reloading data
    reloadingPage() {
      this.$http.get("/api/TransportOfficer/" + this.transport).then((res) => {
        this.transport_info = res.data.data;
        this.is_transport_officer = res.data.is_transport_officer;
        this.loading = false;
        console.log(res);
      });
    },
  },

  mounted() {
    // to get transport data
    this.$http.get("/api/TransportOfficer/" + this.transport).then((res) => {
      this.transport_info = res.data.data;
      this.is_transport_officer = res.data.is_transport_officer;
      this.loading = false;
      console.log(res);
    });
  },
};
</script>
