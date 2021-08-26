<template>
  <router-view></router-view>
</template>

<script>
//protect all children routs
//access only if user is renter or admin
export default {
  name: 'RenterLayout',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.getters.isRenter && !vm.$store.getters.isAdmin) {
        vm.$router.push({ name: "back_dashboard" });
      }
    });
  },
}
</script>
