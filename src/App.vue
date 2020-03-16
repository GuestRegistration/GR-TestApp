<template>
  <!-- App.vue -->
  <v-app>
    <!-- <v-navigation-drawer 
    app 
    v-model="drawer"
    > 
        <template v-slot:append>
        <div class="pa-2">
            <a :href="site">
                <v-btn block dark class="primary my-5" text>Go to site</v-btn>
            </a>
            
        </div>
      </template>
    </v-navigation-drawer> -->

    <v-app-bar 
    app
    color="primary"
    dark

    >
      <router-link to="/" class="white--text" style="text-decoration: none">
        <v-toolbar-title dark>Guest Registration</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn text dark @click="signUserOut" v-if="auth">Sign out</v-btn>
    </v-app-bar>
    
    <!-- Sizes your content based upon application components -->
    <v-content>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- router view -->
          <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <small><a :href="site">2020. Guest Registration</a></small>
    </v-footer>
  </v-app>
</template>

<script>

import {mapActions, mapState, mapMutations, mapGetters} from 'vuex'
import firebase from './firebase'
export default {
  name: 'App',
  data(){
    return{
      auth: false,
      site: "http://guestregistration.co",
      drawer: false,
      signed_in: false
    }
  },

  computed:{
    ...mapGetters([
      'app_ready',
      'current_user'
    ])
  },

    mounted(){
      firebase.auth.onAuthStateChanged((user) => {
          console.log("Auth changed ", user)
            this.setUser()
      });
    },

    methods:{
      ...mapActions([
          'getIdToken',
          'signout',
          'getUserByID'
      ]),
      ...mapMutations([
        'SET_APP_STATE',
        'SET_CURRENT_USER',
        'UNSET_CURRENT_USER'
      ]),

      setUser(){
        this.SET_APP_STATE(false)
        this.getIdToken()
        .then(user =>  {
          if(user){
                this.auth = true
               return this.getUserByID(user.uid)
            }else{
              return new Promise((r,e) => {
                r(null)
            })
          }
        })
        .then(response => {
            if(response && response.data.getUserByID !== null){ 
                this.SET_CURRENT_USER({
                  auth: firebase.auth.currentUser,
                  profile: response.data.getUserByID
                })
                this.SET_APP_STATE(true)
            }
        })
        .catch(e => {
          console.log(e)
          this.signUserOut()
        })
      },

      signUserOut(){
        this.SET_APP_STATE(false)
        this.signout()
        .then(() => {
            console.log('user loged out')
            window.localStorage.removeItem('gr-user')
            this.$router.push({
              path: '/signin'
            })
            this.UNSET_CURRENT_USER
            alert("signed out");
            this.SET_APP_STATE(true)
            this.auth = false
        })
      }
    }

}
</script>
