<template>
  <!-- App.vue -->
  <v-app>
    <v-navigation-drawer 
      app 
      v-model="drawer"
      v-if="authenticated"
      > 
    
        <template v-slot:prepend>
          <template  v-if="profile_loaded">
            <v-list-item two-line>
              
              <v-avatar color="primary" size="40" class="mr-2">
                <span class="white--text headline">{{current_user.profile.name.first_name.substring(0,1)}}</span>
              </v-avatar>
              
              <v-list-item-content>
                <v-list-item-title>{{current_user.profile.name.first_name}} {{current_user.profile.name.last_name}}</v-list-item-title>
                <v-list-item-subtitle>{{current_user.profile.email}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template  v-else>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Guest</v-list-item-title>
                <v-list-item-subtitle class="mt-1"><small>tot signed in</small></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>

      <v-list>
        <v-list-item-group v-model="current" >
          <router-link :to="{name: item.route.name, params: item.route.params}"  class="prevent-default" v-for="(item, i) in navItems"
            :key="i" style="text-decoration: none">
            <v-list-item color="primary">
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
            <v-btn block dark class="red" v-if="authenticated" @click="signout">Signout</v-btn>
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
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="authenticated"></v-app-bar-nav-icon>
      <router-link to="/" class="white--text" style="text-decoration: none">
        <v-toolbar-title dark>Guest Registration</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn text dark @click="signUserOut" v-if="authenticated">Sign out</v-btn>
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
import firebase from './firebase';
import GET_USER_BY_ID from './graphql/query/get_user_by_id';

export default {
  name: 'App',
  data(){
    return{
      auth: false,
      drawer: false,
      site: "http://guestregistration.co",
      current: 0,
    }
  },

  computed:{
    ...mapGetters([
      'current_user',
      'authenticated',
      'profile_loaded',
    ]),
    navItems(){
      return [
        { 
          text: 'Trips', 
          icon: 'mdi-clock', 
          route: {
            name: 'home'
          }
        },
        { 
          text: 'Profile', 
          icon: 'mdi-account', 
          route: {
            name: 'profile'
          } 
        },
      ]
    }
  },

  mounted(){
    this.current = this.navItems.findIndex(nav => nav.route.name == this.$router.currentRoute.name);
    
      firebase.auth.onAuthStateChanged((user) => {
        this.setUser();
      });
  },

    methods:{
      ...mapActions([
          'getIdToken',
          'signout',
          'query'
      ]),
      ...mapMutations([
        'TOAST_ERROR',
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
               return this.query({
                 query: GET_USER_BY_ID,
                 variables: {
                   id: user.uid
                 }
               }); 
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
            if(response.data.getUserByID){ 
              this.SET_CURRENT_USER({
                auth: firebase.auth.currentUser,
                profile: response.data.getUserByID || {}
              })
            }else if(this.$router.currentRoute.name !== 'profile'){
              this.$router.push({
                name:'profile',
                query: this.$route.query
              })
            }
            this.SET_APP_STATE(true);
        })
        .catch(e => {
          this.TOAST_ERROR({
            message: 'Authentication error.',
            retry: () => {
              return new Promise((resolve, reject) => {
                this.setUser();
                resolve();
              })
            },
            exception: e
          });
          this.SET_APP_STATE(true);
        })
      },

      signUserOut(){
        this.signout()
        .then(() => {
            this.UNSET_CURRENT_USER;
            this.auth = false;
            this.SET_APP_STATE(true)
            this.$router.push({
              name: 'signin'
            })
        })
      }
    }

}
</script>
