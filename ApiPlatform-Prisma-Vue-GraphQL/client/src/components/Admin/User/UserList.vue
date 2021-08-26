<template>
  <EntityList
    :headers="headers"
    title="Gestion des utilisateurs"
    :path-to-add="pathToAdd"
    :get-entity-action="getUsersAction"
    :path-to-edit="pathToEdit"
    :delete-entity-action="deleteUserAction"
  />

</template>

<script>
import EntityList from "@/layout/EntityList";

export default {
  name: "UserList",
  data: () => ({
    headers: [
      {text: "Email", value: "email"},
      {text: "Nom", value: "lastname"},
      {text: "Prénom", value: "firstname"},
      {text: "Téléphone", value: "phone"},
      {text: "Roles", value: "roles"},
      {text: "Créé le", value: "createdAt"},
      {text: "Modifié le", value: "updatedAt"},
      {text: "Actions", value: "actions", sortable: false},
    ],
    pathToAdd: {name: 'back_user_new'},
    pathToEdit: {name: "back_user_edit"},
    getUsersAction: {
      filename: 'user',
      actionName: 'getUsers'
    },
    deleteUserAction: {
      filename: 'user',
      actionName: 'deleteUser'
    }
  }),
  components: {
    EntityList
  }
};
</script>

