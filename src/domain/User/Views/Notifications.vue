<template>
    <app-layer ref="app">
        <div class="notifications">    
          <v-container>
              <v-row justify="center">
                  <v-col cols="12" sm="8" md="6">
                      <template v-if="notifications.length">
                            <h3>Notifications</h3>
                            <user-notification  v-for="notification in notifications" :notification="notification" :key="notification.id" class="my-2" />
                      </template>
                      <template v-else>
                        <div class="text-center">
                            <p class="grey--text">No notification yet</p>
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

import GET_USER_NOTIFICATIONS from '../Queries/getUserNotifications';

export default {
  name: 'UserNotifications',
  components: {
      AppLayer, UserNotification
  }, 
  data(){
      return {
          notifications: []
      }
  },

    computed:{
        ...mapGetters([
            'app_ready',
            'authenticated',
            'current_user',
        ]),
    },
  mounted(){
        this.getUserNotifications();
    },
  methods:{
      ...mapActions([
          'query',
          'mutate',
      ]),

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

  },

}
</script>
