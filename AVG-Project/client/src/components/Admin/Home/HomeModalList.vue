<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        placeholder="Choisir un logement pour votre événement"
        v-bind="attrs"
        v-on="on"
        outlined
        full-width
        :value="selectedHome ? selectedHome.name : ''"
        :error="!!errorHome"
        :rules="[errorHome ? errorHome : true]"
      ></v-text-field>
    </template>

    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Choix du logement</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-container>
        <v-text-field
          v-if="isLoading"
          color="primary"
          loading
          disabled
        ></v-text-field>
        <v-row v-if="homes.length > 0">
          <v-col v-for="(home, index) in homes" :key="index" lg="4" md="6">
            <HomeCard :home="home" :on-click="onClick"/>
          </v-col>
        </v-row>
        <v-row  class="mt-lg-5" v-if="!isLoading && homes.length === 0">
          Aucun logement disponible
        </v-row>
      </v-container>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>

<script>
import { getFilePerEndpoint } from "@/utils";
import { mapGetters } from "vuex";
import HomeCard from "@/components/Admin/Home/HomeCard";
import {HOME_STATUS} from "../../../../config/constant";

export default {
  name: "HomeModalList",
  props: {
    handleHome: Function,
    errorHome: String
  },
  components: { HomeCard },
  data () {
    return {
      isLoading: true,
      homes: [],
      dialog: false,
      selectedHome: null
    };
  },
  computed: {
    ...mapGetters(["getEndpointLabel", "getUser"]),
  },
  created () {
    const action = getFilePerEndpoint(this.getEndpointLabel, "home");
    let values = {};
    if(this.getEndpointLabel === 'prisma') {
      values = {
        where: {
          status: HOME_STATUS.VERIFIED
        }
      }
    }
    action.getHomes(values, this.$apollo).then(result => {
      this.$data.homes = result["hydra:member"] ? result["hydra:member"] : result;
      this.$data.isLoading = false;
    });
  },
  methods: {
    onClick: function (event, value) {
      this.$props.handleHome(value);
      this.$data.selectedHome = value;
      this.$data.dialog = false;
    },
  },
};
</script>

<style>

</style>
