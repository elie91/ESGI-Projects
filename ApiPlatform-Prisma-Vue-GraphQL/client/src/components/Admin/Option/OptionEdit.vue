<template>
  <div>
    <v-text-field
      v-if="loading"
      color="primary"
      loading
      disabled
    ></v-text-field>
    <OptionForm
      v-if="!loading"
      title="Modifier une option"
      :initial-values="option"
      :validation-schema="validationSchema"
      :errors-api="errorsApi"
      :on-submit="onSubmit"/>
  </div>

</template>

<script>
  import {getFilePerEndpoint} from "@/utils";
  import {mapGetters, mapMutations} from "vuex";
  import * as yup from "yup";
  import OptionForm from "@/components/Admin/Option/OptionForm";

  export default {
    name: "UserEdit",
    components: {
      OptionForm
    },
    computed: {
      ...mapGetters(["getEndpointLabel"]),
    },
    data: () => ({
      loading: true,
      option: {
        id: '',
        name: '',
      },
      validationSchema: yup.object().shape({
        name: yup.string().required("Ce champ est requis"),
      }),
      errorsApi: {}
    }),
    created() {
      const optionId = this.$route.params.id;
      const action = getFilePerEndpoint(this.getEndpointLabel, "option");
      action.getOption(optionId, this.$apollo).then((option) => {
        this.$data.option = {
          id: option.id,
          name: option.name
        }
        this.$data.loading = false;
      });
    },
    methods: {
      ...mapMutations(["addFlashMessage"]),
      onSubmit(values) {
        if (!values.errors) {
          const action = getFilePerEndpoint(this.getEndpointLabel, "option");
          action.editOption(values, this.$apollo)
            .then(() => {
              this.addFlashMessage({type: "success", message: "Succès lors de la modification de l'option"});
              this.$router.push({name: 'back_option'});
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }
    }

  }
</script>

<style scoped>

</style>
