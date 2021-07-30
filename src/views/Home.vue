<template>
  <div>
    <TransportForms />
    {{ ngeyi }}
  </div>
</template>

<script>
import TransportForms from "./TransportHome.vue";
export default {
  name: "Home",
  ngeyi: true,
  components: {
    TransportForms,
  },
  mounted() {
    this.ngeyi = this.$store.state.authModal;
  },
};
</script>
