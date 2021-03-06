<template>
    <div>
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <property-switch @change="getPropertyReservations" />
            </v-col>
        </v-row>
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
                    <property-reservation  :_reservation="reservation" class="my-2" />
                </v-col>
            </v-row>

            <div v-else class="py-5 text-center">
                <p class="grey--text">No reservation created in {{ $store.getters.current_user.property.name }} yet</p>
            </div>
        </data-container>

        <reservation-form-dialog ref="reservationFormDialog" @created="reservationCreated" :property="$store.getters.current_user.property" />
        <v-btn
            class="mx-2"
            fab dark bottom right fixed
            color="primary"
            @click="$refs.reservationFormDialog.open()"
        >
        <v-icon dark>
            mdi-plus
        </v-icon>
        </v-btn>
    </div>
</template>

<script>

import PropertyReservation from '../Components/PropertyReservation';
import PropertySwitch from '../../Property/Components/PropertySwitch';
import ReservationFormDialog from '../Components/ReservationFormDialog.vue';
import ReservationCardSkeleton from '../Components/ReservationCardSkeleton';
import GET_PROPERTY_RESERVATIONS from '../Queries/getPropertyReservations';
import DataContainer from '../../../components/DataContainer.vue';

export default {
    name: "PropertyReservations",
    components: {
        PropertyReservation, PropertySwitch, ReservationFormDialog,
        DataContainer, ReservationCardSkeleton
    },
    data(){
  
        return {
            loading: false,
            reservations: []
        }
    },
    methods: {
        getPropertyReservations(){
            this.loading = true;

            this.$store.dispatch('query', {
                query: GET_PROPERTY_RESERVATIONS,
                variables: {
                    id: this.$store.getters.current_user.property.id
                }
            }).then(response => {
                this.reservations = response.data.getPropertyReservations ? response.data.getPropertyReservations : []
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => this.getPropertyReservations(),
                    message: `Couldn't get reservations`,
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },

        reservationCreated(reservation){
            this.$router.push({
                name: 'property.reservation.show',
                params: {
                    id: reservation.id,
                    _reservation: reservation
                }
            })
        }
    },

    mounted(){
        this.getPropertyReservations();
    },

}
</script>