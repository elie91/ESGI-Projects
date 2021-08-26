<template>
  <EntityList
    :headers="headers"
    :title="isAdmin ? 'Gestion des locations': 'Gestion de mes locations'"
    :get-entity-action="getRentsAction"
  />
</template>

<script>
import EntityList from "@/layout/EntityList";
import {mapGetters} from "vuex";

export default {
  name: "RentList",
  computed: {
    ...mapGetters([
      "getEndpointLabel",
      "isAdmin",
      "getUser"
    ]),
  },
  created() {
    if (this.getEndpointLabel === 'prisma' && !this.isAdmin) {
      let params = {};
      params = {
        where: {
          home: {
            owner: {
              id: this.getUser['id']
            }
          }
        }
      }
      this.$data.getRentsAction = {
        ...this.$data.getRentsAction,
        params
      }
    }
  },
  data: () => ({
    headers: [
      {text: "Logement", value: "home.name"},
      {text: "Prix total", value: "totalPrice"},
      {text: "Loueur", value: "owner"},
      {text: "Date de début", value: "startDate"},
      {text: "Date de fin", value: "endDate"},
      {text: "Créé le", value: "createdAt"},
    ],
    getRentsAction: {
      filename: "rent",
      actionName: "getRents",
    },
  }),
  components: {
    EntityList,
  },
};
</script>

