<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="500"
      v-for="item in transport_info"
      :key="item.id"
    >
      <v-btn icon large to="/">
        <v-icon> mdi-arrow-left </v-icon>
      </v-btn>
      <v-skeleton-loader
        v-bind="attrs"
        type="article, divider, actions"
        v-if="loading"
      ></v-skeleton-loader>

      <v-card-title
        >Requested by: {{ item.name }} <br />
        Cell {{ item.cell }}</v-card-title
      >

      <v-card-text>
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
      <v-list-item-subtitle v-if="item.approved_by_hod">
        <v-icon color="blue lighten-1"> mdi-shield-check </v-icon>
        Approved by HOD
      </v-list-item-subtitle>
      <v-list-item-subtitle v-else>
        <v-icon color="red lighten-1"> mdi-shield </v-icon>
        not approved by HOD
      </v-list-item-subtitle>

      <v-list-item-subtitle v-if="item.approved_by_transport" title="">
        <v-icon color="blue lighten-1"> mdi-shield-check </v-icon>
        <span> Approved by Transport. </span>
        <v-icon
          color="blue lighten-1"
          title="Please note that if Transport has been approved by the transport Officer the HOD no longer has the ability to Disapprove."
        >
          mdi-help
        </v-icon>
      </v-list-item-subtitle>
      <v-list-item-subtitle v-else>
        <v-icon color="red lighten-1"> mdi-shield </v-icon>
        not yet approved by Transport
      </v-list-item-subtitle>

      <v-card-actions>
        <v-row justify="end" align="center">
          <div v-if="is_hod_for_department">
            <div v-if="!item.approved_by_hod">
              <v-btn
                color="blue"
                @click="approve_transport(item.id)"
                class="mr-1"
              >
                Approve
                <v-icon color="red">mdi-heart</v-icon>
              </v-btn>
            </div>
            <div v-else>
              <v-btn
                color="blue"
                @click="disapprove_transport(item.id)"
                class="mr-1"
              >
                Disapprove
                <v-icon color="red">mdi-heartbroken</v-icon>
              </v-btn>
            </div>
          </div>
          <!-- delete transport if not approved -->
          <div v-if="!item.approved_by_hod">
            <v-btn color="red" @click="delete_transport(item.id)">
              Delete
              <v-icon color="white">mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-row>
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
  name: "TransportInformation",
  props: ["usern"],
  is_Hod: "",
  data: () => ({
    // for inforamation
    loading: true,
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
    is_hod_for_department: false,

    // for loading
    dialogLoading: false,

    //for displaying message
    snackbar: false,
    message: "",
    timeout: 3000,
  }),
  methods: {
    // for appeoving trannsport
    approve_transport(item_id) {
      this.dialogLoading = true;
      this.$http.get("/sanctum/csrf-cookie").then((res) => {
        this.$http
          .put("/api/hod/" + item_id, {
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
          .put("/api/hod/" + item_id, {
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
      this.$http.get("/api/transport/" + this.usern).then((res) => {
        this.transport_info = res.data.data;
        this.is_hod_for_department = res.data.is_hod_for_department;
        this.loading = false;
        console.log(res);
      });
    },
  },

  mounted() {
    // to get transport data
    this.$http.get("/api/transport/" + this.usern).then((res) => {
      this.transport_info = res.data.data;
      this.is_hod_for_department = res.data.is_hod_for_department;
      this.loading = false;
      console.log(res);
    });
  },
};
</script>
