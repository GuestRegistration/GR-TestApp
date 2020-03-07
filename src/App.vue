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
      <v-toolbar-title>Guest Registration</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text dark @click="signUserOut" v-if="current_user.auth !== null">Sign out</v-btn>
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

import {mapActions, mapState, mapMutations} from 'vuex'
import firebase from './firebase'
export default {
  name: 'App',
  data(){
    return{
      site: "http://guestregistration.co",
      drawer: false,
      signed_in: false
    }
  },

  computed:{
    ...mapState([
      'current_user'
    ])
  },

  //when the component is created
    created(){
        if(firebase.auth.currentUser){
             this.setUser(firebase.auth.currentUser)  
        }
      firebase.auth.onAuthStateChanged((user) => {
        if (user) {
            this.setUser(user)  
        }else{
          this.UNSET_CURRENT_USER
        }
      });
    },
    methods:{
      ...mapActions([
          'signout',
          'getUserByID'
      ]),
      ...mapMutations([
        'SET_CURRENT_USER',
        'UNSET_CURRENT_USER'
      ]),

      setUser(user){
        this.getUserByID(user.uid)
              .then(response => {
                if(response.data.getUserByID !== null){ 
                    this.SET_CURRENT_USER({
                      auth: firebase.auth.currentUser,
                      profile: response.data.getUserByID
                    })
                }
            })
      },

      signUserOut(){
        this.signout()
        .then(() => {
          window.localStorage.removeItem('gr-user')
          console.log('user loged out')
          this.$router.go({path: '/'})
           this.UNSET_CURRENT_USER
            alert("signed out");
        })
      }
    }

}
</script>
