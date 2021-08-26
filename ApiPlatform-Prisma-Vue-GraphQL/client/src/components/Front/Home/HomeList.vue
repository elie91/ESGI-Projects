<template>
  <v-container>
    <h1 class="text-h3 my-3 text-center">Maisons disponibles à la location</h1>
    <v-row v-if="!loading">
      <v-col sm="4" v-for="home in homes" :key="home.id">
        <v-card height="100%">
          <img :alt="home.name" width="100%" v-bind:src="getMainPicture(home)" height="250"/>
          <v-card-title>
            {{ home.name }}
          </v-card-title>
          <v-card-text>
            <div class="subtitle-1">
              {{ home.price }} €/jours • {{ home.address }} {{ home.city }}
            </div>
            <div>
              {{ home.description }}
            </div>
            <v-chip-group column>
              <v-chip v-for="(option, index) in home.options" :key="index">
                {{ option.name }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="selectHome(home)">Louer</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { formatDate, getFilePerEndpoint } from "@/utils";
import { mapGetters, mapMutations } from "vuex";
import { generateNameRoute, RT_FRONT_HOMES_LOCATION } from "@/router/routes";

export default {
  name: "HomeList",
  computed: {
    ...mapGetters(["getEndpointLabel", "getUser"]),
  },
  created () {
    this.fetchApi().then(() => {
      this.$data.loading = false;
    });
  },
  methods: {
    ...mapMutations(["addFlashMessage"]),
    getMainPicture: function (home) {
      const pictures = this.$data.homes.find(h => h.id === home.id).pictures.filter(
        (picture) => picture.isMainPicture,
      );
      return pictures[0].image;
    },
    fetchApi () {
      return new Promise((resolve) => {
        const action = getFilePerEndpoint(
          this.getEndpointLabel,
          "home",
        );
        action["getHomes"]({}, this.$apollo)
          .then((result) => {
            let items = [];
            if (result["hydra:member"]) {
              items = result["hydra:member"];
              this.$data.totalItems = result["hydra:totalItems"];
            } else {
              this.$data.totalItems = result.length;
              items = result;
            }
            this.$data.homes = items.map((item) => {
              if (item.startDate && item.endDate) {
                item = {
                  ...item,
                  startDate: formatDate(item.startDate),
                  endDate: formatDate(item.endDate),
                };
              }
              return {
                ...item,
                createdAt: formatDate(item.createdAt),
                updatedAt: formatDate(item.updatedAt),
              };
            });
            resolve();
          });
      });
    },
    selectHome (home) {
      if (!this.getUser) {
        this.addFlashMessage({
          type: "info",
          message: "Merci de vous connecter pour pouvoir louer une maison",
        });
        this.$router.push({ name: "front_signin" });
      } else {
        this.$router.push({
          name: "front_homes_location",
          params: {
            home: home.id,
          },
        });
      }

    },
  },
  data: () => ({
    homes: [],
    loading: true,
    totalItems: 0,
  }),
};
</script>

<style scoped>

</style>
