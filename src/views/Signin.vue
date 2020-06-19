<template>
  <div class="">
    <template  v-if="report">
        <Report :_message="report" @close="report = null" />
    </template>

    <template v-if="!app_ready">
        <Wait />
    </template>

    <template>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="6" md="4">
            <template v-if="current_user.auth === null && current_user.profile === null">
              <Authenticate />
            </template>
            <template v-else-if="current_user.auth && current_user.profile === null">
              <CompleteProfile  @done="profileCompleted" @error="gotError" />
            </template>
            <template v-else>
              {{redirect()}}
            </template>

          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
// @ is an alias to /src
import Authenticate from '@/components/Authenticate'
import CompleteProfile from '@/components/CompleteProfile'
import Report from '@/components/Report'
import Wait from '@/components/Wait'

import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'signin',
  components: {
    Wait,  Report, Authenticate, CompleteProfile
  },
  data(){
    return {
      redirect_to: '/',
      report: null,
    }
  },
  computed: {
    ...mapGetters([
        'phone',
        'app_ready',
        'current_user'
      ]),
  },
  methods: {
    // userAuthenticated(){
    //    this.check_profile = true;
    // },
    redirect(){
          this.$router.push({path: this.redirect_to})
    },
    profileCompleted(profile){
      this.redirect()
    },
    gotError(e){
      this.report = e
    }
  },
  mounted(){
    if(this.$route.query.redirect){
      this.redirect_to = this.$route.query.redirect
    }
  }
}
</script>
