<template>
  <v-card elevation="2">
    <v-card-title class="text-h5">{{ title }}</v-card-title>
    <v-card-text>
      <ErrorForm :errors="errorsApi"></ErrorForm>
      <Vuemik
        :initial-values="initialValues"
        :on-submit="onSubmit"
        :validationSchema="validationSchema">
        >
        <template v-slot:default="{ handleSubmit, errors }">
          <Field
            name="email"
            component="v-text-field"
            label="Email"
            required
            :error="!!errors.email"
            :rules="[errors.email ? $t(errors.email) : true]"
          />

          <v-row>
            <v-col cols="6">
              <Field
                name="lastname"
                component="v-text-field"
                label="Nom"
                required
                :error="!!errors.lastname"
                :rules="[errors.lastname ? $t(errors.lastname) : true]"
              />
            </v-col>
            <v-col cols="6">
              <Field
                name="firstname"
                component="v-text-field"
                label="Prénom"
                required
                :error="!!errors.firstname"
                :rules="[errors.firstname ? $t(errors.firstname) : true]"
              />
            </v-col>
          </v-row>

          <Field
            name="phone"
            component="v-text-field"
            label="Téléphone"
            required
            :error="!!errors.phone"
            :rules="[errors.phone ? $t(errors.phone) : true]"
          />

          <Field
            name="roles"
            component="v-select"
            label="Rôles"
            required
            multiple
            :items="roles"
            :error="!!errors.roles"
            :rules="[errors.roles ? $t(errors.roles) : true]"
          />

          <Field
            v-if="initialValues.plainPassword !== undefined"
            name="plainPassword"
            component="v-text-field"
            label="Mot de passe"
            required
            type="password"
            :value="initialValues.plainPassword"
            :error="!!errors.plainPassword"
            :rules="[errors.plainPassword ? $t(errors.plainPassword) : true]"
          />

          <v-btn
            color="success"
            class="mr-4"
            @click="handleSubmit"
          >
            {{ $t('form.validate') }}
          </v-btn>
        </template>

      </Vuemik>
    </v-card-text>
  </v-card>
</template>

<script>
import Vuemik from "@/components/Vuemik/Vuemik";
import {ROLES} from '../../../../config/constant';
import ErrorForm from "@/components/ErrorForm";
import Field from "@/components/Vuemik/Field";

export default {
  name: "UserForm",
  components: {
    Vuemik,
    ErrorForm,
    Field
  },
  props: {
    loading: Boolean,
    initialValues: Object,
    onSubmit: Function,
    title: String,
    validationSchema: Object,
    errorsApi: Object,
  },
  data: () => ({
    roles: ROLES
  })
}
</script>

<style>

</style>
