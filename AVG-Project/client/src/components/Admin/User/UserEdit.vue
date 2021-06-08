<template>
  <v-card elevation="2" v-if="!loading">
    <v-card-title class="text-h4">Fiche utilisateur</v-card-title>
    <v-divider class="my-5"></v-divider>
    <v-card-text>
      <div class="subheading">Créé le {{ new Date(user.createdAt).toLocaleDateString() }}</div>
      <div class="subheading">Modifié le {{ new Date(user.updatedAt).toLocaleDateString() }}</div>
      <v-divider class="my-5"></v-divider>
      <div class="text-h5 black--text mb-5">Logements de l'utilisateur</div>
      <HomeList :homes="user.homes" :display-title="false"/>
      <v-divider class="my-5"></v-divider>
      <UsersForm
        title="Modifier un utilisateur"
        :initial-values="user"
        :validation-schema="validationSchema"
        :errors-api="errorsApi"
        :on-submit="onSubmit"/>
    </v-card-text>
  </v-card>
</template>

<script>
import {getFilePerEndpoint, phoneRegex} from "@/utils";
import {mapGetters, mapMutations} from "vuex";
import UsersForm from "@/components/Admin/User/UserForm";
import * as yup from "yup";
import {ROLE_USER} from "../../../../config/constant";
import HomeList from "@/components/Admin/Home/HomeList";

export default {
  name: "UserEdit",
  components: {
    HomeList,
    UsersForm
  },
  computed: {
    ...mapGetters(["getEndpointLabel"]),
  },
  data: () => ({
    loading: true,
    user: {
      id: '',
      email: '',
      lastname: '',
      firstname: '',
      phone: '',
      roles: '',
      homes: [],
      createdAt: '',
      updatedAt: ''
    },
    validationSchema: yup.object().shape({
      email: yup.string().email('user.errors.email').required('user.errors.required.email'),
      firstname: yup.string().required('user.errors.required.firstname'),
      lastname: yup.string().required('user.errors.required.lastname'),
      phone: yup.string().matches(phoneRegex, 'user.errors.phone').required('user.errors.required.phone'),
    }),
    errorsApi: {}
  }),
  created() {
    const userId = this.$route.params.id;
    const action = getFilePerEndpoint(this.getEndpointLabel, "user");
    action.getUser(userId, this.$apollo).then((user) => {
      this.$data.user = {
        id: user.id,
        email: user.email,
        lastname: user.lastname,
        firstname: user.firstname,
        phone: user.phone,
        roles: user.roles.length > 0 ? user.roles : [ROLE_USER],
        homes: user.homes,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
      this.$data.loading = false;
    });
  },
  methods: {
    ...mapMutations(["addFlashMessage"]),
    onSubmit(values) {
      if (!values.errors) {
        const action = getFilePerEndpoint(this.getEndpointLabel, "user");
        action.editUser(values, this.$apollo)
          .then(() => {
            this.addFlashMessage({type: "success", message: "Succès lors de la modification de l'utilisateur"});
            this.$router.push({name: 'back_user'});
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
