<template>
  <HomeForm
    title="Ajouter un logement"
    :initial-values="initialValues"
    :validation-schema="validationSchema"
    :errors-api="errorsApi"
    action="add"
    :on-submit="onSubmit"/>
</template>

<script>
import HomeForm from "@/components/Admin/Home/HomeForm";
import {getFilePerEndpoint} from "@/utils";
import {mapGetters, mapMutations} from "vuex";
import * as yup from "yup";

export default {
  name: "HomeNew",
  components: {
    HomeForm
  },
  data: () => ({
    loading: false,
    initialValues: {
      id: '',
      name: '',
      description: '',
      price: '',
      city: '',
      country: '',
      address: '',
      type: '',
      options: [],
      mainPicture: [],
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
  computed: {
    ...mapGetters(["getEndpointLabel"]),
  },
  methods: {
    ...mapMutations(["addFlashMessage"]),
    onSubmit(values) {
      if (!values.errors) {
        const pictures = [
          {image: (Array.isArray(values.mainPicture) ? "" : values.mainPicture), isMainPicture: true},
          values.pictures.map(picture => {
            return {
              image: picture,
              isMainPicture: false
            }
          })
        ];
        const transformedValues = {
          ...values,
          pictures: pictures.flat()
        };
        this.$data.loading = true;
        const action = getFilePerEndpoint(this.getEndpointLabel, "home");
        action.createHome(transformedValues, this.$apollo)
          .then(() => {
            this.addFlashMessage({type: "success", message: "Succès lors de la création du logement"});
            this.$router.push({name: 'back_home'});
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.$data.loading = false;
          });
      }

    }
  }
}
</script>

<style scoped>

</style>
