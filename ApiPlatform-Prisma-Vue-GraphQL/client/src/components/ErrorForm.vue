<template>
  <v-alert v-if="Object.keys(errors).length !== 0" dense type="error">
    <ul>
      <li v-for="item in errors" :key="item">
        {{ $t(item) }}
      </li>
    </ul>
  </v-alert>
</template>

<script>
export default {
  name: "ErrorForm",
  props: {
    errors: Object
  }
};
</script>

<style scoped>

</style>
