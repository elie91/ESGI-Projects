<template>
  <v-navigation-drawer
    permanent
    class="sidebar"
  >
    <v-list dense>

      <v-list-item :to="{name: 'back_dashboard'}">
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="isAdmin" :to="{name: 'back_user'}">
        <v-list-item-icon>
          <v-icon>mdi-account-group-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Utilisateurs</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="isAdmin || isRenter" :to="{name: 'back_home'}">
        <v-list-item-icon>
          <v-icon>mdi-home-city</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Logements</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="isAdmin || isRenter" :to="{name: 'back_rent'}">
        <v-list-item-icon>
          <v-icon>mdi-home-city</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Locations</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="isAdmin" :to="{name: 'back_service'}">
        <v-list-item-icon>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Services</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="isAdmin" :to="{name: 'back_option'}">
        <v-list-item-icon>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Options</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item :to="{name: 'back_event'}">
        <v-list-item-icon>
          <v-icon>mdi-calendar</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Événements</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-list>

  </v-navigation-drawer>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "Sidebar",
    computed: {
      ...mapGetters([
        "isAdmin",
        "isRenter",
        "getUser"
      ]),
    },
    data() {
      return {
        drawer: true,
        mini: true,
      }
    },
  };
</script>

<style scoped>
  .sidebar {
    padding-top: 5rem;
    min-width: 250px;
    max-width: 250px;
    height: 100vh !important;
  }
</style>
