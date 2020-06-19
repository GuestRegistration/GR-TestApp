<template>
    <div>
        <!-- if there is any report -->
        <template  v-if="report">
            <Report :_message="report" @close="report = null" />
        </template>

        <template v-if="!app_ready">
            <Wait />
        </template>         
    
            <!-- if the checkin process is on going -->
            <template  v-if="checkin_in">
                <v-dialog
                    v-model="checkin_in"
                    hide-overlay
                    persistent
                    width="300"
                >
                <v-card
                    color="primary"
                    dark
                >
                    <v-card-text>
                    Hold on {{current_user.profile.name.first_name}} while we check you in to {{reservation.property.name}}
                    <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0"
                    ></v-progress-linear>
                    </v-card-text>
                    </v-card>
                </v-dialog>
            </template>

            <!-- resource is still loading -->
            <template v-if="loading">
                <v-container>
                    <v-row justify="center">
                        <v-col cols="12" md="6">
                            <v-skeleton-loader
                                class="mx-auto"
                                type="card"
                            ></v-skeleton-loader>
                            <div class="text-center"><h3>Hold on while we get that reservation for you</h3></div>
                        </v-col>
                    </v-row>
                </v-container>
            </template>

            <!-- resource no longer loading but it not found -->
            <template v-else-if="!loading && reservation == null">
                <div class="text-center">
                    <h1>We could not find that reservation</h1>
                    <p color="grey">check that the url is valid or contact your host</p>
                </div>
            </template>

            <!-- the resource is found -->
            <template v-else-if="reservation">

                <!-- if the reservation already checked in and the there is no auhenticated user, checked in reservation should no longer be accessible by the public, as user to authenticate -->
                <template v-if="reservation.already_checkedin && current_user && !current_user.auth">
                    
                    <v-container>
                        <v-row justify="center">
                            <v-col xs="12" md="4">
                                    <div class="text-center">
                                        <h4>We discover that this reservation has been checked in, If it's for you, you can continue</h4>
                                    </div>
                                    <Authenticate />
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
                                <!-- <v-btn class="ma-2" color="primary" dark v-if="back !== null && step !== back" @click="step = back">
                                    <v-icon dark left>mdi-arrow-left</v-icon>Back
                                </v-btn> -->

                                <div>
                                    <h4 class="grey--text">{{reservation.property.name}}</h4>
                                    <p>{{reservation.property.country}}</p>
                                </div>
                                <template v-if="current_user.profile">
                                    <v-divider></v-divider>
                                    <h1>Welcome,</h1>
                                    <h3>{{current_user.profile.name.first_name}} {{current_user.profile.name.last_name}}</h3>
                                    <p>{{current_user.profile.email}}</p>
                                </template>

                                <template v-if="reservation.already_checkedin">
                                    <v-alert type="success">
                                        Reservation checked in {{checkin_time}}
                                    </v-alert>

                                    <v-alert type="success" v-if="reservation.approved">
                                    Reservation approved {{approved_time}}
                                    </v-alert>
                                    <v-alert type="warning" v-else>
                                        The approval of your checkin is still pending 
                                    </v-alert>
                                </template>
                            </v-col>

                            <v-col cols="12" md="6">
                                <div>
                                    <template  v-if="reservation">
                                        <template v-if="reservation.already_checkedin || finished">
                                            <CheckedIn :_reservation="reservation" />
                                        </template>
                                        <template v-else>
                                            <template v-if="step == 0">
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
                                                            @click="start"
                                                        >
                                                            Checkin
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </template>
                                            <template v-else-if="step == 1">
                                                <div class="my-5">
                                                    <h2 class="text-center">Let's Get Started</h2>
                                                </div>
                                                <Authenticate @authenticated="authenticated" />
                                            </template>
                                            <template v-else-if="step == 2">
                                                <CompleteProfile @done="getUserProfile"  @error="gotError" />
                                            </template>
                                            <template v-else-if="step == 3">
                                                <SelectIdentity  @done="getUserIdentity" :_reservation="reservation" />
                                            </template>
                                            <template v-else-if="step == 4">
                                                <TermsAndCondition @done="reservationCheckin" />
                                            </template>
                                        </template>
                                    </template>
                                </div>                    
                            </v-col>
                        </v-row>
                    </v-container>
                </template>
            </template>

            <template v-else>
                <h1 class="text-center">hahaha...escaped scenerio</h1>
            </template>

    </div>
</template>

<script>

import helper from '@/helper'
import GET_RESERVATION from '@/graphql/query/get_reservation'

import Authenticate from '@/components/Authenticate'
import MobileVerificationConfirmation from '@/components/MobileVerificationConfirmation'
import SelectIdentity from '@/components/SelectIdentity'
import CompleteProfile from '@/components/CompleteProfile'
import TermsAndCondition from '@/components/TermsAndCondition'
import ReservationDetails from '@/components/ReservationDetails'
import CheckedIn from '@/components/CheckedIn'
import Report from '@/components/Report'
import Wait from '@/components/Wait'
import _apollo from './../apollo'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'reservation',
  components: {
      Authenticate,
      SelectIdentity,
      CompleteProfile,
      TermsAndCondition,
      ReservationDetails,
      CheckedIn,
      Report,
      Wait
  }, 
  data(){
      return {
        loading: false,
        id: this.$route.params.reservation,
        step: 0,
        reservation: null,
        identity: null,
        finished: false,
        checkin_in: false,
        report: null,
        back: null
      }
  },

    computed:{
        ...mapGetters([
            'app_ready',
            'current_user'
        ]),
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
          'checkinReservation'
      ]),
      ...mapMutations([
          'SET_CURRENT_USER'
      ]),
      start(){
          if(this.current_user.auth !== null){
                this.step =  3
          }else{
              this.step = 1
          }
      },
    authenticated(){
        if(this.current_user.profile == null){ //If the user does not have a profile yet
            this.step++
        }else{
            this.step = 3
        }
    },
    getUserProfile(profile){
        this.step++
        this.back = this.step - 1

    },
    gotError(e){
      this.report = e
    },
    getUserIdentity(identity){
        //console.log(identity)
        if(identity === null){
            this.report = 'No valid identity'
        }else{
            this.identity = identity
            this.step++
        }
    },
    reservationCheckin(accepted_tnc){
        if(accepted_tnc){
            this.checkin_in = true
            const payload = {
                reservation_id: this.reservation.id,
                identity_ref: this.identity.ref,
                accepted_tnc: accepted_tnc
            }
            this.checkinReservation(payload)
            .then(result => {
                if(result.data.checkinReservation === null){
                   this.report = 'Failed to checkin'
                   this.checkin_in = false
                }else{
                    this.reservation = result.data.checkinReservation
                    this.report = 'successfully checked in'
                    this.checkin_in = false
                    this.finished = true
                    this.$router.push({
                        path: '/'
                    })
                }
               

            })
            .catch(e => {
                this.checkin_in = false
                this.report = "Something went wrong while checking you in: "+e.message
            })
        }else{
           this.report = "You need to agree to the terms"
        }
    },

    getReservation(){
        this.loading = true
        const apollo = _apollo().client
            apollo.query({
                query: GET_RESERVATION,
                variables: {
                    id: this.id
                }
            })
            .then(response => {
                this.reservation = response.data.getReservation
            })
            .catch(e => {
                this.report = e.message
            })
            .finally(() => {
                this.loading = false
            })
    }
  },

}
</script>
