<template>
  <v-row v-if="isLoading">
    <v-col v-for="index in 6" :key="index" cols="12" sm="4">
      <v-skeleton-loader
        type="image, article, actions"
      ></v-skeleton-loader>
    </v-col>
  </v-row>

</template>

<script>
export default {
  name: "GridCardLoader",
  props: {
    isLoading: {
      required: true,
      default: true,
    },
  },
};
</script>

<style scoped>

</style>
