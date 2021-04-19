<template>
    <data-container :loading="loading">
        <v-row v-if="notifications.length" justify="center">
            <v-col cols="12" md="6">
                <user-notification  v-for="notification in notifications" :notification="notification" :key="notification.id" class="my-2" />
            </v-col>
        </v-row>
        <div v-else class="text-center py-5">
            <p class="grey--text">No notification yet</p>
        </div>
    </data-container>
</template>
<script>
import DataContainer from '../../../components/DataContainer.vue';
import UserNotification from '../Components/UserNotification';
import GET_USER_NOTIFICATIONS from '../Queries/getUserNotifications';

export default {
    name: "UserNotifications",
    components: {
        UserNotification, DataContainer
    },
    data(){
  
        return {
            loading: false,
            notifications: []
        }
    },
    methods: {
        getUserNotifications(){
            this.loading = true
            this.$store.dispatch('query', {
                query: GET_USER_NOTIFICATIONS,
            }).then(response => {
                this.notifications = response.data.getUserNotifications ? response.data.getUserNotifications : [];
            })
            .catch(e => {
                 this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => {
                        return new Promise((resolve) => {
                            this.getUserNotifications()
                            resolve();
                        })
                    },
                    message: `Couldn't get notifications`,
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false
            })
        },

    },
    mounted(){
        this.getUserNotifications();
    },
}
</script>