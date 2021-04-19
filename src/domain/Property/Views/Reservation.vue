<template>
    <app-layer ref="app">
        <data-container :loading="loading">

            <!-- resource no longer loading but it not found -->
            <template v-if="reservation == null">
                <div class="text-center">
                    <h1>We could not find that reservation</h1>
                    <p color="grey">check that the url is valid</p>
                </div>
            </template>

            <!-- the resource is found -->
            <template v-else-if="reservation">
                <v-row justify="center">
                    <v-col cols="12" md="6">
                        <div class="d-flex justify-space-between">
                            <h2>{{ reservation.name }}</h2>
                            <v-menu origin="center center"  transition="scale-transition">
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="$refs.reservationForm.open()">
                                        <v-list-item-icon>
                                            <v-icon>mdi-pen</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Edit Reservation</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>

                        </div>
                        <small class="text--gray">{{ reservation.checkin_url }}</small>
                        <ReservationDetails :_reservation="reservation" />
                        <v-card class="my-5" outlined>
                            <v-card-text>
                                <h2>Charges</h2>
                                <reservation-charges :reservation="reservation" />
                            </v-card-text>
                        </v-card>
     
                        <template v-if="reservation.already_checkedin">
                            <v-alert 
                                border="top"
                                colored-border
                                elevation="2"
                                type="success">
                                Reservation checked in {{checkin_time}}
                            </v-alert>

                            <v-alert
                                border="top"
                                colored-border
                                elevation="2"
                                type="success" v-if="reservation.approved">
                                Reservation approved {{approved_time}}
                            </v-alert>
                            <v-alert 
                                border="top"
                                colored-border
                                elevation="2"
                                type="warning" v-else>
                                Approval pending 
                            </v-alert>
                            
                            <reservation-checkin ref="reservationCheckin" :_reservation="reservation" @approved="reservationApproved" />
                            <confirmation-dialog ref="reservationCheckinConfirmation" @confirmed="$refs.reservationCheckin.open()">
                                <div class="text-center mt-5">
                                    <p>
                                        You will be accessing the guest identity. Guest will be notified about this.
                                    </p>
                                    <h4>
                                        Do you want to continue ?
                                    </h4>
                                </div>
                            </confirmation-dialog>
                            <v-btn color="primary" @click="$refs.reservationCheckinConfirmation.open()" >View checkin info</v-btn>

                        </template>
                        <template v-else>
                            <v-alert 
                                border="top"
                                colored-border
                                elevation="2"
                                type="warning">
                                Waiting for checkin...
                            </v-alert>
                        </template>
                    </v-col>
                </v-row>

                <reservation-form-dialog ref="reservationForm" :property="reservation.property" :reservation="reservation" @updated="reservationUpdated" />

            </template>
            
        </data-container>
    </app-layer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import helper from '@/helper'

import AppLayer from '@/AppLayer';
import DataContainer from '../../../components/DataContainer.vue';
import ConfirmationDialog from '@/components/Utilities/ConfirmationDialog'
import ReservationDetails from '../../Reservation/Components/ReservationDetails';
import ReservationCheckin from '../../Reservation/Components/ReservationCheckin';
import ReservationCharges from '../../Reservation/Components/ReservationCharges';
import ReservationFormDialog from '../../Reservation/Components/ReservationFormDialog.vue';

import GET_RESERVATION from '../../Reservation/Queries/getReservation';

export default {
  name: 'reservation',
  components: {
    AppLayer, DataContainer, ConfirmationDialog,
    ReservationDetails, ReservationCheckin,
    ReservationFormDialog, ReservationCharges
  }, 
  data(){
      return {
        loading: false,
        reservation: null,
        checkin: null,
      }
  },

    computed:{
        ...mapGetters([
            'app_ready',
            'authenticated',
            'current_user',
            'profile_loaded'
        ]),

        id(){
            return this.$route.params.id
        },

         checkin_time(){
            return helper.resolveTimestamp(this.reservation.checkedin_at)
        },
        approved_time(){
            return helper.resolveTimestamp(this.reservation.approved_at)
        }
    },
  mounted(){
        this.getReservation();
    },
  methods:{
      ...mapActions([
          'query',
          'mutate',
      ]),


    getReservation(){
        this.loading = true;
        this.query({
            query: GET_RESERVATION,
            variables: {
                id: this.id
            }
        })
        .then(response => {
            this.reservation = response.data.getReservation;
        })
        .catch(e => {
            this.$refs.app.toastError({
                message: `Could not get reservation.`,
                retry: () => {
                    this.getReservation()
                },
                exception: e
            });
        })
        .finally(() => {
            this.loading = false;
        })
    },

    reservationApproved(reservation){
        this.reservation = reservation;
    },

    reservationUpdated(reservation){
        this.reservation = reservation;
        this.$refs.reservationForm.close()
    }

  },

}
</script>
