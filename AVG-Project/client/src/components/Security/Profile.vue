<template>
  <v-container>
    <h1>{{ $t("security.profile") }}</h1>
    <SignUpForm
      v-if="!loading"
      :loading="loading"
      :title="$t('security.profile')"
      :on-submit="onSubmit"
      :initial-values="initialValues"
      :validationSchema="validationSchema"
      :errorsApi="errorsApi"
      :is-edit="true"
    />
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import SignUpForm from "@/components/Security/SignUpForm";
import { getFilePerEndpoint, phoneRegex } from "@/utils";
import * as yup from "yup";

export default {
  name: "Profile",
  components: {
    SignUpForm
  },
  data: () => ({
    loading: true,
    initialValues: {
      email: "",
      lastname: "",
      firstname: "",
      phone: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email("user.errors.email").required("user.errors.required.email"),
      firstname: yup.string().required("user.errors.required.firstname"),
      lastname: yup.string().required("user.errors.required.lastname"),
      phone: yup.string().matches(phoneRegex, "user.errors.phone").required("user.errors.required.phone"),
    }),
    errorsApi: {},
  }),
  created() {
    const action = getFilePerEndpoint(this.getEndpointLabel, "user");
    action.getUser(this.$store.getters.getUser.id, this.$apollo).then((user) => {
      this.$data.initialValues = {
        id: user.id,
        email: user.email,
        lastname: user.lastname,
        firstname: user.firstname,
        phone: user.phone,
      }
      this.$data.loading = false;
    });
  },
  computed: {
    ...mapGetters(["getEndpointLabel"]),
  },
  methods: {
    ...mapMutations(["addFlashMessage", "refreshUser"]),
    onSubmit (values) {
      if (!values.errors) {
        this.$data.loading = true;
        const action = getFilePerEndpoint(this.getEndpointLabel, "user");
        action.editUser(values, this.$apollo)
          .then((data) => {
            this.refreshUser(data)
            this.$data.initialValues = {
              email: data.email,
              lastname: data.lastname,
              firstname: data.firstname,
              phone: data.phone
            }
            this.addFlashMessage({type: "success", message: "Vos informations ont été mises à jour"});
          })
          .catch((err) => {
            console.log(err)
          })
        .finally(() => this.$data.loading = false)
      }
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.getters.isAuthenticated) {
        vm.$router.push({name: "front_signin"});
      }
    });
  },
};
</script>

<style scoped>

</style>
