<template>
  <v-card elevation="2">
    <div class="d-flex justify-space-between">
      <v-card-title class="text-h5">{{ title }}</v-card-title>
      <v-card-title v-if="isAdmin && initialValues.status === 'CREATED' && action === 'edit'">
        <v-btn color="success" v-on:click="approveHome(true)">
          Approuvé
        </v-btn>
        <v-btn color="error" class="ml-2" v-on:click="approveHome(false)">
          Rejeter
        </v-btn>
      </v-card-title>
      <v-chip
        v-if="!isAdmin && action === 'edit'"
        class="ma-2"
        :color="initialValues.status !== 'CREATED' ? initialValues.status === 'VERIFIED' ? 'success' : 'error' : 'primary'"
      >
        {{ initialValues.status !== 'CREATED' ? initialValues.status === 'VERIFIED' ? 'Vérifié' : 'Rejeté' : 'En attente de validation' }}
      </v-chip>
    </div>

    <v-card-text>
      <ErrorForm :errors="errorsApi"></ErrorForm>
      <Vuemik
        :initial-values="initialValues"
        :on-submit="onSubmit"
        :validationSchema="validationSchema"
      >
        <template v-slot:default="{ handleSubmit, errors }">
          <Field
            name="name"
            component="v-text-field"
            label="Nom"
            required
            outlined
            :error="!!errors.name"
            :rules="[errors.name ? $t(errors.name) : true]"
          />
          <Field
            prefix="€"
            name="price"
            component="v-text-field"
            label="Prix par jour"
            type="number"
            required
            outlined
            :error="!!errors.price"
            :rules="[errors.price ? $t(errors.price) : true]"
          />
          <Field
            name="description"
            component="v-textarea"
            label="Description"
            outlined
            :error="!!errors.description"
            :rules="[errors.description ? $t(errors.description) : true]"
          />
          <v-row>
            <v-col cols="4">
              <Field
                name="address"
                component="v-text-field"
                label="Adresse"
                required
                outlined
                :error="!!errors.address"
                :rules="[errors.address ? $t(errors.address) : true]"
              />
            </v-col>
            <v-col cols="4">
              <Field
                name="city"
                component="v-text-field"
                label="Ville"
                outlined
                required
                :error="!!errors.city"
                :rules="[errors.city ? $t(errors.city) : true]"
              />
            </v-col>
            <v-col cols="4">
              <Field
                name="country"
                component="v-text-field"
                label="Pays"
                required
                outlined
                :error="!!errors.country"
                :rules="[errors.country ? $t(errors.country) : true]"
              />
            </v-col>
          </v-row>
          <Field
            name="type"
            component="v-select"
            label="Type de logement"
            required
            outlined
            :items="homeTypes"
            :error="!!errors.homeTypes"
            :rules="[errors.homeTypes ? $t(errors.homeTypes) : true]"
          />
          <div class="text-h5 black--text mb-5">Images</div>
          <v-divider class="my-5"></v-divider>
          <v-row v-if="action === 'add'">
            <v-col cols="6">
              <div class="text-h6 mb-5">Image principale</div>
              <Field
                name="mainPicture"
                component="v-file-input"
                type="file"
                required
                clearable
                loading="true"
                outlined
                :error="!!errors.mainPicture"
                :rules="[errors.mainPicture ? $t(errors.mainPicture) : true]"
              />
            </v-col>
            <v-col cols="6">
              <div class="text-h6 mb-5">Autres images (champ multiple)</div>
              <Field
                name="pictures"
                component="v-file-input"
                type="file"
                multiple
                clearable
                loading="true"
                outlined
                :error="!!errors.pictures"
                :rules="[errors.pictures ? $t(errors.pictures) : true]"
              />
            </v-col>
          </v-row>
          <v-row v-else>
              <v-col
                v-for="(picture, index) in initialValues.pictures"
                :key="index"
                class="d-flex child-flex"
                cols="3"
              >
                <v-img
                  :src="picture.image"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-col>
          </v-row>
          <div class="text-h5 black--text mb-5">Options</div>
          <v-divider class="my-5"></v-divider>
          <Field
            name="options"
            component="v-select"
            label="Options du logement"
            required
            multiple
            chips
            filled
            outlined
            :items="homeOptions"
            :error="!!errors.options"
            :rules="[errors.options ? $t(errors.options) : true]"
          />
          <v-btn color="success" class="mr-4" @click="handleSubmit">
            {{ $t("form.validate") }}
          </v-btn>
        </template>
      </Vuemik>
    </v-card-text>
  </v-card>
</template>

<script>
  import {
    HOME_TYPE_APARTMENT,
    HOME_TYPE_HOUSE,
  } from "../../../../config/constant";
  import Vuemik from "@/components/Vuemik/Vuemik";
  import ErrorForm from "@/components/ErrorForm";
  import Field from "@/components/Vuemik/Field";
  import { mapGetters, mapMutations } from "vuex";
  import {getFilePerEndpoint} from "@/utils";

  export default {
    name: "HomeForm",
    props: {
      loading: Boolean,
      initialValues: Object,
      onSubmit: Function,
      title: String,
      validationSchema: Object,
      errorsApi: Object,
      action: String
    },
    components: {
      Vuemik,
      ErrorForm,
      Field,
    },
    data: () => ({
      homeTypes: [HOME_TYPE_APARTMENT, HOME_TYPE_HOUSE],
      homeOptions: []
    }),
    computed: {
      ...mapGetters(["getEndpointLabel", "isAdmin"]),
    },
    created() {
      const action = getFilePerEndpoint(this.getEndpointLabel, "option");
      action.getOptions(null, this.$apollo).then((result) => {
        let options = result['hydra:member'] ? result['hydra:member'] : result;
        this.$data.homeOptions = options.map(option => {
          return {
            text: option.name,
            value: option['@id'] ? option['@id'] : option.id
          }
        })
      });
    },
    methods: {
      ...mapMutations(["addFlashMessage"]),
      approveHome(value){
        const action = getFilePerEndpoint(this.getEndpointLabel, "home");
        action.updateHomeStatus({
          status: value ? 'VERIFIED' : 'REJECTED',
          id: this.initialValues.id
        }, this.$apollo)
          .then(() => {
            this.addFlashMessage({type: "success", message: "Le logement a été " + (value ? "approuvé" : "rejeté")});
            this.$router.push({name: 'back_home'});
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  };
</script>

<style>
</style>
