<template>
  <div>
    <Navigation/>
    <div class="wrapper">
      <Sidebar v-if="isAuthenticated"/>
      <transition name="fade">
        <div v-if="hasFlashMessages">
          <div v-for="(message, index) in getFlashMessages" :key="index">
            <v-alert class="flash" :type="message.type" dismissible>
              {{ message.message }}
            </v-alert>
          </div>
        </div>
      </transition>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "@/layout/Navigation";
import Sidebar from "@/layout/Sidebar";
import { mapMutations, mapGetters } from "vuex";

export default {
  components: {
    Navigation,
    Sidebar,
  },
  computed: {
    ...mapGetters([
      "getUser",
      "isAuthenticated",
      "isAdmin",
      "isRenter",
      "getFlashMessages",
      "hasFlashMessages",
    ]),
  },
  created () {
    if (this.hasFlashMessages) {
      setTimeout(() => {
        this.clearFlashMessage();
      }, 3000);
    }
  },
  updated () {
    if (this.hasFlashMessages) {
      setTimeout(() => {
        this.clearFlashMessage();
      }, 3000);
    }
  },
  methods: {
    ...mapMutations(["switchEndpoint", "signOut", "clearFlashMessage"]),
  },
  name: "BackLayout",
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.getters.isAuthenticated) {
        vm.$router.push({ name: "front_signin" });
      }
    });
  },
};

</script>

<style scoped>
.wrapper {
  display: flex;
  width: 100%;
  align-items: stretch;
}

.content {
  width: 100%;
  padding-top: 5rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
