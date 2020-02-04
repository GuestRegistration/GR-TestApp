<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <ComingSoon/>
  </div>
</template>

<script>
// @ is an alias to /src
import ComingSoon from '@/components/ComingSoon.vue'

export default {
  name: 'home',
  components: {
    ComingSoon
  }
}
</script>
