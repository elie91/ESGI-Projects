<template>
  <div>
    <v-text-field
      v-if="loading"
      color="primary"
      loading
      disabled
    ></v-text-field>
    <ServiceForm
      v-if="!loading"
      title="Modifier un service"
      :initial-values="service"
      :validation-schema="validationSchema"
      :errors-api="errorsApi"
      :on-submit="onSubmit"/>
  </div>

</template>

<script>
import {getFilePerEndpoint} from "@/utils";
import {mapGetters, mapMutations} from "vuex";
import * as yup from "yup";
import ServiceForm from "@/components/Admin/Service/ServiceForm";

export default {
  name: "UserEdit",
  components: {
    ServiceForm
  },
  computed: {
    ...mapGetters(["getEndpointLabel"]),
  },
  data: () => ({
    loading: true,
    service: {
      id: '',
      name: '',
      price: ''
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Ce champ est requis"),
      price: yup.number().positive().required('user.errors.required.firstname'),
    }),
    errorsApi: {}
  }),
  created() {
    const serviceId = this.$route.params.id;
    const action = getFilePerEndpoint(this.getEndpointLabel, "service");
    action.getService(serviceId, this.$apollo).then((service) => {
      this.$data.service = {
        id: service.id,
        name: service.name,
        price: service.price,
      }
      this.$data.loading = false;
    });
  },
  methods: {
    ...mapMutations(["addFlashMessage"]),
    onSubmit(values) {
      if (!values.errors) {
        const action = getFilePerEndpoint(this.getEndpointLabel, "service");
        action.editService(values, this.$apollo)
          .then(() => {
            this.addFlashMessage({type: "success", message: "Succès lors de la modification du service"});
            this.$router.push({name: 'back_service'});
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }

}
</script>

<style scoped>

</style>
