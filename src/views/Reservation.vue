<template>
    <div>
        <v-container>
            <v-row justify="center">
                <v-col md="6">
                    <div v-if="$apollo.queries.reservation.loading">
                        <v-skeleton-loader
                                height="80"
                                type="list-item-two-line"
                        >
                        </v-skeleton-loader>
                    </div>
                    <div v-else>
                        <h1 v-if="reservation == null" color="grey" class="text-center">We cannot find that reservation</h1>
                        <div v-else>
                            <h4 class="grey--text">{{reservation.property.name}}</h4>
                            <p>{{reservation.property.city}}, {{reservation.property.country}}</p>
                            <v-alert type="success" v-if="reservation.checkedin_at !== null">
                                Already checked in {{checkin_time}}
                            </v-alert>
                            <template v-if="reservation.already_checkedin || finished">
                                <CheckedIn :_reservation="reservation" />
                            </template>
                            <template  v-else-if="checkin_in">
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
                                    Hold on {{reservation.name}} while we check you in to {{reservation.property.name}}
                                    <v-progress-linear
                                        indeterminate
                                        color="white"
                                        class="mb-0"
                                    ></v-progress-linear>
                                    </v-card-text>
                                    </v-card>
                                </v-dialog>
                            </template>
                            <template v-else>
                                <template v-if="step == 0">
                                    <h2>It's time to check in.</h2>
                                    <v-card elevation-20>
                                        <v-card-text>
                                        <p>Hey, <strong>{{reservation.name}}</strong></p>
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
                                    <MobileVerification @done="getMobile"/>
                                </template>
                                <template v-else-if="step == 2">
                                    <MobileVerificationConfirmation :mobile_number="mobile_number" @done="phoneVerified" @resend="step = 1"/>
                                </template>
                                <template v-else-if="step == 3">
                                    <CompleteProfile @done="step++" :mobile_number="mobile_number" :_user="user" />
                                </template>
                                <template v-else-if="step == 4">
                                    <CreateIdentity :_user="user" @done="getUserIdentity" />
                                </template>
                                <template v-else-if="step == 5">
                                    <TermsAndCondition @done="reservationCheckin" />
                                </template>
                            </template>
                        </div>
                    </div>                    
                </v-col>
            </v-row>
        </v-container>
        
    </div>
</template>

<script>

import helper from './../helper'
import GET_RESERVATION from './../graphql/query/get_reservation'

import MobileVerification from './../components/MobileVerification'
import MobileVerificationConfirmation from './../components/MobileVerificationConfirmation'
import CreateIdentity from './../components/CreateIdentity'
import CompleteProfile from './../components/CompleteProfile'
import TermsAndCondition from './../components/TermsAndCondition'
import ReservationDetails from './../components/ReservationDetails'
import CheckedIn from './../components/CheckedIn'
import { mapActions } from 'vuex'

export default {
  name: 'reservation',
  components: {
      MobileVerification,
      MobileVerificationConfirmation, 
      CreateIdentity,
      CompleteProfile,
      TermsAndCondition,
      ReservationDetails,
      CheckedIn
  }, 
  data(){
      return {
        id: this.$route.params.reservation,
        user: null,
        reservation: null,
        step: 0,
        mobile_number:'',
        identity: null,
        finished: false,
        checkin_in: false,
      }
  },

    computed:{
         checkin_time(){
            return helper.resolveTimestamp(this.reservation.checkedin_at)
        }
    },
  created(){
      
  },
  methods:{
      ...mapActions([
          'getUserByID',
          'checkinReservation'
      ]),
      start(){
          this.step =  1;
      },
    getMobile(mobile){
        this.mobile_number = mobile
        this.step++
    },
    phoneVerified(user){
        this.user = user
        this.getUserByID(user.uid)
        .then(response => {
            if(response.data.getUserByID == null){ //If the user does not have a profile yet
                this.step++
            }else{
                this.step = 4
            }
        })
        
    },
    getUserIdentity(identity){
        if(identity === null){
            alert('No valid identity')
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
                user_id: this.user.uid,
                identity_ref: this.identity.ref,
                accepted_tnc: accepted_tnc
            }
            this.checkinReservation(payload)
            .then(result => {
                if(result.data.checkinReservation === null){
                    alert('Failed to checkin')
                }else{
                    this.reservation = result.data.checkinReservation
                }
                alert('successfully checked in')
                this.checkin_in = false
                this.finished = true

            })
            .catch(e => {
                this.checkin_in = false
                alert("Something went wrong while checking you in. "+e.message);
            })
        }else{
            alert('You need to accept the terms and condition')
        }
    }
  },
  apollo:{
    reservation: {
    // graphql query
        query: GET_RESERVATION,
        variables(){
            return {
                id: this.id
            }
        },
        update: data => data.getReservation
    }
  } 
}
</script>
