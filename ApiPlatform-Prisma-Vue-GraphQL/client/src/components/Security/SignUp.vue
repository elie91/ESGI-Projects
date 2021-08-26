<template>
  <v-container>
    <v-row class="min-vh-100" justify="center" align-content="center">
      <v-col cols="12" sm="8">
        <SignUpForm
          :loading="loading"
          :title="$t('security.signUp')"
          :on-submit="onSubmit"
          :initial-values="initialValues"
          :validationSchema="validationSchema"
          :errorsApi="errorsApi"
          :is-edit="false"
        />
        <div class="mt-2">
          <router-link to="/sign-in">{{ $t("security.signIn") }}</router-link>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getFilePerEndpoint, phoneRegex } from "@/utils";
import { mapGetters, mapMutations } from "vuex";
import SignUpForm from "@/components/Security/SignUpForm";
import * as yup from "yup";

export default {
  name: "SignUp",
  components: {
    SignUpForm,
  },
  data: () => ({
    loading: false,
    initialValues: {
      email: "",
      lastname: "",
      firstname: "",
      phone: "",
      plainPassword: "",
      confirmPassword: "",
      roles: "ROLE_USER",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email("user.errors.email").required("user.errors.required.email"),
      firstname: yup.string().required("user.errors.required.firstname"),
      lastname: yup.string().required("user.errors.required.lastname"),
      plainPassword: yup.string().min(8, "user.errors.plainPassword").required("user.errors.required.plainPassword"),
      confirmPassword: yup.string()
        .oneOf([yup.ref("plainPassword"), null], "user.errors.samePassword")
        .required("user.errors.required.confirmPassword"),
      phone: yup.string().matches(phoneRegex, "user.errors.phone").required("user.errors.required.phone"),
      roles: yup.string().required("user.errors.required.roles"),
    }),
    errorsApi: {},
  }),
  computed: {
    ...mapGetters(["getEndpointLabel"]),
  },
  methods: {
    ...mapMutations(["addFlashMessage"]),
    onSubmit (values) {
      if (!values.errors) {
        this.$data.loading = true;
        if(this.getEndpointLabel === 'prisma') {
          return this.addFlashMessage({ type: "error", message: "Bah ouai les rôles marchent pas avec Prisma, donc inscris toi avec API PLATFORM merci bien" });
        }
        const action = getFilePerEndpoint(this.getEndpointLabel, "security");
        action.signUp({
          ...values,
          roles: [values.roles],
        }, this.$apollo)
          .then(() => {
            this.addFlashMessage({ type: "success", message: "Mail Send" });
            this.$router.push({ name: "front_signin" });
          })
          .catch((err) => {
            if (err.errors) {
              this.$data.errorsApi = err.errors;
            }
          }).finally(() => {
          this.$data.loading = false;
        });
      }
    },
  },
};
</script>

<style scoped>

</style>
