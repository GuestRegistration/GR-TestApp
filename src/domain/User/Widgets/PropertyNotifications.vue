<template>
    <div>
        <v-row justify="end">
            <v-col cols="12" sm="6">
                <property-switch @change="getPropertyNotifications" />
            </v-col>
        </v-row>
        <data-container :loading="loading">
            <template v-slot:loading>
                <v-skeleton-loader
                    v-for="i in 6" :key=i
                    type="card"
                    height="100"
                    class="my-2"
                ></v-skeleton-loader>
            </template>
            <template v-if="notifications.length">
                <property-notification  v-for="notification in notifications" :notification="notification" :key="notification.id" class="my-2" />
            </template>
            <div v-else class="text-center py-5">
                <p class="grey--text text-center">No notification yet</p>
            </div>
        </data-container>
    </div>
    
</template>
<script>
import DataContainer from '../../../components/DataContainer.vue';
import PropertySwitch from '../../Property/Components/PropertySwitch';
import PropertyNotification from '../../Property/Components/PropertyNotification';
import GET_PROPERTY_NOTIFICATIONS from '../../Property/Queries/getPropertyNotifications';

export default {
    name: 'PropertyNotifications',
    components: {
        PropertyNotification,
        DataContainer,
        PropertySwitch
    },
    data(){
        return {
            loading: false,
            notifications: []
        }
    }, 
    methods:{
        getPropertyNotifications(){
            this.loading = true;

            this.$store.dispatch('query', {
                query: GET_PROPERTY_NOTIFICATIONS,
                variables: {
                    id: this.$store.getters.current_user.property.id
                }
            }).then(response => {
                this.notifications = response.data.getPropertyNotifications ? response.data.getPropertyNotifications : [];
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => {
                        return new Promise((resolve) => {
                            this.getPropertyNotifications()
                            resolve();
                        })
                    },
                    message: `Couldn't get notifications`,
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },
    },

    mounted(){
        this.getPropertyNotifications();
    },

}
</script>