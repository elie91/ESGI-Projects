<template>
  <div>
    <header>
      <v-container class="d-flex flex-column justify-center min-vh-70">
        <h1 class="text-h2 white--text font-weight-bold mb-5">SkuatCHEHwam</h1>
        <h2 class="text-h4 white--text font-weight-bold">
          {{ $t("home.header.mainTitle") }}
        </h2>
        <div class="mt-5">
          <v-btn class="font-weight-bold" depressed color="primary" x-large rounded
                 v-bind:to="{ name: 'front_homes_location'}">
            Créer un évenement
          </v-btn>
        </div>
      </v-container>
    </header>
    <section class="py-5">
      <v-container>
        <h3 class="text-h3 text-center">Evénements à venir</h3>
        <GridCardLoader :is-loading="isLoading"/>
        <v-row v-if="!isLoading">
          <v-col v-for="(event, index) in events" :key="index" md="4" sm="6">
            <EventCard :event="event"/>
          </v-col>
        </v-row>
        <p class="text-center" v-if="!isLoading && events.length === 0">Il n'y a pas d'événement à venir</p>
      </v-container>
    </section>
    <TextSection content="Organisez votre soirée simplement"/>
    <section class="py-5">
      <v-container>
        <v-row class="d-flex justify-center">
          <v-col md="3">
            <h3>SkuatCHEHwam</h3>
            <p class="description">
              {{ $t("home.footer.description") }}
            </p>
          </v-col>
          <v-col md="3">
            <h3>{{ $t("home.footer.contactUs") }}</h3>
            <ul class="footer-list">
              <li>
                <v-icon>mdi-google-maps</v-icon>
                <span class="value">432 Park Ave, New York, NY 10022</span>
              </li>
              <li>
                <v-icon>mdi-phone</v-icon>
                <span class="value"
                ><a href="tel:(844)%20380-8603">0101010101</a></span
                >
              </li>
              <li>
                <v-icon>mdi-email</v-icon>
                <span class="value"
                ><a href="mailto:support@selio.com"
                >zouavteam@google.com</a
                ></span
                >
              </li>
              <li>
                <v-icon>mdi-chevron-right</v-icon>
                <span class="value"
                ><a href="#">
                    {{ $t("home.footer.contactUs") }}
                  </a></span
                >
              </li>
            </ul>
          </v-col>
          <v-col md="3">
            <h3>{{ $t("home.footer.followUs") }}</h3>
            <div class="footer-social">
              <a href="">
                <v-icon>mdi-facebook</v-icon>
              </a>
              <a href="">
                <v-icon>mdi-twitter</v-icon>
              </a>
              <a href="">
                <v-icon>mdi-linkedin</v-icon>
              </a>
              <a href="">
                <v-icon>mdi-instagram</v-icon>
              </a>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
import TextSection from "@/layout/TextSection";
import EventCard from "../Event/EventCard";
import { getFilePerEndpoint } from "@/utils";
import { mapGetters } from "vuex";
import GridCardLoader from "@/components/GridCardLoader";

export default {
  name: "Dashboard",
  components: {
    GridCardLoader,
    TextSection,
    EventCard,
  },
  computed: {
    ...mapGetters(["getEndpointLabel"]),
  },
  data: () => ({
    events: [],
    isLoading: true,
  }),
  created () {
    const action = getFilePerEndpoint(this.getEndpointLabel, "event");
    let startDate = new Date();
    startDate.setDate(startDate.getDate());
    action
      .getEvents(
        {
          startDate: {
            after: startDate,
          },
          status: "APPROVED",
        },
        this.$apollo,
      )
      .then((result) => {
        this.$data.events = result["hydra:member"]
          ? result["hydra:member"]
          : result;
      })
      .then(() => (this.$data.isLoading = false));
  },
};
</script>

<style scoped>
header {
  background-image: url("../../../assets/images/header-image.jpeg");
  background-size: cover;
  background-position: center;
}

.min-vh-70 {
  min-height: 70vh;
}

.banner-search .btn i {
  margin-right: 8px;
  color: white;
}

h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 19px;
  margin-top: 6px;
}

.description {
  font-size: 15px;
  line-height: 24px;
}

.footer-list {
  padding: 0;
}

.footer-list li {
  color: #242526;
  font-size: 15px;
  margin-bottom: 15px;
  list-style: none;
}

.footer-list i {
  color: #3f51b5;
  font-size: 16px;
  margin-right: 12px;
}

.footer-list li a {
  color: #242526;
  box-shadow: none;
  text-decoration: none;
}

.footer-social {
  margin-top: 34px;
}

.footer-social a {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  float: left;
  box-shadow: none;
  text-decoration: none;
  border: 1px solid #e0e1e6;
  color: #838488;
  border-radius: 50px;
}

.footer-social a:not(:first-child) {
  margin: 0 3px 0 11px;
}
</style>
