<template>
    <div>
        <p>Hey, <strong>{{reservation.name}}</strong>,</p>
        <p>Thank you for booking with us at <strong>{{reservation.property.name}}</strong>. Below are the details of your bookings</p>
        <reservation-details :_reservation="reservation" />
        <h3>Your checkin process</h3>
        <v-stepper v-model="step" vertical >

                <!-- Step 1 -->
                <v-stepper-step
                    :complete="IDVerified"
                    step="1"
                    :editable="step >= 1"
                    edit-icon="mdi-account-check"
                >
                ID Verification
                </v-stepper-step>

                <v-stepper-content step="1">
                    <v-card class="my-2" flat>
                        <v-card-text>
                            <identity-verification :property="property" @verification="verificationDone" :can-restart="!approved" />  
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="step++" :disabled="!IDVerified">Continue</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-stepper-content>

                <!-- Step 2 -->
                <v-stepper-step
                    :complete="creditCardCollected"
                    step="2"
                    :editable="step >= 2"
                    edit-icon="mdi-credit-card"
                >
                Credit Card
                </v-stepper-step>

                <v-stepper-content step="2">
                    <v-card class="my-2" flat >
                        <v-card-text>
                            <h4>Credit card collection here</h4>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="step++" :disabled="!creditCardCollected">Continue</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-stepper-content>            

                <!-- Step 3 -->

                <v-stepper-step
                :complete="questionsRespondedTo"
                step="3"
                :editable="step >= 3"
                edit-icon="mdi-account-question"
                >
                Questions
                </v-stepper-step>

                <v-stepper-content step="3">
                    <v-card class="my-2" flat>
                        <v-card-text>
                            <p>Please take time to answer the following questions</p>
                            <reservation-questions :questions="reservation.questions"  @responses="questionResponded" />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="step++" :disabled="!questionsRespondedTo">Continue</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-stepper-content>

                <!-- Step 4 -->

               <v-stepper-step
                :complete="agreementsAgreed"
                step="4"
                :editable="step >= 4"
                edit-icon="mdi-handshake"
                >
                Agreements
                </v-stepper-step>

                <v-stepper-content step="4">
                    <v-card class="my-2" flat>
                        <v-card-text>
                            <p>You need to agree to the following. Checking the boxes means you agree to each item</p>
                            <reservation-agreements :agreements="allReservationAgreements" @agreement="aggrementsResolved"  />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="step++" :disabled="!agreementsAgreed">Continue</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-stepper-content>

                <!-- Step 5 -->

                <v-stepper-step 
                    step="5"
                    :complete="allPaymentMade"
                    :editable="step >= 5"
                    edit-icon="mdi-credit-card"
                >
                    Payment
                </v-stepper-step>

                <v-stepper-content step="5">
                    <v-card class="my-2" flat>
                        <v-card-text>
                            <reservation-charges :reservation="reservation" @charges-payment="chargesPayment" :can-pay="true" >
                                <template v-slot:default="props">
                                    <template v-if="props.charge.type == 'pre-authorize'">
                                        <v-alert v-if="!props.payment || (props.payment && !props.payment.captured)"
                                            border="left"
                                            colored-border
                                            elevation="2"
                                            type="info"
                                        >
                                            This is a pre authorized charge. {{ property.name }} will capture the charge within 7 days of authorization
                                        </v-alert>
                                    </template>
                                    
                                </template>
                            </reservation-charges>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="checkin" :disabled="!allPaymentMade" :loading="checkingin">Finalize Checkin</v-btn>
                        </v-card-actions>
                    </v-card>

                </v-stepper-content>

                <!-- Step 6 -->

                <!-- <v-stepper-step 
                    step="5"
                    :editable="step >= 5"
                    edit-icon="mdi-account-check"
                    :complete="approved"
                >
                    Approval
                </v-stepper-step>

                <v-stepper-content step="5">
                    <v-card class="my-2" >
                        <v-card-text>
                            <div class="py-5 text-center">
                                <template v-if="reservation.approved">
                                    <v-icon color="success" size="80">mdi-check-circle</v-icon>
                                    <h2 class="grey--text mt-5">Approved</h2>
                                </template>
                                <template v-else>
                                    <v-icon color="warning" size="80">mdi-alert-circle-outline</v-icon>
                                    <h2 class="grey--text mt-5">Pending approval</h2>
                                </template>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="step++" :disabled="!approved">Continue</v-btn>
                        </v-card-actions>
                    </v-card>                
                </v-stepper-content> -->

                <!-- Step 6 -->

                <!-- <v-stepper-step 
                    step="6"
                    :editable="step >= 6"
                    edit-icon="mdi-information"
                    :complete="approved"
                >
                    Instructions
                </v-stepper-step>

                <v-stepper-content step="6">
                    <v-card class="my-2" >
                        <v-card-text>
                            <v-dialog v-if="reservation.approved" v-model="instruction" scrollable max-width="500px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                    color="primary"
                                    dark
                                    v-bind="attrs"
                                    v-on="on"
                                    block
                                    >
                                    See checkin instruction
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>Checkin Instructions</v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <div class="text-center mt-5" v-if="reservation.instruction">
                                            {{reservation.instruction}}
                                        </div>
                                        <div class="text-center mt-5" v-else>
                                            No checkin instruction
                                        </div>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red darken-1" text @click="instruction = false">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-alert v-else 
                                border="top"
                                colored-border
                                elevation="2"
                                type="warning"
                            >
                                Your checkin needs to be approved before you can see instructions
                            </v-alert>
                        </v-card-text>
                    </v-card>
                </v-stepper-content> -->
        </v-stepper>
    </div>

