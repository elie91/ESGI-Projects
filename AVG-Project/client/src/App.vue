<template>
  <div>
    <v-app>
      <router-view :key="$route.fullPath"></router-view>
    </v-app>
  </div>
</template>


<script>

export default {
  name: "App",
  created() {
    this.$store.commit("checkValidity");
  },
};
</script>
