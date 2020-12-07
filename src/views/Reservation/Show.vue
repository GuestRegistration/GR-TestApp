<template>
    <app-layer ref="app">
        <div>
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
                                        <router-link :to="{name: 'signin', query: {redirect: $router.currentRoute.path }}">
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
                                <div>
                                    <h4 class="grey--text">{{reservation.property.name}}</h4>
                                    <p>{{property ? [property.address.street, property.address.country].join(', ') : reservation.property.country}}</p>
                                    <div class="my-3">
                                        <router-link :to="{name: 'property.show', params: {property: reservation.property.id} }">
                                            <v-btn color="primary">View property</v-btn>
                                        </router-link>
                                    </div>
                                </div>
                                <template v-if="profile_loaded">
                                    <v-divider></v-divider>
                                    <h1>Welcome,</h1>
                                    <h3>{{current_user.profile.name.first_name}} {{current_user.profile.name.last_name}}</h3>
                                    <p>{{current_user.profile.email}}</p>
                                </template>

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
                                <div>
                                    <template  v-if="reservation">
                                        <template v-if="reservation.already_checkedin">
                                            <CheckedIn :_reservation="reservation" />
                                        </template>
                                        <template v-else>
                                            <template v-if="!start">
                                                <h2>It's time to check in.</h2>
                                                <v-card outlined>
                                                    <v-card-text>
                                                    <h4>Hey, <strong>{{reservation.name}}</strong></h4>
                                                    <br>
                                                    <p>Looking forward to hosting you at <strong>{{reservation.property.name}}</strong>. Below are the details of your bookings</p>
                                                    <ReservationDetails :_reservation="reservation" />
                                                    </v-card-text>
                                                    <v-card-actions>
                                                        <v-btn
                                                            text
                                                            dark color="accent-4"
                                                            class="primary"
                                                            block
                                                            @click="getStarted"
                                                        >
                                                            Checkin
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </template>
                                            <template v-else>

                                                <template v-if="stage == 'identity'">
                                                    <SelectIdentity  @done="getUserIdentity" @alert="({message, type}) => $refs.app.alert(message, type)" @back="start = false" :_reservation="reservation" />
                                                </template>
                                                <template v-if="stage == 'tnc'">
                                                    <TermsAndCondition :property="property" @done="reservationCheckin" @back="stage = 'identity'" />
                                                </template>
                                                
                                            </template>
                                            
                                        </template>
                                    </template>
                                </div>                    
                            </v-col>
                        </v-row>
                    </v-container>
                </template>
            </template>
        </div>
    </app-layer>
</template>

<script>

import helper from '@/helper'
import GET_RESERVATION from '@/graphql/query/get_reservation'
import GET_PROPERTY from '@/graphql/query/get_property'

import AppLayer from '@/AppLayer';
import SelectIdentity from '@/components/SelectIdentity'
import CompleteProfile from '@/components/CompleteProfile'
import TermsAndCondition from '@/components/TermsAndCondition'
import ReservationDetails from '@/components/ReservationDetails'
import CheckedIn from '@/components/CheckedIn'
import CHECKIN_RESERVATION from '@/graphql/mutation/checkin_reservation';
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'reservation',
  components: {
      AppLayer,
      SelectIdentity,
      TermsAndCondition,
      ReservationDetails,
      CheckedIn,
  }, 
  data(){
      return {
        start: false,
        reservation: null,
        property: null,
        identity: null,
        stage: '',
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
            return this.$route.params.reservation
        },

         checkin_time(){
            return helper.resolveTimestamp(this.reservation.checkedin_at)
        },
        approved_time(){
            return helper.resolveTimestamp(this.reservation.approved_at)
        }
    },
  mounted(){
        this.getReservation()
    },
  methods:{
      ...mapActions([
          'query',
          'mutate',
      ]),
      ...mapMutations([
          'SET_CURRENT_USER'
      ]),

      getStarted(){
          if(!this.authenticated){
                this.$router.push({
                    name: 'signin',
                    query: {
                        redirect: this.$router.currentRoute.path
                    },
                })
          }
        else if(!this.profile_loaded){
           this.$router.push({
                name: 'profile',
                query: {
                    redirect: this.$router.currentRoute.path
                },
            })
      }
          else{
              this.start = true;
              this.stage = 'identity';
          }
      },

    getUserIdentity(identity){
        if(identity === null){
             this.$refs.app.alert(`No Id selected`, `red`);
        }else{
            this.identity = identity;
            
            this.stage = 'tnc';
        }
    },

    reservationCheckin(accepted_tnc){
        if(accepted_tnc){
            this.$refs.app.setState(false, `Checking you in to ${this.reservation.property.name}`)
            const payload = {
                reservation_id: this.reservation.id,
                identity_ref: this.identity.ref,
                accepted_tnc: accepted_tnc
            }
            this.mutate({
                mutation: CHECKIN_RESERVATION,
                variables: payload
            })
            .then(response => {
                if(response.data.checkinReservation === null){
                    this.$refs.app.toastError({
                        message: `Failed to checkin`,
                        retry: () => {
                            this.reservationCheckin(accepted_tnc)
                        }
                    });
                }else{ 
                    this.reservation = response.data.checkinReservation;
                    this.reservation.user_id = this.current_user.auth.uid;
                    this.$refs.app.alert(`Successfully checked in to ${this.reservation.property.name}`, `success`);
                }
            })
            .catch(e => {
                this.$refs.app.toastError({
                    message: `Something went wrong while checking you in.`,
                     retry: () => {
                        this.reservationCheckin(accepted_tnc)
                    },
                    exception: e
                });
            })
            .finally(() => {
                this.$refs.app.setState(true)
            })
        }else{
           this.$refs.app.alert(`You need to agree to the terms`, `red`);
        }
    },

    getReservation(){
        this.$refs.app.setState(false, "Getting the reservation...");
        this.query({
            query: GET_RESERVATION,
            variables: {
                id: this.id
            }
        })
        .then(response => {
            this.reservation = response.data.getReservation;
            this.$refs.app.alert(`Welcome to ${this.reservation.property.name}`);
            return this.query({
                query: GET_PROPERTY,
                variables: {
                    id: this.reservation.property.id
                }
            })
        })
        .then(response => {
            this.property = response.data.getProperty;
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
            this.$refs.app.setState(true);
        })
    },

  },

}
</script>
