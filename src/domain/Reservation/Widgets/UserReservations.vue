<template>
    <data-container :loading="loading">
        <template v-slot:loading>
            <v-row>
                <v-col cols="12" sm="6" md="4" v-for="i in 6" :key="i">
                    <reservation-card-skeleton class="ma-2" />
                </v-col>
            </v-row>
        </template>
        <v-row v-if="reservations.length">
            <v-col v-for="reservation in reservations"  :key="reservation.id"
            cols="12" sm="6" md="4">
                <user-reservation :_reservation="reservation" class="my-2" />
            </v-col>
        </v-row>
        <div v-else class="py-5">
            <p class="grey--text text-center">No reservation yet</p>
        </div>
    </data-container>
</template>

<script>
import DataContainer from '../../../components/DataContainer';
import UserReservation from '../Components/Reservation';
import ReservationCardSkeleton from '../Components/ReservationCardSkeleton';

import GET_USER_RESERVATIONS from '../Queries/getUserReservations';

export default {
    name: "UserReservations",
    components: {
        DataContainer, UserReservation, 
        ReservationCardSkeleton
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
                    retry: () => this.getUserReservations(),
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