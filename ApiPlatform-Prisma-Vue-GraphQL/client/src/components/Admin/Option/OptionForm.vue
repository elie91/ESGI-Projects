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
            name="name"
            component="v-text-field"
            label="Nom"
            required
            :error="!!errors.name"
            :rules="[errors.name ? $t(errors.name) : true]"
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
  import ErrorForm from "@/components/ErrorForm";
  import Field from "@/components/Vuemik/Field";

  export default {
    name: "OptionForm",
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
    }
  }
</script>

<style>

</style>
