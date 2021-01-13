<template>
    <app-layer ref="app">
        <div class="notifications">    
          <v-container>
              <v-row justify="center">
                  <v-col cols="12" sm="8" md="6">
                    <v-tabs v-if="hasAnyProperty" v-model="currentTab" @change="tabChanged" align-with-title>
                        <v-tabs-slider color="primary"></v-tabs-slider>
                        <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
                    </v-tabs>

                    <template  v-if="tabs[currentTab] == 'personal'">
                        <template v-if="notifications.length">
                            <user-notification  v-for="notification in notifications" :notification="notification" :key="notification.id" class="my-2" />
                        </template>
                        <div v-else class="text-center py-5">
                            <p class="grey--text">No notification yet</p>
                        </div>
                    </template>

                    <template  v-if="tabs[currentTab] == 'property'">
                        <div class="my-5">
                            <property-switch @change="getPropertyNotifications" />
                        </div>
                        <template v-if="notifications.length">
                            <property-notification  v-for="notification in notifications" :notification="notification" :key="notification.id" class="my-2" />
                        </template>
                        <div v-else class="text-center py-5">
                            <p class="grey--text">No notification</p>
                        </div>
                    </template>
                      
                  </v-col>
              </v-row>
          </v-container>
        </div>
    </app-layer>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'

import AppLayer from '@/AppLayer';
import UserNotification from '../Components/UserNotification';
import PropertyNotification from '../../Property/Components/PropertyNotification';
import PropertySwitch from '../../Property/Components/PropertySwitch';
import GET_USER_NOTIFICATIONS from '../Queries/getUserNotifications';
import GET_PROPERTY_NOTIFICATIONS from '../../Property/Queries/getPropertyNotifications';

export default {
  name: 'Notifications',
  components: {
      AppLayer, PropertySwitch,
      UserNotification, PropertyNotification
  }, 
  data(){
      return {
          tabs: ['personal', 'property'],
          currentTab: 0,
          notifications: []
      }
  },

    computed:{
        ...mapGetters([
            'app_ready',
            'authenticated',
            'current_user',
        ]),
        hasAnyProperty(){
            return this.current_user.profile.properties && this.current_user.profile.properties.length
        }
    },

    methods:{
      ...mapActions([
          'query',
          'mutate',
        ]),

        tabChanged(){
            if(this.tabs[this.currentTab]== 'personal'){
                this.getUserNotifications();
            }

            else if(this.tabs[this.currentTab] == 'property'){
                this.getPropertyNotifications();
            }
        },

        getUserNotifications(){
            this.$refs.app.setState(false, "Getting your notifications");
            this.query({
                query: GET_USER_NOTIFICATIONS,
            })
            .then(response => {
                this.notifications = response.data.getUserNotifications;
            })
            .catch(e => {
                this.$refs.app.toastError({
                    message: `Could not get notifications.`,
                    retry: () => {
                        this.getUserNotifications()
                    },
                    exception: e
                });
            })
            .finally(() => {
                this.$refs.app.setState(true);
            })
        },

        getPropertyNotifications(){
            this.$refs.app.setState(false, `Getting notifications in ${this.current_user.property.name}... `);
            this.query({
                query: GET_PROPERTY_NOTIFICATIONS,
                variables: {
                    id: this.current_user.property.id
                }
            })
            .then(response => {
                this.notifications = response.data.getPropertyNotifications;
            })
            .catch(e => {
                this.$refs.app.toastError({
                    message: `Could not get notifications.`,
                    retry: () => {
                        this.getPropertyNotifications()
                    },
                    exception: e
                });
            })
            .finally(() => {
                this.$refs.app.setState(true);
            })
        },

    },
    mounted(){
        this.getUserNotifications();
    },


}
</script>
