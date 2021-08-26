<template>
  <div>
    <v-text-field
      v-if="loading"
      color="primary"
      loading
      disabled
    ></v-text-field>
    <HomeForm
      v-if="!loading"
      title="Modifier un logement"
      :initial-values="home"
      :validation-schema="validationSchema"
      action="edit"
      :errors-api="errorsApi"
      :on-submit="onSubmit"/>
  </div>
</template>

<script>
import HomeForm from "@/components/Admin/Home/HomeForm";
import {getFilePerEndpoint} from "@/utils";
import {mapGetters, mapMutations} from "vuex";
import * as yup from "yup";

export default {
  name: "HomeEdit",
  components: {
    HomeForm
  },
  computed: {
    ...mapGetters(["getEndpointLabel"]),
  },
  data: () => ({
    loading: true,
    home: {
      id: '',
      name: '',
      description: '',
      price: '',
      city: '',
      country: '',
      address: '',
      type: '',
      options: [],
      pictures: []
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Ce champ est requis"),
      price: yup.number().positive().required("Ce champ est requis"),
      city: yup.string().required("Ce champ est requis"),
      country: yup.string().required("Ce champ est requis"),
      address: yup.string().required("Ce champ est requis"),
      type: yup.string().required("Ce champ est requis"),
    }),
    errorsApi: {}
  }),
  created() {
    const homeId = this.$route.params.id;
    const action = getFilePerEndpoint(this.getEndpointLabel, "home");
    action.getHome(homeId, this.$apollo).then(home => {
      const options = home.options ? home.options : home.homeOption;
      this.$data.home = {
        ...home,
        options: options.map(option => {
          return {
            text: option.name,
            value: option['@id'] ? option['@id'] : option.id
          }
        }),
        pictures: home.pictures
      };
      this.$data.loading = false;
    });
  },
  methods: {
    ...mapMutations(["addFlashMessage"]),
    onSubmit(values) {
      const action = getFilePerEndpoint(this.getEndpointLabel, "home");
      action.editHome({
        ...values,
        price: +values.price
      }, this.$apollo)
        .then(() => {
          this.addFlashMessage({type: "success", message: "Succès lors de la modification du logement"});
          this.$router.push({name: 'back_home'});
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

}
</script>

<style scoped>

</style>
