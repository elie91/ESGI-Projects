<template>
  <router-view></router-view>
</template>

<script>
//protect all children routs
//access only if user is admin
export default {
  name: 'AdminLayout',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.getters.isAdmin) {
        vm.$router.push({ name: "back_dashboard" });
      }
    });
  },
}
</script>
