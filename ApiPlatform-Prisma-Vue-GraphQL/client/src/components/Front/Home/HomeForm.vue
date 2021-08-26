<template>
  <v-container>
    <h1 class="text-center mt-5">Création de votre événement</h1>
    <ErrorForm :errors="errorsApi"></ErrorForm>
    <v-stepper v-model="step" class="mt-5">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          Choix du logement
        </v-stepper-step>
        <v-stepper-step :complete="step > 2" step="2">
          Informations de l'événement
        </v-stepper-step>
        <v-stepper-step :complete="step > 3" step="3">
          Services de l'événement
        </v-stepper-step>
        <v-stepper-step :complete="step === 4" step="4">
          Recapitulatif
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <Vuemik :initial-values="initialValuesStepTwo" :on-submit="onSubmitStepTwo"
                  :validationSchema="validationSchemaStepTwo">
            <template v-slot:default="{ handleSubmit, errors }">
              <v-row>
                <v-col cols="12" sm="6">
                  <HomeModalList :handleHome="handleHome" :error-home="errorHome"/>
                </v-col>
                <v-col cols="12" sm="6" class="text-center">
                  <h2 class="mb-3">Date de la location</h2>
                  <Field
                    locale="fr"
                    :min-date="getMinDate"
                    is-range
                    :disabled-dates="getDisabledDates"
                    name="rentDate"
                    component="v-date-picker"
                    :error="!!errors.date"
                    :rules="[errors.date ? $t(errors.date) : true]"
                  />
                </v-col>
                <v-col cols="12" sm="12" class="text-right">
                  <v-btn color="primary" @click="handleSubmit">Suivant</v-btn>
                </v-col>
              </v-row>
            </template>
          </Vuemik>
        </v-stepper-content>
        <v-stepper-content step="2">
          <Vuemik :initial-values="initialValuesStepOne" :on-submit="onSubmitStepOne"
                  :validationSchema="validationSchemaStepOne">
            <template v-slot:default="{ handleSubmit, errors }">
              <v-row align="center">
                <v-col sm="8">
                  <v-row>
                    <v-col sm="6">
                      <Field
                        outlined
                        name="name"
                        component="v-text-field"
                        label="Nom"
                        required
                        :error="!!errors.name"
                        :rules="[errors.name ? $t(errors.name) : true]"
                      />
                    </v-col>
                    <v-col sm="6">
                      <Field
                        outlined
                        name="peopleLimit"
                        component="v-text-field"
                        type="number"
                        min="0"
                        label="Limites de personnes"
                        required
                        :error="!!errors.peopleLimit"
                        :rules="[errors.peopleLimit ? $t(errors.peopleLimit) : true]"
                      />
                    </v-col>
                    <v-col sm="12">
                      <Field
                        rows="5"
                        name="description"
                        component="v-textarea"
                        label="Description"
                        outlined
                        :error="!!errors.description"
                        :rules="[errors.description ? $t(errors.description) : true]"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col sm="4" class="text-center">
                  <h2 class="mb-3">Date de l'évenement</h2>
                  <ErrorForm :errors="errors.date ? {date: errors.date} : {}"></ErrorForm>
                  <Field
                    v-if="finalObject.rentDate"
                    locale="fr"
                    :min-date="finalObject.rentDate.start"
                    :max-date="finalObject.rentDate.end"
                    is-range
                    name="date"
                    component="v-date-picker"
                  />
                </v-col>
                <v-col sm="6" cols="12">
                  <v-btn color="primary" @click="step -= 1">Precedent</v-btn>
                </v-col>
                <v-col cols="12" sm="6" class="text-right">
                  <v-btn color="primary" @click="handleSubmit">Suivant</v-btn>
                </v-col>
              </v-row>
            </template>
          </Vuemik>
        </v-stepper-content>
        <v-stepper-content step="3">
          <Vuemik :initial-values="initialValuesStepThree" :on-submit="onSubmitStepThree"
                  :validationSchema="validationSchemaStepThree">
            <template v-slot:default="{ handleSubmit, errors }">
              <Field
                name="services"
                component="v-select"
                label="Services"
                required
                multiple
                chips
                outlined
                :item-text="(value) => `${value.name} - ${value.price}€`"
                item-value="@id"
                persistent-hint
                return-object
                :items="eventServices"
                :error="!!errors.services"
                :rules="[errors.services ? $t(errors.services) : true]"
              />
              <v-row>
                <v-col sm="6" cols="12">
                  <v-btn color="primary" @click="step -= 1">Precedent</v-btn>
                </v-col>
                <v-col cols="12" sm="6" class="text-right">
                  <v-btn color="primary" @click="handleSubmit">Suivant</v-btn>
                </v-col>
              </v-row>
            </template>
          </Vuemik>
        </v-stepper-content>
        <v-stepper-content step="4">
          <v-row>
            <v-col cols="12" sm="8">
              <h2 class="mb-5">Votre événement</h2>
              <p>Nom : {{ this.$data.finalObject.name }}</p>
              <p>Limite de personne : {{ this.$data.finalObject.peopleLimit }}</p>
              <p v-if="this.$data.finalObject.date">Date de l'événement :
                {{ formatDate(this.$data.finalObject.date.start) }} - {{
                  formatDate(this.$data.finalObject.date.end)
                }}</p>
              <div v-if="this.$data.finalObject.services && this.$data.finalObject.services.length > 0">
                <h2 class="mb-5">Services choisis</h2>
                <ul>
                  <li v-for="item in this.$data.finalObject.services" :key="item['@id']">
                    {{ `${item.name} - ${item.price}€` }}
                  </li>
                </ul>
              </div>
              <div v-if="this.$data.finalObject.rentDate && this.$data.finalObject.services">
                <h2 class="my-5">Montant</h2>
                <p>Montant du sejour : {{
                    getTotalPriceRent(this.$data.finalObject.rentDate.start, this.$data.finalObject.rentDate.end, this.$data.finalObject.home.price)
                  }} €</p>
                <p>Montant des services : {{ getTotalService }} €</p>
                <p class="text-h6">Total : {{
                    getTotalPriceRent(this.$data.finalObject.rentDate.start, this.$data.finalObject.rentDate.end, this.$data.finalObject.home.price) + getTotalService
                  }} €</p>
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <h2 class="mb-5">Votre location</h2>
              <p v-if="this.$data.finalObject.rentDate">Date de la location :
                {{ formatDate(this.$data.finalObject.rentDate.start) }} -
                {{ formatDate(this.$data.finalObject.rentDate.end) }}</p>
              <HomeCard :full-height="false" :home="selectedHome" :show-action="false"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="6" cols="12" class="mt-5">
              <v-btn color="primary" @click="step -= 1">Precedent</v-btn>
            </v-col>
            <v-col cols="12" sm="6" class="text-right mt-5">
              <v-btn color="success" @click="onSubmit">Confirmer la création de l'événement</v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import Vuemik from "@/components/Vuemik/Vuemik";
