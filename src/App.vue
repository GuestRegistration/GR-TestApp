<template>
  <!-- App.vue -->
  <v-app>
    <nav-drawer v-if="authenticated && app_ready && app_layout === 'full'" @signout="signUserOut" />
    <v-app-bar 
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="$store.state.navDrawer = !$store.state.navDrawer" v-if="authenticated  && app_ready && app_layout === 'full'"></v-app-bar-nav-icon>
      <router-link to="/" class="white--text" style="text-decoration: none">
        <v-toolbar-title dark>Guest Registration</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main v-if="app_ready">
          <router-view></router-view>
    </v-main>
    
    <v-main v-else>
      <div  class="d-flex justify-center align-center">
          <div class="text-center" style="margin-top: 200px">
            <img src="@/assets/img/spinner2.gif" width="100px" />
          </div>
      </div>
      <div class="text-center">
          <p>{{app_process}}</p>
      </div>
    </v-main>

    
    <v-snackbar v-if="app_layout === 'full'" top right :value="updateExists" :timeout="-1" color="primary">
      <div class="d-flex align-center">
          <div>
              An update is available
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="refreshApp">
              Update
          </v-btn>
      </div>
    </v-snackbar>

    <v-footer app>
      <small><a :href="site">2020. Guest Registration</a></small>
    </v-footer>
  </v-app>

</template>

<script>

import {mapActions, mapMutations, mapGetters} from 'vuex'
import CryptoJS from 'crypto-js';
import NavDrawer from '@/components/NavDrawer.vue';
import { fb,auth } from './firebase';
import helper from '@/helper';
import update from './mixins/update';
import config from './config'
import GET_USER_BY_ID from './domain/User/Queries/getUserByID';
import UPDATE_USER_DEVICE from './domain/User/Mutations/updateUserDevice';

export default {
  name: 'App',
  mixins: [update],
  components: {
    NavDrawer
  },
  data(){
    return{
      site: "http://guestregistration.com",
    }
  },

  computed:{
    ...mapGetters([
      'app_ready',
      'app_process',
      'authenticated',
      'profile_loaded',
      'app_layout',
      'current_user'
    ]),
  },

    methods:{
      ...mapActions([
          'getIdToken',
          'signout',
          'query',
          'mutate'
      ]),
      ...mapMutations([
          'TOAST_ERROR',
          'SET_APP_STATE',
          'SET_USER_AUTH',
          'SET_USER_PROFILE',
          'SET_ACTIVE_PROPERTY',
          'SNACKBAR',
          'UNSET_CURRENT_USER',
          'SET_APP_LAYOUT'
      ]),

      setUser(){
          this.SET_APP_STATE(false);
          if( window.localStorage.getItem('gr-user') 
              && auth.currentUser 
              && window.localStorage.getItem('token-expires') > helper.nowTimestamp()
              && this.profile_loaded
          )
          {
              this.SET_APP_STATE(true);
              return;
          }
          else if(!auth.currentUser){
            this.signout().then(() => {
              this.SET_APP_STATE(true);
            })
            return;
          }
          
          this.getIdToken()
          .then(user =>  {
          if(user){
                this.SET_USER_AUTH(auth.currentUser);
                return this.query({
                        query: GET_USER_BY_ID,
                        variables: {
                            id: user.uid
                        }
                }); 
              }
              return Promise.resolve(null)
          })
          .then(response => {
              if(response && response.data.getUserByID){ 
                this.SET_USER_PROFILE(response.data.getUserByID || {})
                this.SET_ACTIVE_PROPERTY(response.data.getUserByID && response.data.getUserByID.properties ? response.data.getUserByID.properties[0] : {});

                if ('Notification' in window) {
                  if(Notification.permission === "granted"){
                    this.getNotificationToken();
                  }else{
                      Notification.requestPermission().then(permission => {
                          if (permission === "granted") {
                            new Notification("Hello! We can now send you notification here");
                            this.getNotificationToken();
                          }
                      });
                  }
                }
                
                this.SET_APP_STATE(true);
              }
              else if(auth.currentUser){
                this.$router.push({
                    name: 'account',
                    query: {
                      redirect: this.$router.currentRoute.path
                    }
                })
                this.SET_APP_STATE(true);
              }else{
                this.signUserOut()
              }
          })
          .catch(e => {
              this.TOAST_ERROR({
                  show: true,
                  message: 'Authentication error.',
                  retry: () => this.setUser(),
                  exception: e
              });
          })
          .finally(() => {
              this.bootIntercom();
          })
      },
      

      getNotificationToken(){
        if(fb.messaging.isSupported()){
          const messaging = fb.messaging();
          messaging.getToken({vapidKey: config.firebase.VapidKey}).then((currentToken) => {
          if(currentToken) {                  
              this.mutate({
                  mutation: UPDATE_USER_DEVICE,
                  variables: {
                      device_id: navigator.userAgent,
                      notification_token: currentToken
                  }
              })
              } 
          });
          messaging.onMessage((payload) => {
              new Notification(payload.notification.title, {
                  body: payload.notification.body,
                  icon: payload.notification.icon,
              });
          });
        }
      },

      bootIntercom() {
        if(config.intercom.app_id && auth.currentUser && this.profile_loaded){
          this.$intercom.boot({
            user_id: auth.currentUser.uid,
            name: [this.current_user.profile.name.first_name, this.current_user.profile.name.last_name].join(' '),
            email: this.current_user.profile.email,
            user_hash: CryptoJS.HmacSHA256(auth.currentUser.uid, config.intercom.secret_key).toString(),
            hide_default_launcher: false
          })
        }
      },

      signUserOut(){  
        this.signout()
        .then(() => {
            if(this.$route.name !== 'signin'){
              this.$router.push({
                name: 'signin'
              });
            }
            this.SET_APP_STATE(true);
        })
      },

      
    },

    mounted(){
      // console.log(config);
      auth.onAuthStateChanged((user) => {
        this.setUser();
      });
    },
}
</script>

<style>
  .required label::after {
    content: "*";
  }
</style>
