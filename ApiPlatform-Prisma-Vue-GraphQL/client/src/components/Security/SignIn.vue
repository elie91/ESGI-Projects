<template>
  <div class="login">
    <v-container fluid>
      <v-row class="min-vh-100" justify="center" align-content="center">
        <v-col cols="12" sm="12">
          <h1 class="display-3 text-center white--text">{{ $t('security.signIn') }}</h1>
        </v-col>
        <v-col cols="12" sm="7">
          <SignInForm
            :loading="loading"
            :on-submit="onSubmit"
            :initial-values="initialValues"
            :validationSchema="validationSchema"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getFilePerEndpoint } from "@/utils";
import * as yup from "yup";
import SignInForm from "@/components/Security/SignInForm";

export default {
  name: "SignIn",
  components: { SignInForm },
  data: () => ({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email("email invalide").required("L'email est requis"),
      password: yup.string().required("Le mot de passe est requis"),
    }),
    loading: false,
  }),
  computed: {
    ...mapGetters(["getEndpointLabel", "getUser"]),
  },
  methods: {
    ...mapMutations(["signIn", "addFlashMessage"]),
    onSubmit (values) {
      if (!values.errors) {
        this.$data.loading = true;
        const action = getFilePerEndpoint(this.getEndpointLabel, "security");

        action.signIn(values, this.$apollo)
          .then((result) => {
            this.signIn(result);
            this.addFlashMessage({ type: "success", message: "Bonjour " + this.getUser.firstname });
            if (this.getUser.roles.includes("ROLE_ADMIN")) {
              this.$router.push({ name: "back_dashboard" });
            } else {
              this.$router.push({ name: "front_index" });
            }
          })
          .catch(() => this.addFlashMessage({ type: "error", message: "Identifiants de connexion invalides" }))
          .finally(() => {
            this.$data.loading = false;
          });
      }
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.getters.isAuthenticated) {
        vm.$router.push({ name: "back_dashboard" });
      }
    });
  },
};
</script>

<style scoped>
.login {
  background-image: url("../../assets/images/header.jpg");
  background-size: cover;
  background-position: center;
}
</style>
