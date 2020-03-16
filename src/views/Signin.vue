<template>
  <div class="">
    <template  v-if="report">
        <Report :_message="report" @close="report = null" />
    </template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <template v-if="create_profile">
              <CompleteProfile @done="profileCompleted" @error="gotError" />
          </template>
          <template v-else>
            <Authenticate @authenticated="userAuthenticated" />
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Authenticate from '@/components/Authenticate'
import CompleteProfile from '@/components/CompleteProfile'
import Report from '@/components/Report'

import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'signin',
  components: {
    Authenticate, CompleteProfile, Report
  },
  data(){
    return {
      redirect_to: '/',
      create_profile: false,
      report: null
    }
  },
  computed: {
    ...mapState([
          'current_user'
      ]),
  },
  methods: {
    userAuthenticated(){
      alert("Hurray!")
       if(this.current_user.profile == null){ //If the user does not have a profile yet
           this.create_profile = true;
        }else{
            this.redirect()
        }
    },
    redirect(){
          this.$router.push({path: this.redirect_to})
    },
    profileCompleted(profile){
      console.log(profile)
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
