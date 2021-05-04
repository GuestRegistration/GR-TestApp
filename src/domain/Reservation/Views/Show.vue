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
                    <p color="grey">check that the url is valid or contact your host</p>
                </div>
            </template>

            <!-- the resource is found -->
            <template v-else-if="reservation">

                <!-- if the reservation already checked in and the there is no auhenticated user, checked in reservation should no longer be accessible by the public, as user to authenticate -->
                <template v-if="reservation.already_checkedin && !current_user.auth.uid">
                    
                    <v-container>
                        <v-row justify="center">
                            <v-col xs="12" md="4">
                                    <div class="text-center">
                                        <h4>We discover that this reservation has been checked in, If it's for you, you can continue</h4>
                                    </div>
                                    <br>
                                    <div class="text-center">
                                        <router-link :to="{name: 'signin', query: {redirect: returnPath }}">
                                            <v-btn color="primary">Continue</v-btn>
                                        </router-link>
                                    </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </template>

                <!-- if the reserveation was not checked in by the cureent authenticated user -->
                <template v-else-if="reservation.already_checkedin && current_user && reservation.user_id !== current_user.auth.uid">
                        <div class="text-center">
                            <h1>This reservation is already checked in by another guest</h1>
                            <p color="grey">check the url or contact your host</p>
                        </div>
                </template>

                <template v-else>
                    <v-container>
                        <v-row justify="center">
                            <v-col cols="12" md="4" >
                                <div class="text-center">
                                    <v-avatar v-if="property" color="primary" size="150">
                                        <v-img
                                        v-if="property.image"
                                        :src="property.image"
                                        ></v-img>
                                        <v-img v-else
                                            src="@/assets/img/default-property.jpg"
                                        ></v-img>
                                    </v-avatar>
                                    <h4>{{reservation.property.name}}</h4>
                                    <p class="grey--text">{{property ? property.full_address : reservation.property.address}}</p>
                                    <div class="my-3">
                                        <router-link :to="{name: 'property.show', params: { id: reservation.property.id, _property: reservation.property} }">
                                            <v-btn color="primary">View property</v-btn>
                                        </router-link>
                                    </div>
                                    <router-link :to="{name: 'property.rules', params: {id: reservation.property.id, _property: reservation.property} }" class="text-decoration-none">
                                        Property Rules
                                    </router-link>
                                </div>
                                
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
                                        The approval of your checkin is still pending 
                                    </v-alert>
                                </template>
                            </v-col>

                            <v-col cols="12" md="6">
                                <!-- If reservation is not checked in -->
                                <template v-if="!reservation.already_checkedin">
                                    <template v-if="profile_loaded">
                                        <h1>Welcome,</h1>
                                        <h3>{{current_user.profile.name.first_name}} {{current_user.profile.name.last_name}}</h3>
                                        <p>{{current_user.profile.email}}</p>
                                    </template>

                                    <template v-if="!start">
                                        <h2>It's time to check in.</h2>
                                        <v-card outlined>
                                            <v-card-text>
                                            <h4>Hey, <strong>{{reservation.name}}</strong></h4>
                                            <p>Looking forward to hosting you at <strong>{{reservation.property.name}}</strong>. Below are the details of your bookings</p>
                                            <reservation-details :reservation="reservation" />
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-btn
                                                    text
                                                    dark color="accent-4"
                                                    class="primary"
                                                    block
                                                    @click="getStarted"
                                                >
                                                    Start Checkin
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </template>

                                    <template v-else>
                                        <reservation-checkin 
                                            :property="property" 
                                            :reservation="reservation" 
                                            :startAgainPath="returnPath"
                                            @verification="verificationAvailable"
                                            @charges-payment="chargesPayment"
                                            @checkedin="reservationCheckedin"
                                            
                                            />
                                    </template>
                                </template>

                                <!-- If reservation has been checkedin -->
                                <template v-else>
                                    <reservation-checkedin :property="property" :reservation="reservation"  />
                                </template>

                            </v-col>
                        </v-row>
                    </v-container>
                </template>
            </template>

        </data-container>
    </app-layer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import helper from '@/helper'

import AppLayer from '@/AppLayer';
import DataContainer from '../../../components/DataContainer.vue';

import ReservationDetails from '../Components/ReservationDetails';
import ReservationCheckin from '../Widgets/Checkin/Index';
import ReservationCheckedin from '../Widgets/CheckedIn';
import ReservationSkeleton from '../Components/ReservationSkeleton';

import GET_RESERVATION from '../Queries/getReservation';
import GET_PROPERTY from '../../Property/Queries/getProperty';

export default {
  name: 'Reservation',
  components: {
      AppLayer,
      DataContainer,
      ReservationDetails,
      ReservationCheckin,
      ReservationCheckedin,
      ReservationSkeleton
  }, 
  data(){
      return {
        loading: false,
        start: false,
        reservation: null,
        property: null,
      }
  },

    computed:{
        ...mapGetters([
            'authenticated',
            'current_user',
            'profile_loaded'
        ]),

        id(){
            return this.$route.params.id
        },

        checkin_time(){
            return this.reservation ? helper.resolveTimestamp(this.reservation.checkedin_at) : '';
        },
        approved_time(){
            return this.reservation ? helper.resolveTimestamp(this.reservation.approved_at) : '';
        },

        returnPath(){
            return this.$router.resolve({name: this.$route.name, query: {start: 1}}).route.fullPath
        }
    },
  
  methods:{
      ...mapActions([
          'query',
      ]),

    getStarted(){
        if(!this.authenticated){
            this.$router.push({
                name: 'signin',
                query: {
                    redirect: this.returnPath,
                },
            })
        }
        else{
            this.start = true;
        }
    },

    verificationAvailable(verification){

    },

    chargesPayment(charges){

    },

    reservationCheckedin(reservation){
        this.reservation = reservation;
    },

    getReservation(){
        this.loading = true;

        this.query({
            query: GET_RESERVATION,
            variables: {
                id: this.id
            }
        })
        .then(response => {
            if(response && response.data.getReservation){
                this.reservation = response.data.getReservation;

                if(this.$route.query.start == 1){
                    this.start = true
                }

                return this.query({
                    query: GET_PROPERTY,
                    variables: {
                        id: this.reservation.property_id
                    }
                })
            }
            return Promise.resolve(null)
        })
        .then(response => {
            this.property = response && response.data.getProperty ? response.data.getProperty : null;
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

  },
  mounted(){
        this.getReservation();
    },

}
</script>
