<template>
    <div>
        <p>Hey, <strong>{{reservation.name}}</strong>,</p>
        <p>Thank you for booking with us at <strong>{{reservation.property.name}}</strong>. Below are the details of your bookings</p>
        <reservation-details :_reservation="reservation" />
        <h3>Your checkin process</h3>
        <v-stepper v-model="step" vertical >
                <v-stepper-step
                :complete="started"
                step="1"
                >
                Terms & Conditions
                </v-stepper-step>

                <v-stepper-content step="1">
                    <v-card class="my-2" outlined>
                        <v-card-text>
                            <terms-and-condition  :property="property"  :reservation="reservation" @started="checkinStarted" />
                        </v-card-text>
                    </v-card>
                </v-stepper-content>

                <v-stepper-step
                    :complete="IDVerified"
                    step="2"
                    :editable="started"
                    edit-icon="mdi-check"
                >
                ID Verification
                </v-stepper-step>

                <v-stepper-content step="2">
                    <v-card v-if="started" class="my-2" outlined>
                        <v-card-text>
                            <identity-verification :property="property" @verification="verificationDone" />  
                        </v-card-text>
                    </v-card>

                </v-stepper-content>

                <v-stepper-step 
                step="3"
                :complete="allPaymentMade"
                edit-icon="mdi-check"
                :editable="started"
                >
                    Payment
                </v-stepper-step>

                <v-stepper-content step="3">
                    <v-card v-if="started" class="my-2" outlined>
                        <v-card-text>
                            <reservation-charges :reservation="reservation" @charges-payment="chargesPayment" />
                        </v-card-text>
                    </v-card>

                </v-stepper-content>

                <v-stepper-step 
                step="4"
                :editable="started"
                edit-icon="mdi-check"
                :complete="approved"
                >
                    Approval
                </v-stepper-step>

                <v-stepper-content step="4">
                    <v-card  v-if="started" class="my-2" outlined>
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
                    </v-card>                
                </v-stepper-content>

                <v-stepper-step 
                step="5"
                :editable="started"
                edit-icon="mdi-check"
                :complete="approved"
                >
                    Instructions
                </v-stepper-step>

                <v-stepper-content step="5">
                    <v-card  v-if="started" class="my-2" outlined>
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
                </v-stepper-content>
        </v-stepper>
    </div>

</template>

<script>
import ReservationDetails from '../../Components/ReservationDetails';
import TermsAndCondition from './Start'
import IdentityVerification from '../../../User/Components/IdentityVerification';
import ReservationCharges from '../../Components/ReservationCharges';

export default {
    name: "ReservationCheckin",
    components: {
       ReservationDetails, TermsAndCondition, IdentityVerification, ReservationCharges
    },
    props: {
        property: Object,
        reservation: Object,
    },
    data(){
        return {
            step: 1,
            started: false,
            verification: null,
            charges: null ,
            instruction: false
        }
    },

    computed: {

        allPaymentMade(){
            return this.charges && this.charges.every(charge => charge.payment !== null && charge.payment !== undefined );
        },

        IDVerified(){
            return this.verification && this.verification.status == 'verified'
        },

        approved(){
            return this.reservation.approved
        }
    },

    methods: {

        checkinStarted(reservation){
            this.started = true;
            this.step = 2;
            this.$emit('started', reservation);
        },

        verificationDone(verification){
            this.verification = verification;

            if(this.IDVerified) this.step = 3;

            this.$emit('verification', verification);
        },

        chargesPayment(charges){
            this.charges = charges;

            if(this.allPaymentMade && this.step == 3) this.step = 4;

            this.$emit('charges-payment', charges);
        },

        ruleIdentityVerified(){  
            if(!this.started) return true;          
            return this.verification && this.verification.status === 'verified';
        },

        ruleCheckinApproved(){
            if(!this.started) return true;          
            return this.reservation.approved
        },

        ruleChargesPaid(){
            if(!this.started) return true;          
            return this.charges.every(charge => charge.payment !== null  && charge.payment !== undefined );
        }
    },

    watch: {
        reservation: {
            immediate: true,
            handler(reservation){
                this.started = reservation.already_checkedin;
                if(this.started){
                    this.step = reservation.approved && this.IDVerified && this.allPaymentMade ? 5 : 2
                }else{
                    this.step = 1
                }
            }
        }
    }

}
</script>