<template>
    <app-layer ref="app">
         <template #header>
            <h3>Notifications</h3>
        </template>
         <v-tabs v-if="hasAnyProperty" v-model="currentTab" @change="tabChanged" align-with-title>
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab v-for="tab in tabs" :key="tab.name">
                {{ tab.name }}
            </v-tab>
        </v-tabs>

        <component :is="`${notification}-notifications`"></component>
    </app-layer>
</template>

<script>
import AppLayer from '@/AppLayer';
import PersonalNotifications from '../Widgets/UserNotifications.vue';
import PropertyNotifications from '../Widgets/PropertyNotifications.vue';

export default {
    name: 'Notifications',
    components: {
        AppLayer, PersonalNotifications, PropertyNotifications
    }, 
    
    data(){
      return {
          tabs: [
              {
                  name: 'Personal',
                  alias: 'personal',
                  route: {name: 'notification.list', params: {notification: 'personal'}}
              },
              {
                  name: 'Property',
                  alias: 'property',
                  route: {name: 'notification.list', params: {notification: 'property'}}
              }
          ],
      }
    },

    computed:{
        hasAnyProperty(){
            return this.$store.getters.current_user.profile.properties && this.$store.getters.current_user.profile.properties.length
        },

        notification(){
            return this.$route.params.notification ?  this.$route.params.notification  : 'personal';
        },

        currentTab: {
            get: function(){
                return this.tabs.findIndex(t => t.alias == this.notification)
            },
            set: function(tab){}
        }

    },

    methods: {
        tabChanged(tab){
            this.$router.push(this.tabs[tab].route)
        }
    }

   
}
</script>
