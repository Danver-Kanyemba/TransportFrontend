<template>
  <v-footer dark padless fixed>
    <v-card class="flex" flat tile>
      <v-card-title>
        <v-card-text class="py-2 white--text text-center"
          >Get your Tansport with us!</v-card-text
        >
        <strong class="subheading"></strong>

        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text class="py-2 white--text text-center">
        {{ new Date().getFullYear() }} — <strong>MUAST</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>
<script>
export default {
  name: "BottomFooter",
};
</script>
