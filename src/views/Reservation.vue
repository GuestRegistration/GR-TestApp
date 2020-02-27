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

                            <template v-if="finished">
                                <CheckedIn :reservation="reservation" />
                            </template>
                            <template v-else>
                                <template v-if="step == 0">
                                    <h2>It's time to check in.</h2>
                                    <v-card elevation-20>
                                        <v-card-text>
                                        <p>Hey, <strong>{{reservation.name}}</strong></p>
                                        <br>
                                        <p>Looking forward to hosting you at <strong>{{reservation.property.name}}</strong>. Below are the details of your bookings</p>
                                        <ReservationDetails :reservation="reservation" />
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
                                    <IdentityVerification @done="step++" />
                                </template>
                                <template v-else-if="step == 5">
                                    <TermsAndCondition @done="finished=true;" />
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

import gql from 'graphql-tag'
// import firebase from './../firebase'
import GET_RESERVATION from './../graphql/query/get_reservation'

import MobileVerification from './../components/MobileVerification'
import MobileVerificationConfirmation from './../components/MobileVerificationConfirmation'
import IdentityVerification from './../components/IdentityVerification'
import CompleteProfile from './../components/CompleteProfile'
import TermsAndCondition from './../components/TermsAndCondition'
import ReservationDetails from './../components/ReservationDetails'
import CheckedIn from './../components/CheckedIn'

export default {
  name: 'reservation',
  components: {
      MobileVerification,
      MobileVerificationConfirmation, 
      IdentityVerification,
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
        finished: false
      }
  },

  created(){
      
  },
  methods:{
      start(){
          this.step =  1;
      },
    getMobile(mobile){
        this.mobile_number = mobile
        this.step++
    },
    phoneVerified(user){
        this.user = user
        this.$apollo.query({
            query: gql`
            query getUser($id: String!){
                getUser(id: $id){
                    id
                }
            }`,
            variables: {
                id: user.uid
            }
        })
        .then(response => {
            if(response.data.getUser == null){ //If the user already completed profile
                this.step++
            }else{
                this.step = 5
            }
        })
        
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
