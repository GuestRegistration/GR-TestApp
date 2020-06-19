<template>
  <!-- App.vue -->
  <v-app>
    <v-navigation-drawer 
      app 
      v-model="drawer"
      v-if="auth"
      > 
        <template v-slot:prepend>
          <template  v-if="app_ready && auth">
            
            <v-list-item two-line>
              <!-- <v-list-item-avatar>
                <img src="https://randomuser.me/api/portraits/women/81.jpg">
              </v-list-item-avatar> -->
              <v-list-item-content v-if="app_ready && current_user.profile !== null">
                <v-list-item-title>{{current_user.profile.name.first_name}} {{current_user.profile.name.last_name}}</v-list-item-title>
                <v-list-item-subtitle>{{current_user.profile.email}}</v-list-item-subtitle>
                <v-list-item-subtitle class="mt-1"><small>signed in</small></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template  v-else>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Guest</v-list-item-title>
                <v-list-item-subtitle class="mt-1"><small>not signed in</small></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>

        </template>
        <v-list shaped>
          <v-list-item-group v-model="item" color="primary">
            <router-link  v-for="(item, i) in items"
              :key="i" :to="item.link"
              style="text-decoration: none">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </router-link>
          </v-list-item-group>
        </v-list>

        <template v-slot:append>
        <div class="pa-2">
            <v-btn block dark class="red" v-if="auth" @click="signout">Signout</v-btn>
            <router-link to="/signin"  v-else>
                <v-btn block dark class="primary my-5" text>Signin</v-btn>
            </router-link>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar 
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="auth"></v-app-bar-nav-icon>
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
      drawer: false,
      site: "http://guestregistration.co",
       item: 1,
      items: [
        { text: 'Trips', icon: 'mdi-clock', link: '/' },
        { text: 'Profile', icon: 'mdi-account', link: '/profile' },
        // { text: 'IDs', icon: 'mdi-flag', link: '/identities' },
      ],
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
                this.signout().then(() => {
                  window.localStorage.removeItem('gr-user')
                  r(null)
                })
            })
          }
        })
        .then(response => {
            if(response){ 
              this.SET_CURRENT_USER({
                auth: firebase.auth.currentUser,
                profile: response.data.getUserByID
              })
            }
        })
        .catch(e => {
          console.log(e)
          this.signUserOut()
        })
        .finally(()=>{
            this.SET_APP_STATE(true)
        })
      },

      signUserOut(){
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
