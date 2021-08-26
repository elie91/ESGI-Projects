<template>
  <v-card :height="fullHeight ? '100%' : 'auto'" v-if="home">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <img
      alt="event image"
      width="100%"
      height="250"
      v-bind:src="getMainPicture"
    />

    <v-card-title>
      <div class="d-flex flex-column">
        <span>{{ home.name }}</span>
        <p class="font-weight-light mb-0">
          {{ home.price }} €
        </p>
      </div>
    </v-card-title>

    <v-card-text>
      <v-row align="center" class="mx-0">
        <div class="grey--text"> Adresse: {{ home.address }}</div>
      </v-row>
      <div class="mt-2">{{ home.description }}</div>
      <v-divider class="my-2"></v-divider>
      <div class="text-h6 black--text">Options du logement</div>
      <v-chip-group column>
        <v-chip v-for="(option, index) in (home.options || home.homeOption)" :key="index">
          {{ option.name }}
        </v-chip>
      </v-chip-group>
    </v-card-text>

    <v-card-actions v-if="showAction">
      <v-btn color="primary" @click="chooseHome($event, home)">
        Sélectionner
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "HomeCard",
  props: {
    home: Object,
    onClick: Function,
    fullHeight: {
      default: true
    },
    showAction: {
      default: true
    }
  },
  computed: {
    getMainPicture: function () {
      if (this.$props.home){
        const pictures = this.$props.home.pictures.filter(
          (picture) => picture.isMainPicture,
        );
        return pictures[0].image;
      }
      return null;
    },
  },
  methods: {
    chooseHome: function (event, value) {
      return this.$props.onClick(event, value);
    },
  },
};
</script>

<style>

</style>
