<template>
  <div>
    <v-row justify="center">
      <v-card elevation="0">
        <v-col style="text-align: center">
          <br />
          <br />
          <v-img :src="'/MUASTLOGO.png'" max-width="500"></v-img>
        </v-col>
        <v-card-title>
          Welcome to MUAST Transport <v-icon>mdi-car</v-icon>Requisition system
        </v-card-title>
        <v-card-subtitle class="text-center">
          Navigate using the menu on you left to see available options.
        </v-card-subtitle>
        <v-card-actions>
          <v-row justify="center">
            <v-btn rounded color="blue" dark to="/"> Transport Home </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>

    <BottomFooter />
  </div>
</template>
<script>
import BottomFooter from "./BottomFooter.vue";
export default {
  name: "Startpage",
  components: {
    BottomFooter,
  },
};
</script>