</template>

<script>
import { mapActions } from 'vuex';
import ReservationDetails from '../../Components/ReservationDetails';
import IdentityVerification from '../../../User/Components/IdentityVerification';
import ReservationCharges from './ReservationCharges';
import ReservationAgreements from './ReservationAgreements';
import ReservationQuestions from './ReservationQuestions';

import CHECKIN_RESERVATION from '../../Mutations/checkinReservation';
export default {
    name: "ReservationCheckin",
    components: {
       ReservationDetails, IdentityVerification, 
       ReservationCharges, ReservationAgreements,
       ReservationQuestions
    },
    props: {
        property: Object,
        reservation: Object,
    },
    data(){
        return {
            checkingin: false,
            step: 1,
            verification: null,
            charges: null ,
            agreements: null,
            instruction: false,
            questions: null,
        }
    },

    computed: {

        allPaymentMade(){
            if(!this.charges) return true;
            return this.charges.filter(charge => !charge.optional).every(charge => charge.payment !== null && charge.payment !== undefined );
        },

        IDVerified(){
            return this.verification && this.verification.status == 'verified'
        },

        agreementsAgreed(){
            if(!this.agreements) return false;
            return this.allReservationAgreements.every(agreement => this.agreements.map(a => a.agreement).includes(agreement.agreement))
        },

        questionsRespondedTo(){
            if(!this.questions) return false;
            return this.questions.every(question => {
                if(question.required) return question.response != null &&question.response != ''
                return true;
            });
        },

        creditCardCollected(){
            return true;
        },

        allReservationAgreements(){
            let agreements = [];
            if(this.property.terms){
                agreements.push({
                    agreement: "Property terms and condition",
                    link: this.property.terms
                })
            }

            if(this.reservation.agreements && this.reservation.agreements.length){
                agreements = agreements.concat(this.reservation.agreements)
            }

            return agreements;
        },

        approved(){
            return this.reservation.approved
        }
    },

    methods: {
        ...mapActions([
            'mutate'
        ]),

        questionResponded(responses){
            this.questions = responses;
            this.$emit('question-responses', responses)
        },

        aggrementsResolved(agreements){
            this.agreements = agreements;
            this.$emit('agreement', agreements);
        },

        verificationDone(verification){
            this.verification = verification;
            this.$emit('verification', verification);
        },

        chargesPayment(charges){
            this.charges = charges;
            this.$emit('charges-payment', charges);
        },

        checkin(){
            this.checkingin = true;
            this.mutate({
                mutation: CHECKIN_RESERVATION,
                variables: {
                    reservation_id: this.reservation.id,
                    agreements: this.agreements,
                    questions: this.questions
                }
            })
            .then(response => {
                if(response.data.checkinReservation){
                    const reservation = response.data.checkinReservation;
                    this.$store.commit('ADD_USER_RESERVATION', {...reservation});
                    this.$emit('checkedin', reservation)
                    this.$store.commit('SNACKBAR', {
                        status: true,
                        text: 'Checkin successfull',
                        color: 'success'
                    })
                }else{
                    this.$store.commit('SNACKBAR', {
                        status: true,
                        text: 'Checkin could not be finalized. Try again',
                        color: 'error'
                    })
                }
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: `Something went wrong while starting your checkin process.`,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.reservationCheckin();
                            resolve()
                        })
                        
                    },
                    exception: e
                })
            })
            .finally(() => {
                this.checkingin = false;
            })
        },
    },

    watch: {
        reservation: {
            immediate: true,
            handler(reservation){
            }
        }
    }

}
</script>