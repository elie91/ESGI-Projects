<template>
  <EntityList
    :headers="headers"
    title="Gestion des options de logements "
    :path-to-add="pathToAdd"
    :get-entity-action="getOptionsAction"
    :path-to-edit="pathToEdit"
    :delete-entity-action="deleteOptionAction"
  />

</template>

<script>
  import EntityList from "@/layout/EntityList";

  export default {
    name: "OptionList",
    data: () => ({
      headers: [
        {text: "Nom", value: "name"},
        {text: "Actions", value: "actions", sortable: false},
      ],
      pathToAdd: {name: 'back_option_new'},
      pathToEdit: {name: "back_option_edit"},
      getOptionsAction: {
        filename: 'option',
        actionName: 'getOptions'
      },
      deleteOptionAction: {
        filename: 'option',
        actionName: 'deleteOption'
      }
    }),
    components: {
      EntityList
    }
  };
</script>

