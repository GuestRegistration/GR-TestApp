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
                <v-row justify="center" align="center">
                    <v-col v-if="property" cols="12" md="4">
                        <div class="text-center">
                            <router-link :to="{name: 'property.show', params: { id: property.id} }" class="text-decoration-none">
                                <v-avatar  color="primary" size="150">
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
                        <reservation-details :reservation="reservation" />
                        
                        <template v-if="reservation.already_checkedin">
                            <v-alert 
                                border="top"
                                colored-border
                                elevation="2"
                                type="success">
                                Reservation checked in {{reservation.checkedin_at | timestamp_to_date('day mName, year. diff')}}
                            </v-alert>

                            <v-alert
                                border="top"
                                colored-border
                                elevation="2"
                                type="success" v-if="reservation.approved">
                                Reservation approved {{reservation.approved_at | timestamp_to_date('day mName, year. diff')}}
                            </v-alert>
                            <v-alert 
                                border="top"
                                colored-border
                                elevation="2"
                                type="warning" v-else>
                                Approval pending 
                            </v-alert>

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

                    <v-col v-if="reservation.already_checkedin" cols="12" md="8">
                        <h4 class="headline my-5">Checkin Information</h4>
                        <property-reservation-checkin v-if="property" @approved="reservationApproved" :reservation="reservation" :property="property" />
                    </v-col>
                </v-row>

                <reservation-form-dialog ref="reservationForm" :property="reservation.property" :reservation="reservation" @updated="reservationUpdated" />

            </template>
            
        </data-container>
    </app-layer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import AppLayer from '@/AppLayer';
import DataContainer from '../../../components/DataContainer.vue';
import ReservationSkeleton from '../../Reservation/Components/ReservationSkeleton';
import ReservationDetails from '../../Reservation/Components/ReservationDetails';
import ReservationFormDialog from '../../Reservation/Components/ReservationFormDialog.vue';
import PropertyReservationCheckin from '../../Reservation/Widgets/PropertyReservationCheckin';
import GET_RESERVATION from '../../Reservation/Queries/getReservation';

export default {
  name: 'reservation',
  components: {
    AppLayer, DataContainer, ReservationSkeleton,
    ReservationDetails,  ReservationFormDialog,
    PropertyReservationCheckin
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
                retry: () => this.getReservation(),
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
