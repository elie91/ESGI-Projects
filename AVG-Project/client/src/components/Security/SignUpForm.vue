<template>
  <v-card elevation="1" :loading="loading">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <ErrorForm :errors="errorsApi"></ErrorForm>
      <Vuemik :initialValues="initialValues" :onSubmit="onSubmit" :validationSchema="validationSchema">
        <template v-slot:default="{ handleSubmit, handleChange, errors }">
          <Field
            v-if="initialValues.roles"
            class="py-4"
            name="roles"
            component="v-select"
            :label="$t('user.roles')"
            required
            outlined
            :items="userRoles"
            :error="!!errors.roles"
            :rules="[errors.roles ? $t(errors.roles) : true]"
          />
          <Field
            name="email"
            component="v-text-field"
            :label="$t('user.email')"
            required
            outlined
            :error="!!errors.email"
            :rules="[errors.email ? $t(errors.email) : true]"
          />
          <v-row>
            <v-col cols="6">
              <Field
                name="lastname"
                component="v-text-field"
                :label="$t('user.lastname')"
                required
                outlined
                :error="!!errors.lastname"
                :rules="[errors.lastname ? $t(errors.lastname) : true]"
              />
            </v-col>
            <v-col cols="6">
              <Field
                name="firstname"
                component="v-text-field"
                :label="$t('user.firstname')"
                required
                outlined
                :error="!!errors.firstname"
                :rules="[errors.firstname ? $t(errors.firstname) : true]"
              />
            </v-col>
          </v-row>
          <Field
            name="phone"
            component="v-text-field"
            :label="$t('user.phone')"
            required
            outlined
            :error="!!errors.phone"
            :rules="[errors.phone ? $t(errors.phone) : true]"
          />
          <v-row v-if="!isEdit">
            <v-col cols="6">
              <Field
                name="plainPassword"
                component="v-text-field"
                type="password"
                :label="$t('user.plainPassword')"
                required
                outlined
                :error="!!errors.plainPassword"
                :rules="[errors.plainPassword ? $t(errors.plainPassword) : true]"
              />
            </v-col>
            <v-col cols="6">
              <Field
                name="confirmPassword"
                component="v-text-field"
                type="password"
                :label="$t('user.confirmPassword')"
                required
                outlined
                :error="!!errors.confirmPassword"
                :rules="[errors.confirmPassword ? $t(errors.confirmPassword) : true]"
              />
            </v-col>
          </v-row>
          <v-btn color="primary" block @click="handleSubmit">
            {{ $t(isEdit ? "Mettre à jour" : "security.signUp") }}
          </v-btn>
        </template>
      </Vuemik>
    </v-card-text>
  </v-card>
</template>

<script>
import Vuemik from "@/components/Vuemik/Vuemik";
import ErrorForm from "@/components/ErrorForm";
import Field from "@/components/Vuemik/Field";
import {ROLE_RENTER, ROLE_USER} from "../../../config/constant";

export default {
  name: "SignUpForm",
  components: {
    Field,
    Vuemik,
    ErrorForm,
  },
  data: () => ({
    userRoles: [
      {
        text: "Utilisateur",
        value: ROLE_USER
      },
      {
        text: "Loueur",
        value: ROLE_RENTER
      }
    ]
  }),
  props: {
    loading: Boolean,
    onSubmit: Function,
    title: String,
    initialValues: Object,
    validationSchema: Object,
    errorsApi: Object,
    isEdit: Boolean,
  },
};
</script>
