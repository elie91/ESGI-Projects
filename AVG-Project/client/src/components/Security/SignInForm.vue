<template>
  <v-card elevation="1" :loading="loading">
    <v-card-text>
      <Vuemik :initialValues="initialValues" :onSubmit="onSubmit" :validationSchema="validationSchema">
        <template v-slot:default="{ handleSubmit, handleChange, errors }">
          <Field
            name="email"
            component="v-text-field"
            :label="$t('user.email')"
            required
            outlined
            :error="!!errors.email"
            :rules="[errors.email ? $t(errors.email) : true]"
          />
          <Field
            name="password"
            component="v-text-field"
            :label="$t('user.plainPassword')"
            type="password"
            required
            outlined
            :error="!!errors.password"
            :rules="[errors.password ? $t(errors.password) : true]"
          />
          <v-btn color="primary" block @click="handleSubmit">
            {{ $t("security.signIn") }}
          </v-btn>
        </template>
      </Vuemik>
      <div class="d-flex justify-space-between flex-column flex-md-row mt-2">
        <div>
          {{ $t("security.needAccount") }}
          <router-link to="/sign-up">{{ $t("security.signUp") }}</router-link>
        </div>
        <router-link to="/sign-up">
          {{ $t("security.forgot") }}
        </router-link>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import Vuemik from "@/components/Vuemik/Vuemik";
import Field from "@/components/Vuemik/Field";

export default {
  name: "SignInForm",
  components: {
    Field,
    Vuemik,
  },
  props: {
    loading: Boolean,
    onSubmit: Function,
    title: String,
    initialValues: Object,
    validationSchema: Object
  },
};
</script>
