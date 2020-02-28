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
      <v-btn text dark @click="signUserOut" v-if="current_user !== null">Sign out</v-btn>
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

import {mapActions, mapState} from 'vuex'

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

    },
    methods:{
      ...mapActions([
          'signout'
      ]),
      signUserOut(){
        this.signout()
        .then(() => {
            alert("signed out");
            this.$route.go({path: '/'})
        })
      }
    }

}
</script>
