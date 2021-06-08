<template>
  <OptionForm
    title="Ajouter une option"
    :initial-values="initialValues"
    :validation-schema="validationSchema"
    :errors-api="errorsApi"
    :on-submit="onSubmit"/>
</template>

<script>
  import {getFilePerEndpoint} from "@/utils";
  import {mapGetters, mapMutations} from "vuex";
  import * as yup from "yup";
  import OptionForm from "@/components/Admin/Option/OptionForm";

  export default {
    name: "OptionNew",
    components: {
      OptionForm
    },
    data: () => ({
      loading: false,
      initialValues: {
        id: '',
        name: '',
      },
      validationSchema: yup.object().shape({
        name: yup.string().required("Ce champ est requis"),
      }),
      errorsApi: {}
    }),
    computed: {
      ...mapGetters(["getEndpointLabel"]),
    },
    methods: {
      ...mapMutations(["addFlashMessage"]),
      onSubmit(values) {
        if (!values.errors) {
          this.$data.loading = true;
          const action = getFilePerEndpoint(this.getEndpointLabel, "option");
          action.createOption(values, this.$apollo)
            .then(() => {
              this.addFlashMessage({type: "success", message: "Succès lors de la création de l'option"});
              this.$router.push({name: 'back_option'});
            })
            .catch((err) => {
              console.log(err)
            })
            .finally(() => {
              this.$data.loading = false;
            });
        }
      }
    }
  }
</script>

<style scoped>

</style>
