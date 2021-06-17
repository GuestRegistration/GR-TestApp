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
                            <identity-verifications :property="property" @verifications="verificationsFetched" :metadata="{ reservation_id: reservation.id }" :redirect-path="startAgainPath">
                                <template #verification="props">
                                    <v-btn :color="`${verification && verification.session == props.verification.session ? 'success' : 'primary'}`" @click="verification = props.verification" dark>
                                        <v-icon v-if="verification && verification.session == props.verification.session" class="mr-2">mdi-check</v-icon>
                                        Use ID
                                    </v-btn>
                                </template>
                                <template #actions="props">
                                    <run-identity-verification class="mt-3" v-if="props.verifications && props.verifications.length" :property="property" :metadata="{ reservation_id: reservation.id }" :redirect="url(startAgainPath)">
                                        New ID verification
                                    </run-identity-verification>
                                </template>    
                            </identity-verifications>  
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
                    <reservation-credit-card :property="property" :reservation="reservation" @credit-card="creditCardSelected" />
                    <div class="d-flex justify-end">
                        <v-btn color="primary" @click="step++" :disabled="!creditCardCollected">Continue</v-btn>
                    </div>
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
                            <p>The following questions have been required to be answered for your checkin</p>
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
                            <reservation-charges :reservation="reservation" :property="property" :credit-card="credit_card" @charges-payment="chargesPayment" :can-pay="true" >
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
                            <!-- <v-btn color="primary" @click="checkin" :disabled="!allPaymentMade" :loading="checkingin">Finalize Checkin</v-btn> -->
                            <v-btn color="primary" @click="$refs.contract.open()" :disabled="!allPaymentMade" >Sign contract</v-btn>
                            <reservation-checkin-contract v-on="$listeners" ref="contract" :checkin="{ reservation, verification, checkin: {  agreements, questions, credit_card } }" :property="property" />
                        </v-card-actions>
                    </v-card>
                </v-stepper-content>
        </v-stepper>
    </div>

</template>

<script>
import { mapActions } from 'vuex';
import ReservationDetails from '../../Components/ReservationDetails';
import IdentityVerifications from '../../../User/Components/IdentityVerifications';
import RunIdentityVerification from '../../../User/Components/RunIdentityVerification';
import ReservationCharges from './ReservationCharges';
import ReservationAgreements from './ReservationAgreements';
import ReservationQuestions from './ReservationQuestions';
import ReservationCreditCard from './ReservationCreditCard'
import ReservationCheckinContract from './ReservationCheckinContract.vue';

export default {
    name: "ReservationCheckin",
    components: {
       ReservationDetails, IdentityVerifications, RunIdentityVerification,
       ReservationCharges, ReservationAgreements,
       ReservationQuestions, ReservationCreditCard,
       ReservationCheckinContract
    },
    props: {
        property: Object,
        reservation: Object,
        startAgainPath: String
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
            credit_card: null,
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
            return this.credit_card !== null;
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

        verificationsFetched(verifications){
            if(verifications){
                const reservationIdVerifications = verifications.filter(v => v.metadata.reservation_id == this.reservation.id);
                if(reservationIdVerifications.length){
                    this.verification = reservationIdVerifications.pop();
                    this.$emit('verification', this.verification);
                }
            }
        },

        chargesPayment(charges){
            this.charges = charges;
            this.$emit('charges-payment', charges);
        },

        creditCardSelected(card){
            this.credit_card = card;
            this.$emit('credit-card', card)
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