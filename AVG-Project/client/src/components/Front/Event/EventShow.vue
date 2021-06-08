<template>
  <v-container class="mt-5">
    <v-text-field
      v-if="loading"
      color="primary"
      loading
      disabled
    ></v-text-field>
    <v-row v-if="!loading">
      <v-col cols="12" sm="6">
        <v-btn color="primary" link v-bind:to="{name: 'front_events'}">
          Retour
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <div v-if="isOwner" class="text-right">
          <v-chip v-if="event.status !== 'CREATED'" :color="event.status !== 'CREATED' ? event.status === 'APPROVED' ? 'success' : 'error' : 'primary'">
            {{ event.status !== "CREATED" ? event.status === "APPROVED" ? "Approuvé" : "Rejeté" : "En attente de validation" }}
          </v-chip>
        </div>
      </v-col>
      <v-col cols="12" sm="8">
        <v-card class="mb-5">
          <v-card-title>
            Détails de l'événement
          </v-card-title>
          <v-card-text>
            <p>Nom : {{ this.$data.event.name }}</p>
            <p>Limite de personne : {{ this.$data.event.peopleLimit }}</p>
            <p>Date de l'événement :
              {{ dateToString(formatDate(this.$data.event.startDate)) }} -
              {{ dateToString(formatDate(this.$data.event.endDate)) }}
            </p>
            <p>Description : {{ this.$data.event.description }}</p>
          </v-card-text>
        </v-card>
        <v-card v-if="this.$data.event.rent.services && this.$data.event.rent.services.length > 0" class="mb-5">
          <v-card-title>
            Services choisis
          </v-card-title>
          <v-card-text>
            <ul>
              <li v-for="item in this.$data.event.rent.services" :key="item['@id']">
                {{ item.name }} <span v-if="isOwner"> - {{ item.price }}€</span>
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card v-if="isOwner" class="mb-5">
          <v-card-title>
            Montant
          </v-card-title>
          <v-card-text>
            <p>Montant du sejour : {{
                getTotalPriceRent(formatDate(event.rent.startDate), formatDate(event.rent.endDate), event.rent.home.price)
              }} €</p>
            <p>Montant des services : {{ getTotalService }} €</p>
            <p class="text-h6">Total : {{
                getTotalPriceRent(formatDate(event.rent.startDate), formatDate(event.rent.endDate), event.rent.home.price) + getTotalService
              }} €</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <p v-if="event.rentDate">Date de la location :
          {{ formatDate(event.rent.startDate) }} -
          {{ formatDate(event.rent.endDate) }}</p>
        <HomeCard :full-height="false" :home="event.rent.home" :show-action="false"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getFilePerEndpoint, getTotalPriceRent } from "@/utils";
import { mapGetters, mapMutations } from "vuex";
import HomeCard from "@/components/Admin/Home/HomeCard";
import { parseISO, isDate, format } from "date-fns";

export default {
  name: "EventShow",
  components: {
    HomeCard,
  },
  data: () => ({
    loading: true,
    event: null,
    errorsApi: {},
  }),
  computed: {
    ...mapGetters(["getEndpointLabel", "getUser"]),
    getTotalService: function () {
      return this.event.rent.services.reduce((acc, value) => {
        acc += value.price;
        return acc;
      }, 0);
    },
    isOwner: function (){
      return this.$data.event.rent.owner.id === this.getUser.id;
    }
  },
  created () {
    const eventId = this.$route.params.id;
    const action = getFilePerEndpoint(this.getEndpointLabel, "event");
    action.getEvent(eventId, this.$apollo).then((event) => {
      this.$data.event = event;
      this.$data.loading = false;
    });
  },
  methods: {
    ...mapMutations(["addFlashMessage"]),
    getTotalPriceRent (start, end, price) {
      return getTotalPriceRent(start, end, price);
    },
    formatDate (date) {
      return isDate(date) ? date : parseISO(date);
    },
    dateToString (date) {
      return format(date, "dd/MM/yyyy");
    }
  },
};
</script>

<style scoped>
</style>
