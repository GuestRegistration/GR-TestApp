<template>
    <v-row justify="center">
        <v-col cols="12" md="10">

           <property-subscription-alert :property="property">
               Activate subscription for {{ property.name }} to add and manage reservation
           </property-subscription-alert>

            <v-card>
                <v-card-title>
                    <property-switch class="pt-10" @change="getPropertyReservations" />
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>

                <data-container :loading="loading" >
                    <template #loading>
                        <v-skeleton-loader
                            type="table"
                        >
                        </v-skeleton-loader>
                    </template>
                    <v-data-table
                        :headers="headers"
                        :items="reservations"
                        :search="search"
                        multi-sort
                    >
                        <template v-slot:item.booking_no="{ item }">
                             {{ item.booking_no ?  item.booking_no : '--' }}
                        </template>

                        <template v-slot:item.status="{ item }">
                            <v-chip v-if="item.approved"
                                color="success"
                                dark
                                small
                            >
                               checkin approved
                            </v-chip>
                            <v-chip
                                v-else-if="item.already_checkedin"
                                color="info"
                                dark
                                small
                            >
                                checked in
                            </v-chip>
                             <v-chip
                                v-else
                                color="warning"
                                dark
                                small
                            >
                                not checked in
                            </v-chip>
                        </template>

                        <template v-slot:item.actions="{ item }">
                             <v-icon
                                small
                                class="mr-2"
                                @click="$router.push({name: 'property.reservation.show', params: {id: item.id, _reservation: item}})"
                            >
                                mdi-eye
                            </v-icon>
                        </template>

                    </v-data-table>
                    <reservation-form-dialog ref="reservationFormDialog" @created="reservationCreated" :property="$store.getters.current_user.property" />
                    <v-btn
                        :disabled="!property.active"
                        class="mx-2"
                        fab dark bottom right fixed
                        color="primary"
                        @click="$refs.reservationFormDialog.open()"
                    >
                        <v-icon dark>
                            mdi-plus
                        </v-icon>
                    </v-btn>
                </data-container>
                
            </v-card>
        </v-col>
    </v-row>
</template>
<script>

import PropertySwitch from '../../Property/Components/PropertySwitch';
import ReservationFormDialog from '../Components/ReservationFormDialog.vue';
import GET_PROPERTY_RESERVATIONS from '../Queries/getPropertyReservations';
import DataContainer from '../../../components/DataContainer.vue';
import PropertySubscriptionAlert from '../../Property/Components/PropertySubscriptionAlert'

export default {
    name: "PropertyReservationsTable",
    components: {
       PropertySwitch, ReservationFormDialog,
        DataContainer, PropertySubscriptionAlert
    },
    data(){
  
        return {
            loading: false,
            search: '',
            headers: [
                { text: 'Booking No', align: 'start', value: 'booking_no' },
                { text: 'Booking Name', value: 'name' },
                { text: 'Checkin Date', value: 'checkin_date' },
                { text: 'Checkout Date', value: 'checkout_date' },
                { text: 'Status', value: 'status', sortable: false },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            reservations: []
        }
    },
    computed: {
        property(){
            return this.$store.getters.current_user.property
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