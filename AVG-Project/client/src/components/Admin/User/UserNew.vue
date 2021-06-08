<template>
  <UserForm
    title="Ajouter un utilisateur"
    :initial-values="initialValues"
    :validation-schema="validationSchema"
    :errors-api="errorsApi"
    :on-submit="onSubmit"/>
</template>

<script>
import UserForm from "@/components/Admin/User/UserForm";
import {getFilePerEndpoint, phoneRegex} from "@/utils";
import {mapGetters, mapMutations} from "vuex";
import * as yup from "yup";

export default {
  name: "UserNew",
  components: {
    UserForm
  },
  data: () => ({
    loading: false,
    initialValues: {
      id: '',
      email: '',
      lastname: '',
      firstname: '',
      phone: '',
      roles: '',
      plainPassword: ''
    },
    validationSchema: yup.object().shape({
      email: yup.string().email('user.errors.email').required('user.errors.required.email'),
      firstname: yup.string().required('user.errors.required.firstname'),
      lastname: yup.string().required('user.errors.required.lastname'),
      plainPassword: yup.string().min(8, 'user.errors.plainPassword').required('user.errors.required.plainPassword'),
      phone: yup.string().matches(phoneRegex, 'user.errors.phone').required('user.errors.required.phone'),
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
        const action = getFilePerEndpoint(this.getEndpointLabel, "user");
        action.createUser(values, this.$apollo)
          .then(() => {
            this.addFlashMessage({type: "success", message: "Succès lors de la création de l'utilisateur"});
            this.$router.push({name: 'back_user'});
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
