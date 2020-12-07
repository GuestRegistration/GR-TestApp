<template>
    <app-layer ref="app">
        <div class="notifications">    
          <v-container>
              <v-row justify="center">
                  <v-col cols="12" sm="8" md="6">
                      <template v-if="notifications.length">
                            <h3>Notifications</h3>
                            <notification  v-for="notification in notifications" :notification="notification" :key="notification.id" class="my-2" />
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
import GET_USER_NOTIFICATIONS from '@/graphql/query/get_user_notifications'
import AppLayer from './../AppLayer';
import Notification from '@/components/Notification.vue'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'Notifications',
  components: {
      AppLayer, Notification
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
