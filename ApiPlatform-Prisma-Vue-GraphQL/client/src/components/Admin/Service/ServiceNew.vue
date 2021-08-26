<template>
  <ServiceForm
    title="Ajouter un service"
    :initial-values="initialValues"
    :validation-schema="validationSchema"
    :errors-api="errorsApi"
    :on-submit="onSubmit"/>
</template>

<script>
import {getFilePerEndpoint} from "@/utils";
import {mapGetters, mapMutations} from "vuex";
import * as yup from "yup";
import ServiceForm from "@/components/Admin/Service/ServiceForm";

export default {
  name: "UserNew",
  components: {
    ServiceForm
  },
  data: () => ({
    loading: false,
    initialValues: {
      id: '',
      name: '',
      price: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Ce champ est requis"),
      price: yup.number().positive().required('user.errors.required.firstname'),
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
        const action = getFilePerEndpoint(this.getEndpointLabel, "service");
        action.createService(values, this.$apollo)
          .then(() => {
            this.addFlashMessage({type: "success", message: "Succès lors de la création du service"});
            this.$router.push({name: 'back_service'});
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
