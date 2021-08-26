<template>
  <v-app-bar elevation="0" color="primary" dark fixed>
    <router-link to="/" class="toolbar-title">
      <v-toolbar-title>
        SkuatCHEHwam
      </v-toolbar-title>
    </router-link>

    <v-spacer></v-spacer>

    <v-menu max-height="200" v-if="isAuthenticated && !isAdmin" offset-y :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-badge
            :content="getNumberNotificationViewed"
            :value="getNumberNotificationViewed"
            color="error"
            overlap
          >
            <v-icon>
              mdi-bell
            </v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list v-if="notifications.length > 0">
        <v-list-item v-for="(item, index) in notifications" :key="index" v-on:click="notificationViewed(item)">
          <v-list-item-title>{{ item.message }}</v-list-item-title>
          <v-list-item-icon v-if="!item.viewed">
            <v-icon color="error" small>mdi-checkbox-blank-circle</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn text v-bind:to="{ name: 'front_homes_location'}">
      Créer un évenement
    </v-btn>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon v-if="!isAuthenticated || !getUser.roles.includes('ROLE_ADMIN') && !getUser.roles.includes('ROLE_RENTER')">mdi-account</v-icon>
          <v-icon v-if="isAuthenticated && getUser.roles.includes('ROLE_ADMIN')">mdi-account-key-outline</v-icon>
          <v-icon v-if="isAuthenticated && getUser.roles.includes('ROLE_RENTER')">mdi-home-account</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item-group color="primary">
          <v-list-item link v-if="!isAuthenticated" v-bind:to="{name: 'front_signin'}">
            <v-list-item-icon>
              <v-icon>mdi-login-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t("security.signIn") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

<!--          <v-list-item link v-if="isAuthenticated" v-bind:to="{name: 'front_profile'}">
            <v-list-item-icon>
              <v-icon>mdi-form-select</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t("security.profile") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>-->

          <v-list-item
            link
            v-if="isAuthenticated && (getUser.roles.includes('ROLE_ADMIN') || getUser.roles.includes('ROLE_RENTER'))"
            v-bind:to="{name: 'back_home'}">
            <v-list-item-icon>
              <v-icon>mdi-account-box</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t("security.admin") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            v-if="isAuthenticated && !getUser.roles.includes('ROLE_ADMIN') && !getUser.roles.includes('ROLE_RENTER')"
            v-bind:to="{name: 'front_events'}">
            <v-list-item-icon>
              <v-icon>mdi-calendar-text</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Mes événements</v-list-item-title>
            </v-list-item-content>
          </v-list-item>


          <v-list-item color="error" v-if="isAuthenticated" @click="signOut">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t("security.signOut") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>

    <v-switch
      color="white"
      @change="switchAndSaveEndpoint"
      :input-value="apiSelected"
      hide-details>
    </v-switch>
    <v-img max-width="30" max-height="30" :src="getEndpointImage" :alt="getEndpointLabel"/>

  </v-app-bar>
</template>

<script>

import { mapMutations, mapGetters } from "vuex";
import { ENDPOINTS } from "../../config/entrypoint";
import { getFilePerEndpoint } from "@/utils";

export default {
  name: "Navigation",
  computed: {
    ...mapGetters(["getEndpointLabel", "getEndpointImage", "apiSelected", "getUser", "isAuthenticated", "isAdmin"]),
    getNumberNotificationViewed () {
      return this.$data.notifications.filter(n =>n.viewed === false).length;
    },
  },
  data: () => ({
    notifications: [],
  }),
  created () {
    if (this.isAuthenticated && !this.isAdmin) {
      const u = new URL("http://localhost:1337/.well-known/mercure");
      u.searchParams.append("topic", `http://localhost:8080/users/${this.getUser.id}/notifications/{id}`);

      const es = new EventSource(u.toString());
      es.onmessage = e => {
        this.$data.notifications.unshift(JSON.parse(e.data))
      };
      const action = getFilePerEndpoint(this.getEndpointLabel, "notification");
      action
        .getNotifications()
        .then((result) => {
          if(result) {

            this.$data.notifications = result["hydra:member"] ? result["hydra:member"] : result;
          }
        })
        .then(() => (this.$data.isLoading = false));
    }
  },
  watch: {
    notificatons: function (val) {
      console.log(val)
    }
  },
  methods: {
    ...mapMutations(["switchEndpoint"]),
    switchAndSaveEndpoint (value) {
      const endpoint = ENDPOINTS[value ? 1 : 0];
      localStorage.setItem("endpoint", JSON.stringify(endpoint));
      this.switchEndpoint(value);
    },
    notificationViewed (notification) {
      const action = getFilePerEndpoint(this.getEndpointLabel, "notification");
      action
        .editNotification({
          id: notification.id,
        })
        .then((result) => {
          this.$data.notifications = this.$data.notifications.map(n => {
            if (result.id === n.id) {
              return {
                ...n,
                viewed: result.viewed,
              };
            }
            return n;
          });
        })
        .then(() => (this.$data.isLoading = false));
    },
    signOut () {
      this.$store.dispatch("signOut").then(() => {
        this.$router.push({ name: "front_signin" });
      });
    },
  },
};
</script>

<style scoped>
.toolbar-title {
  color: white;
  text-decoration: none;
}

</style>
