<template>
    <!-- <v-navigation-drawer 
      app 
      v-model="$store.state.navDrawer"
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
                <v-list-item-subtitle class="mt-1"><small>Not signed in</small></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>

      <v-list nav> 
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
            <v-btn block dark class="red" v-if="authenticated" @click="$emit('signout')">Signout</v-btn>
            <router-link to="/signin"  v-else>
                <v-btn block dark class="primary my-5" text>Signin</v-btn>
            </router-link>
        </div>
      </template>
    </v-navigation-drawer> -->

    <v-navigation-drawer 
      app 
      v-model="$store.state.navDrawer"
      >
      <template v-slot:prepend>
        <template v-if="profile_loaded">
          <v-list-item >
            <v-list-item-avatar>
              <v-avatar color="primary" size="40" class="mr-2">
                  <span class="white--text headline">{{current_user.profile.name.first_name.substring(0,1)}}</span>
                </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="`${current_user.profile.name.first_name} ${current_user.profile.name.last_name}`"></v-list-item-title>
              <v-list-item-subtitle v-html="current_user.profile.email"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-else>
        <v-list-item >
          <v-list-item-content>
            <v-list-item-title v-html="`Set up profile`"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        </template>
        <v-divider></v-divider>
      </template>

      <v-list dense>
        <v-list-item-group v-model="GuestCurrentNav" >
          <template v-for="(item, i) in GuestNavItems">
            <component :key="i" :is="`${item.router ? 'router-link' : 'a'}`" :to="{name: item.route.name, params: item.route.params}" v-if="item.render" class="no-underline-nav-link"  >
              <v-list-item color="primary" >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </component>
          <v-list-item v-else disabled :key="i">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>

      <v-divider v-if="current_user.profile.properties && current_user.profile.properties.length" class="my-2"></v-divider>

      <v-list v-if="current_user.profile.properties && current_user.profile.properties.length" dense>
        <v-subheader>HOST</v-subheader>
        <v-list-item color="primary" >
          <v-list-item-content>
            <v-select
              class="mx-2"
              :items="propertiesSwitch"
              item-text="name"
              item-value="id"
              dense
              :value="current_user.property.id"
              @change="switchProperty"
            ></v-select>
          </v-list-item-content>
        </v-list-item>

        <v-list-item-group v-model="HostCurrentNav" >
          <template v-for="(item, i) in HostNavItems">
            <component :key="i" :is="`${item.router ? 'router-link' : 'a'}`" :to="{name: item.route.name, params: item.route.params}" v-if="item.render" class="no-underline-nav-link"  >
              <v-list-item color="primary" >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </component>
          <v-list-item v-else disabled :key="i">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>


      <template v-slot:append>
        <div class="pa-2">
            <v-btn block dark class="red" v-if="authenticated" @click="$emit('signout')">Signout</v-btn>
            <v-btn v-else block dark class="primary"  @click="$router.push({name: 'signin'})">Signin</v-btn>
        </div>
      </template>
    </v-navigation-drawer>


</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
    name: "NavDrawer",
    data(){
        return {
            HostCurrentNav: null,
            GuestCurrentNav: null
        }
    },
    computed:{
    ...mapGetters([
      'current_user',
      'authenticated',
      'profile_loaded',
    ]),
    propertiesSwitch(){
      return this.profile_loaded && this.current_user.profile.properties ? 
             this.current_user.profile.properties : []
    },
    GuestNavItems(){
      return [
        { 
          title: 'Home', 
          icon: 'mdi-home', 
          route: {
            name: 'home'
          },
          render: true,
          router: true,
        },
        { 
          title: 'Account', 
          icon: 'mdi-account', 
          route: {
            name: 'account'
          },
          render: true,
          router: true,
        },
        { 
          title: 'Notifications', 
          icon: 'mdi-bell', 
          route: {
            name: 'notification.list'
          },
          render: true,
          router: true,
        },
        { 
          title: 'Trips', 
          icon: 'mdi-clock', 
          route: {
            name: 'reservation.list'
          },
          render: true,
          router: true,
        },
        
        { 
          title: 'Properties', 
          icon: 'mdi-domain', 
          route: {
            name: 'property.list'
          },
          render: true,
          router: true,
        },
       
      ]
    },

    HostNavItems(){
      return [
        { 
          title: 'Reservations', 
          icon: 'mdi-clock', 
          route: {
            name: 'property.reservation.list'
          },
          render: true,
          router: true,
        },
        { 
          title: 'Notifications', 
          icon: 'mdi-bell', 
          route: {
            name: 'property.notifications'
          },
          render: true,
          router: true,
        },
      ]
    }
  },

  methods: {
    ...mapMutations([
      'SET_ACTIVE_PROPERTY'
    ]),

    switchProperty(property){
      this.SET_ACTIVE_PROPERTY(this.current_user.profile.properties.find(p => p.id == property));
      this.$eventHub.$emit('property-switched');
    }
  },

  mounted(){
    this.HostCurrentNav = this.HostNavItems.findIndex(nav => nav.route.name == this.$router.currentRoute.name);
    this.GuestCurrentNav = this.GuestNavItems.findIndex(nav => nav.route.name == this.$router.currentRoute.name);
  }
}
</script>

<style scoped>
  .no-underline-nav-link{
    text-decoration: none !important;
  }
</style>