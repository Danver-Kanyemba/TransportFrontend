<template>
  <div>
    <br />
    <v-card class="mx-auto" max-width="500">
      <v-toolbar color="blue" dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>TransportForms</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-skeleton-loader
        v-bind="attrs"
        type="article, actions"
        v-if="loading"
      ></v-skeleton-loader>
      <div v-else>
        <v-list two-line>
          <v-list-item-group>
            <template v-for="(item, index) in transport_data">
              <v-list-item
                :key="item.id"
                :to="/TransportManagerInformation/ + item.id"
              >
              
                <template>
                  <v-list-item-content>
                    <v-list-item-title>
                      Requested by: {{ item.name }}
                    </v-list-item-title>

                    <v-list-item-subtitle
                      class="text--primary"
                      v-text="item.headline"
                    ></v-list-item-subtitle>

                    <v-list-item-subtitle>
                      Destination: {{ item.destination }}
                    </v-list-item-subtitle>

                    <v-list-item-subtitle v-if="item.approved_by_hod">
                      <v-icon color="blue lighten-1"> mdi-shield-check </v-icon>
                      Approved by HOD
                    </v-list-item-subtitle>
                    <v-list-item-subtitle v-else>
                      <v-icon color="red lighten-1"> mdi-shield </v-icon>
                      not approved by HOD
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text
                      v-text="item.name"
                    ></v-list-item-action-text>
                    <v-btn color="info"> View </v-btn>
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < item.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TransportManagerHome",
  data: () => ({
    loading: true,
    starting_on_home: true,
    transport_data: [],
    rihana: [1, 3, 5],
    selected: [2],
  }),

  mounted() {
    this.$http.get("/api/TransportOfficer").then((res) => {
      this.transport_data = res.data.data;
      this.loading = false;
      console.log(res.data.data);
    });
  },
};
</script>
