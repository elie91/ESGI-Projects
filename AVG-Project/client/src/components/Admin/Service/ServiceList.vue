<template>
  <EntityList
    :headers="headers"
    title="Gestion des services d'événements"
    :path-to-add="pathToAdd"
    :get-entity-action="getServicesAction"
    :path-to-edit="pathToEdit"
    :delete-entity-action="deleteServiceAction"
  />

</template>

<script>
import EntityList from "@/layout/EntityList";

export default {
  name: "ServiceList",
  data: () => ({
    headers: [
      {text: "Nom", value: "name"},
      {text: "Prix", value: "price"},
      {text: "Actions", value: "actions", sortable: false},
    ],
    pathToAdd: {name: 'back_service_new'},
    pathToEdit: {name: "back_service_edit"},
    getServicesAction: {
      filename: 'service',
      actionName: 'getServices'
    },
    deleteServiceAction: {
      filename: 'service',
      actionName: 'deleteService'
    }
  }),
  components: {
    EntityList
  }
};
</script>

