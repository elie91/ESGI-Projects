<template>
  <EntityList
    :headers="headers"
    :title="isAdmin ? 'Gestion des événements': 'Gestion de mes événements'"
    :get-entity-action="getEventsAction"
    :path-to-edit="pathToEdit"
  />
</template>

<script>
import EntityList from "@/layout/EntityList";
import {mapGetters} from "vuex";

export default {
  name: "EventList",
  computed: {
    ...mapGetters([
      "isAdmin",
      "isRenter",
      "getUser",
      "getEndpointLabel"
    ]),
  },
  created() {
    if (!this.isAdmin) {
      if (this.getEndpointLabel === 'prisma') {
        this.$data.getEventsAction = {
          ...this.$data.getEventsAction,
          params: {
            "isRenter": this.isRenter,
            "rent.owner": this.getUser ? this.getUser["id"] : null,
          },
        };
      }
    }
  },
  data: () => ({
    headers: [
      {text: "Nom", value: "name"},
      {text: "Personne maximum", value: "peopleLimit"},
      {text: "Description", value: "description"},
      {text: "Date de début", value: "startDate"},
      {text: "Date de fin", value: "endDate"},
      {text: "Status", value: "status"},
      {text: "Actions", value: "actions", sortable: false},
    ],
    pathToAdd: {name: "back_event_new"},
    pathToEdit: {name: "back_event_edit"},
    getEventsAction: {
      filename: "event",
      actionName: "getEvents",
    },
  }),
  components: {
    EntityList,
  },
};
</script>

