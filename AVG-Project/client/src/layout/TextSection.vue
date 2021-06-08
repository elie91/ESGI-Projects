<template>
  <section class="section-text py-10">
    <v-container class="text-center">
      <h2 class="mb-5 white--text text-h3 font-weight-bold">
        {{ content }}
      </h2>
      <v-btn class="font-weight-bold" depressed color="warning" x-large rounded
             v-bind:to="{ name: 'front_homes_location'}">
        Créer un évenement
      </v-btn>
    </v-container>
  </section>
</template>

<script>
export default {
  name: "TextSection",
  props: {
    content: String,
  },
};
</script>

<style scoped>
.section-text {
  background-color: #3f51b5;
}
</style>
