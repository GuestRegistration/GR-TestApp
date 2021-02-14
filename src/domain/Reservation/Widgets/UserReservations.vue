<template>
    <data-container :loading="loading">
        <template v-if="reservations.length">
            <user-reservation  v-for="reservation in reservations" :_reservation="reservation" :key="reservation.id" class="my-2" />
        </template>
        <template v-else>
            <div class="text-center py-5">
                <p class="grey--text">No reservation yet</p>
            </div>
        </template>
    </data-container>
</template>

<script>
import DataContainer from '../../../components/DataContainer';
import UserReservation from '../Components/Reservation';

import GET_USER_RESERVATIONS from '../Queries/getUserReservations';

export default {
    name: "UserReservations",
    components: {
        DataContainer, UserReservation
    },
    data(){ 
        return {
            loading: false,
            reservations: []
        }
    },
    methods: {
        getUserReservations(){
            this.loading = true;

            this.$store.dispatch('query', {
                query: GET_USER_RESERVATIONS
            })
            .then(response => {
                this.reservations = response.data.getUserReservations ? response.data.getUserReservations : []
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => {
                        return new Promise((resolve) => {
                            this.getUserReservations()
                            resolve();
                        })
                    },
                    message: `Couldn't get reservations`,
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },
    },

    mounted(){
        this.getUserReservations();
    },
}
</script>