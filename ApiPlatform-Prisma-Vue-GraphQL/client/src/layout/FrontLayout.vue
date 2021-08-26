<template>
  <div>
    <Navigation/>
    <div class="wrapper">
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
import { mapMutations, mapGetters } from "vuex";

export default {
  components: {
    Navigation
  },
  name: "FrontLayout",
  methods: {
    ...mapMutations(["clearFlashMessage"]),
  },
  computed: {
    ...mapGetters([
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
  padding-top: 4rem;
}
</style>
