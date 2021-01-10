<template>
    <app-layer ref="app" @ready="getNotifications">
        <template #header>
            <h3>Notifications</h3>
            <p v-if="current_user.property.name">Notifications in {{ current_user.property.name }}</p>
        </template>
        <div class="notifications">    
          <v-container>
              <v-row justify="center">
                  <v-col cols="12" sm="8" md="6">
                      <template v-if="notifications.length">
                            <property-notification  v-for="notification in notifications" :notification="notification" :key="notification.id" class="my-2" />
                      </template>
                      <template v-else>
                        <div class="text-center">
                            <p class="grey--text">No notification for {{ current_user.property.name }} yet</p>
                        </div>
                     </template>
                  </v-col>
              </v-row>
          </v-container>
        </div>
    </app-layer>
</template>

<script>
import GET_PROPERTY_NOTIFICATIONS from '../Queries/getPropertyNotifications';
import AppLayer from '@/AppLayer';
import PropertyNotification from '../Components/PropertyNotification.vue';

import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'PropertyNotifications',
  components: {
      AppLayer, PropertyNotification
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
created() {
    this.$eventHub.$on('property-switched', this.getNotifications);
},
beforeDestroy() {
    this.$eventHub.$off('property-switched');
},

  methods:{
      ...mapActions([
          'query',
          'mutate',
      ]),

    getNotifications(){
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
                    this.getNotifications()
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
