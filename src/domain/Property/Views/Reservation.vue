<template>
    <app-layer ref="app">
        <data-container :loading="loading">
            
            <template v-slot:loading>
                <reservation-skeleton />
            </template>
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
                    <v-col cols="12" md="4">
                        <div class="text-center">
                            <router-link :to="{name: 'property.show', params: { id: property.id} }" class="text-decoration-none">
                                <v-avatar v-if="property" color="primary" size="150">
                                    <v-img
                                    v-if="property.image"
                                    :src="property.image"
                                    ></v-img>
                                    <v-img v-else
                                        src="@/assets/img/default-property.jpg"
                                    ></v-img>
                                </v-avatar>
                                <h2>{{property.name}}</h2>
                                <p class="grey--text">{{property.address}}</p>
                            </router-link>
                        </div>
                    </v-col>
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
                            
                            <v-btn color="primary" @click="$refs.reservationCheckin.open()" >View checkin info</v-btn>

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

                        <v-card class="my-5" outlined>
                            <v-card-text>
                                <h2>Charges</h2>
                                <reservation-charges :reservation="reservation" :refresh="refreshCharges">

                                    <template v-slot:options="prop">
                                        <reservation-charge-refund v-bind="prop" @refunded="refreshCharges = true" />
                                        <reservation-charge-capture v-bind="prop" @captured="refreshCharges = true" />
                                    </template>
                                </reservation-charges>
                            </v-card-text>
                        </v-card>
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
import ReservationSkeleton from '../../Reservation/Components/ReservationSkeleton';
import ReservationDetails from '../../Reservation/Components/ReservationDetails';
import ReservationCheckin from '../../Reservation/Components/ReservationCheckin';
import ReservationCharges from '../../Reservation/Components/ReservationCharges';
import ReservationFormDialog from '../../Reservation/Components/ReservationFormDialog.vue';
import ReservationChargeCapture from '../../Reservation/Components/ReservationChargeCapture';
import ReservationChargeRefund from '../../Reservation/Components/ReservationChargeRefund';

import GET_RESERVATION from '../../Reservation/Queries/getReservation';

export default {
  name: 'reservation',
  components: {
    AppLayer, DataContainer, ReservationSkeleton,
    ReservationDetails, ReservationCheckin,
    ReservationFormDialog, ReservationCharges,
    ReservationChargeCapture, ReservationChargeRefund
  }, 
  data(){
      return {
        loading: false,
        reservation: null,
        checkin: null,
        refreshCharges: false,
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

        property(){
            return this.reservation.property;
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
