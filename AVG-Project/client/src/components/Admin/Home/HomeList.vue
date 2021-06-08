<template>
  <EntityList
    :headers="headers"
    :title="isAdmin ? 'Gestion des logements': 'Gestion de mes logements'"
    :props-items="homes"
    :path-to-add="pathToAdd"
    :get-entity-action="getHomesAction"
    :path-to-edit="pathToEdit"
    :delete-entity-action="deleteHomeAction"
    :display-title="displayTitle"
  />
</template>

<script>
import EntityList from "@/layout/EntityList";
import {mapGetters} from "vuex";

export default {
  name: "HomeList",
  props: {
    homes: {
      type: Array,
      required: false,
    },
    displayTitle: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters([
      "isAdmin",
      "getEndpointLabel",
      "getUser"
    ]),
  },
  created() {
    if(this.getEndpointLabel === 'prisma' && !this.isAdmin) {
      let params = {};
      params = {
        where: {
          owner: {
            id: this.getUser['id']
          }
        }
      }
      this.$data.getHomesAction = {
        ...this.$data.getHomesAction,
        params
      }
    }
  },
  data: () => ({
    headers: [
      { text: "Nom", value: "name" },
      { text: "Type de Logement", value: "type" },
      { text: "Prix/Jour", value: "price" },
      { text: "Ville", value: "city" },
      { text: "Pays", value: "country" },
      { text: "Status", value: "status" },
      { text: "Créé le", value: "createdAt" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    pathToAdd: { name: "back_home_new" },
    pathToEdit: { name: "back_home_edit" },
    getHomesAction: {
      filename: "home",
      actionName: "getHomes",
    },
    deleteHomeAction: {
      filename: "home",
      actionName: "deleteHome",
    },
  }),
  components: {
    EntityList,
  },
};
</script>

