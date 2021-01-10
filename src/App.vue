<template>
  <!-- App.vue -->
  <v-app>
    <nav-drawer v-if="authenticated && app_ready" @signout="signUserOut" />
    
    <v-app-bar 
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="$store.state.navDrawer = !$store.state.navDrawer" v-if="authenticated  && app_ready"></v-app-bar-nav-icon>
      <router-link to="/" class="white--text" style="text-decoration: none">
        <v-toolbar-title dark>Guest Registration</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn text dark @click="signUserOut" v-if="authenticated">Sign out</v-btn>
    </v-app-bar>
    <!-- Sizes your content based upon application components -->
    <v-main>
          <router-view></router-view>
    </v-main>

    <v-footer app>
      <small><a :href="site">2020. Guest Registration</a></small>
    </v-footer>
  </v-app>
</template>

<script>

import {mapActions, mapState, mapMutations, mapGetters} from 'vuex'
import firebase from '@/firebase';
import NavDrawer from '@/components/NavDrawer.vue';


export default {
  name: 'App',
  components: {
    NavDrawer
  },
  data(){
    return{
      site: "http://guestregistration.co",
    }
  },

  computed:{
    ...mapGetters([
      'app_ready',
      'authenticated',
    ]),
  },

  mounted(){
      
  },

    methods:{
      ...mapActions([
          'signout',
          'query',
          'mutate'
      ]),
      ...mapMutations([
        'TOAST_ERROR',
        'SET_APP_STATE',
        'UNSET_CURRENT_USER'
      ]),

      signUserOut(){
        this.SET_APP_STATE(false, 'signing out...');
        
        this.signout()
        .then(() => {
            this.UNSET_CURRENT_USER;
            this.$router.push({
              name: 'signin'
            });
            this.SET_APP_STATE(true);
        })
      }
    }

}
</script>
