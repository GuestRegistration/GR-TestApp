<template>
    <data-container :loading="loading">
        <template v-if="reservations.length">
            <v-row>
                <v-col v-for="reservation in reservations"  :key="reservation.id"
                cols="12" sm="6" md="4">
                    <user-reservation :_reservation="reservation" class="my-2" />
                </v-col>
            </v-row>
        </template>
        <template v-else>
            <div class="py-5">
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