import Field from "@/components/Vuemik/Field";
import ErrorForm from "@/components/ErrorForm";
import HomeModalList from "@/components/Admin/Home/HomeModalList";
import HomeCard from "@/components/Admin/Home/HomeCard";
import {getFilePerEndpoint, getTotalPriceRent} from "@/utils";
import {mapGetters, mapMutations} from "vuex";
import * as yup from "yup";
import {format} from "date-fns";

export default {
  name: "HomeForm",
  components: {
    HomeModalList,
    HomeCard,
    Vuemik,
    ErrorForm,
    Field,
  },
  data: () => ({
    loading: false,
    initialValuesStepOne: {
      name: "",
      peopleLimit: "",
      description: "",
      date: {
        start: null,
        end: null,
      },
    },
    initialValuesStepTwo: {
      rentDate: {
        start: null,
        end: null,
      },
    },
    initialValuesStepThree: {
      services: [],
    },
    validationSchemaStepOne: yup.object().shape({
      name: yup.string().required("event.errors.required.name"),
      peopleLimit: yup.number().typeError("event.errors.peopleLimit").positive().required("event.errors.required.peopleLimit"),
      description: yup.string().required("event.errors.required.description"),
      date: yup.object().shape({
        start: yup.date().required(),
        end: yup.date().required(),
      }),
    }),
    validationSchemaStepTwo: yup.object().shape({
      rentDate: yup.object().shape({
        start: yup.date().required(),
        end: yup.date().required(),
      }),
    }),
    validationSchemaStepThree: yup.object().shape({
      services: yup.array(),
    }),
    errorsApi: {},
    step: 1,
    eventServices: [],
    rentsByHome: [],
    selectedHome: null,
    errorHome: null,
    finalObject: {},
  }),
  computed: {
    ...mapGetters(["getEndpointLabel", "getUser"]),
    getTotalService: function () {
      return this.finalObject.services.reduce((acc, value) => {
        acc += value.price;
        return acc;
      }, 0);
    },
    getDisabledDates: function () {
      return this.$data.rentsByHome.map(rent => {
        return {
          start: new Date(rent.startDate),
          end: new Date(rent.endDate),
        };
      });
    },
    getMinDate(){
      let date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    }
  },
  watch: {
    selectedHome: function (value) {
      const action = getFilePerEndpoint(this.getEndpointLabel, "rent");
      let params = {};
      if (this.getEndpointLabel === 'prisma') {
        params = {
          where: {
            home: {
              id: value["id"]
            }
          }
        }
      } else {
        params = {
          home: value["@id"]
        }
      }
      action.getRents(params, this.$apollo).then(result => {
        this.$data.rentsByHome = result["hydra:member"] ? result["hydra:member"] : result;
      }).catch((e) => console.log(e));
    },
  },
  methods: {
    ...mapMutations(["addFlashMessage"]),
    formatDate: (date) => {
      return format(date, "dd/MM/yyyy");
    },
    getTotalPriceRent: (dateStart, dateEnd, price) => {
      return getTotalPriceRent(dateStart, dateEnd, price);
    },
    onSubmitStepOne(data) {
      if (!data.errors) {
        this.$data.finalObject = {
          ...this.$data.finalObject,
          ...data,
        };
        this.$data.step += 1;
      }
    },
    onSubmitStepTwo(data) {
      if (!data.errors && this.$data.selectedHome) {
        this.$data.finalObject = {
          ...this.$data.finalObject,
          ...data,
          home: this.$data.selectedHome,
        };
        this.$data.step += 1;
        this.$data.errorHome = null;
      } else {
        this.$data.errorHome = "Vous devez choisir une maison et une date !";
      }
    },
    onSubmitStepThree(data) {
      if (!data.errors && this.$data.selectedHome) {
        this.$data.finalObject = {
          ...this.$data.finalObject,
          ...data,
        };
        this.$data.step += 1;
      }
    },
    onSubmit() {
      let formatObject = {
        name: this.$data.finalObject.name,
        description: this.$data.finalObject.description,
        peopleLimit: parseInt(this.$data.finalObject.peopleLimit, 10),
        startDate: this.$data.finalObject.date.start,
        endDate: this.$data.finalObject.date.end,
        rent: {
          home: this.$data.finalObject.home["@id"] ? this.$data.finalObject.home["@id"] : this.$data.finalObject.home["id"],
          startDate: this.$data.finalObject.rentDate.start,
          endDate: this.$data.finalObject.rentDate.end,
          totalPrice: getTotalPriceRent(this.$data.finalObject.rentDate.start, this.$data.finalObject.rentDate.end, this.$data.finalObject.home.price),
          services: this.$data.finalObject.services.map(service => service["@id"] ? service["@id"] : service["id"]),
        },
      };
      if (this.getUser) {
        const eventAction = getFilePerEndpoint(this.getEndpointLabel, "event");
        if (this.getEndpointLabel === 'prisma') {
          const rentAction = getFilePerEndpoint(this.getEndpointLabel, "rent");
          rentAction.createRent({...formatObject.rent, owner: this.getUser['id']}, this.$apollo)
            .then((createdRent) => {
              eventAction.createEvent({...formatObject, rent: createdRent.id}, this.$apollo)
                .then(() => {
                  this.addFlashMessage({
                    type: "success",
                    message: "Succès lors de la création d'un evenement",
                  });
                  this.$router.push({name: "front_events"});
                })
            })
        } else {
          eventAction.createEvent(formatObject, this.$apollo)
            .then(() => {
              this.addFlashMessage({
                type: "success",
                message: "Succès lors de la création d'un evenement",
              });
              this.$router.push({name: "front_events"});
            })
            .catch((err) => {
              console.log(err);
            });
        }

      } else {
        this.addFlashMessage({
          type: "error",
          message: "Vous devez vous connecter pour pouvoir créer un événement",
        });
        this.$router.push({name: "front_signin"});
      }

    },
    handleHome(value) {
      this.$data.selectedHome = value;
    },

  },
  created() {
    const action = getFilePerEndpoint(this.getEndpointLabel, "service");
    action.getServices(null, this.$apollo).then((result) => {
      this.$data.eventServices = result["hydra:member"] ? result["hydra:member"] : result;
    });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.$store.getters.isAuthenticated) {
        vm.$router.push({name: "front_signin"});
      }
    });
  },
};
</script>

<style>
</style>
