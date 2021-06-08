<template>
  <v-container class="mt-5">
    <v-tabs
      v-model="tab"
      background-color="transparent"
      grow
    >
      <v-tab>Mes événements</v-tab>
      <v-tab>Evénement à venir</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <EntityList
          :headers="headers"
          title="Évènement organisés"
          :get-entity-action="getEventsAction"
          :delete-entity-action="deleteEventAction"
          :path-to-show="pathToShow"
        />
      </v-tab-item>
      <v-tab-item>
        <EntityList
          :headers="headersEventUsers"
          title="Évènement inscrits"
          :get-entity-action="getEventUsersAction"
          :delete-entity-action="deleteEventUserAction"
          key-object="event"
          key-object-to-delete="deleteId"
          :path-to-show="pathToShow"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import EntityList from "@/layout/EntityList";
import { mapGetters } from "vuex";

export default {
  name: "EventList",
  computed: {
    ...mapGetters([
      "isAdmin",
      "isRenter",
      "getUser",
    ]),
  },
  created () {
    this.$data.getEventsAction = {
      ...this.$data.getEventsAction,
      params: {
        "isRenter": this.isRenter,
        "rent.owner": this.getUser ? this.getUser["id"] : null,
      },
    };
    this.$data.getEventUsersAction = {
      ...this.$data.getEventUsersAction,
      params: {
        "userId": this.getUser ? this.getUser["id"] : null,
      },
    };
  },
  data: () => ({
    headers: [
      { text: "Nom", value: "name" },
      { text: "Personne maximum", value: "peopleLimit" },
      { text: "Description", value: "description" },
      { text: "Date de début", value: "startDate", sortable: false },
      { text: "Date de fin", value: "endDate", sortable: false },
      { text: "Status", value: "status", translate: true },
      { text: "Actions", value: "actions", sortable: false },
    ],
    headersEventUsers: [
      { text: "Nom", value: "name" },
      { text: "Description", value: "description" },
      { text: "Date de début", value: "startDate", sortable: false },
      { text: "Date de fin", value: "endDate", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    getEventsAction: {
      filename: "event",
      actionName: "getEvents",
    },
    deleteEventAction: {
      filename: "event",
      actionName: "deleteEvent",
    },
    getEventUsersAction: {
      filename: "eventUser",
      actionName: "getEventUsers",
    },
    deleteEventUserAction: {
      filename: "eventUser",
      actionName: "deleteEventUser",
    },
    pathToShow: { name: "front_events_show" },
    tab: 0,
  }),
  components: {
    EntityList,
  },
};
</script>

