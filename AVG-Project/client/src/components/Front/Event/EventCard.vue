<template>
  <v-card height="100%" class="d-flex flex-column justify-space-between">
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

    <v-card-title>{{ event.name }}</v-card-title>

    <v-card-text class="align-content-lg-space-between">
      <span class="subtitle-1">
          Du {{ formatDate(event.startDate) }} au {{ formatDate(event.endDate) }}
        </span>
      <p class="subtitle-2 font-weight-light">Adresse: {{ event.rent.home.address }} </p>
      <div class="grey--text">{{ event.eventUsers.length }} participants</div>
      <div class="mt-2">{{ event.description }}</div>
      <v-divider class="my-2"></v-divider>
      <div class="text-h6 black--text">Services proposées</div>
      <v-chip-group column>
        <v-chip color="warning" outlined small v-for="(option, index) in getOptions" :key="index">
          {{ option.name }}
        </v-chip>
      </v-chip-group>
    </v-card-text>

    <v-card-actions v-if="!isOwner" class="justify-end">
      <v-btn color="primary" :disabled="subscribe || alreadySubscribe(event)" @click="signToEvent(event)">
        {{ subscribe || alreadySubscribe(event) ? "Déjà inscrit" : "Je m'inscris" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {formatDate, getFilePerEndpoint} from "@/utils";
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "EventCard",
  props: {
    event: Object,
  },
  data: () => ({
    subscribe: false,
  }),
  methods: {
    ...mapMutations(["addFlashMessage"]),
    formatDate,
    alreadySubscribe(event) {
      if (!this.getUser) {
        return false;
      }
      return !!event.eventUsers.some(e => e.user.id === this.getUser.id);
    },
    signToEvent: function (event) {
      if (!this.getUser) {
        this.addFlashMessage({
          type: "info",
          message: "Merci de vous connecter pour vous inscrire à un événement",
        });
        this.$router.push({name: "front_signin"});
      } else {
        if (!this.alreadySubscribe(event)) {
          const action = getFilePerEndpoint(this.getEndpointLabel, "eventUser");
          action
            .createEventUser({
              user: this.getEndpointLabel === 'prisma' ? this.getUser["id"] : this.getUser["@id"],
              event: event["@id"] ? event["@id"] : event["id"]
            }, this.$apollo)
            .then((result) => {
              this.$data.subscribe = true;
              this.addFlashMessage({
                type: "info",
                message: `Vous êtes bien inscrits à l'événement ${event.name}`,
              });
            })
            .then(() => (this.$data.isLoading = false));
        }
      }
    },
  },
  computed: {
    ...mapGetters(["getUser", "getEndpointLabel"]),
    getMainPicture: function () {
      if (this.$props.event.rent && this.$props.event.rent.home) {
        const pictures = this.$props.event.rent.home.pictures.filter(
          (picture) => picture.isMainPicture,
        );
        return pictures[0].image;
      }
      return null;
    },
    getOptions: function () {
      if (this.$props.event.rent && (this.$props.event.rent.services || this.$props.event.rent.rentService)) {
        const services = this.$props.event.rent.services
          ? this.$props.event.rent.services
          : this.$props.event.rent.rentService;
        const options = this.$props.event.rent.home.options
          ? this.$props.event.rent.home.options
          : this.$props.event.rent.home.homeOption;
        return [...services, ...options];
      }
      return [];
    },
    isOwner: function (){
      return this.$props.event.rent.owner.id === this.getUser?.id;
    }
  },
};
</script>

<style scoped>
</style>
