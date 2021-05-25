<template>
    <v-dialog 
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"    
      >
        <v-card>
            <v-toolbar
                dark
                color="primary"
            >
                <v-btn
                icon
                dark
                @click="close"
                >
                <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Reservation Contract</v-toolbar-title>
            </v-toolbar>

            <v-container>
                <v-row justify="center">

                    <v-col cols="12" md="6">
                        <div class="my-2">
                            <h4 class="headline">Reservation Details</h4>
                            <v-card class="my-2">
                                <v-card-text>

                                    <v-list>
                                        <v-list-item>
                                            <v-list-item-title>Booking Name: {{ reservation.name }}</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item>
                                            <v-list-item-title>Checkin Date: {{ reservation.checkin_date }}</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item>
                                            <v-list-item-title>Checkout Date: {{ reservation.checkout_date }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>

                                </v-card-text>
                            </v-card>
                        </div>

                        <div class="my-2">
                            <h4 class="headline">Agreements</h4>
                            <v-card>
                                <v-card-text>
                                    <template v-if="agreements && agreements.length">
                                        <v-list>
                                            <v-list-item v-for="(agreement, i) in agreements" :key="i">
                                                <v-list-item-icon>
                                                    <v-icon>mdi-handshake</v-icon>
                                                </v-list-item-icon>
                                                <v-list-item-content>
                                                    <v-list-item-title>
                                                        {{ agreement.agreement }}
                                                    </v-list-item-title>
                                                    <v-list-item-subtitle v-if="agreement.link && agreement.link !== ''">
                                                        <a :href="agreement.link" target="_blank">Read agreement</a>
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </template>
                                    <template v-else>
                                        <p class="grey--text py-3">No agreement</p>
                                    </template>
                                </v-card-text>
                            </v-card>
                        </div>

                        <div class="my-2">
                            <h4 class="headline">Questions</h4>
                            <v-card>
                                <v-card-text>
                                    <v-list v-if="questions && questions.length">
                                        <v-list-item v-for="(question, q) in questions" :key="q">
                                            <v-list-item-icon>
                                                <v-icon>mdi-account-question</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    {{ question.question }}
                                                </v-list-item-title>
                                                <v-list-item-subtitle>
                                                    Ans: {{ question.response ? question.response : 'NIL'  }}
                                                </v-list-item-subtitle>
                                                
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                    <div v-else class="my-5 grey--text text-center">
                                        No question responded to for this reservation
                                    </div>
                                </v-card-text>
                            </v-card>
                        </div>

                        <div class="my-2">
                            <h4 class="headline">Credit card</h4>
                            <stripe-credit-card :card="credit_card" />
                        </div>

                        <div class="my-2">
                            <h4 class="headline">Charges</h4>
                            <v-card  class="my-2">
                                <v-card-text>
                                    <reservation-charges :reservation="reservation" :property="property" />
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-col>
                    
                    <v-col cols="12" md="3">
                        <div class="my-2">
                            <h4 class="headline">ID Verification</h4>
                            <v-card>
                                <v-card-text>
                                   <reservation-verification-report :verification="verification" />
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
                <div class="my-2">
                    <h4 class="headline">Signature</h4>
                     <signature-pad :signature="checkin.checkin.signature" :editable="!reservation.already_checkedin" v-model="signature" />
                </div>
                <v-btn v-if="!reservation.already_checkedin" class="mt-3" :loading="checkingin" @click="finalizeCheckin" color="primary" :disabled="signature == null">Finalize checkin</v-btn>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>

    import ReservationCharges from './ReservationCharges.vue';
    import StripeCreditCard from '../../../../components/Utilities/StripeCreditCard.vue';
    import ReservationVerificationReport from '../../Components/ReservationVerificationReport';
    import SignaturePad from '../../../../components/Utilities/SignaturePad.vue';

    import CHECKIN_RESERVATION from '../../Mutations/checkinReservation';
    import { mapActions } from 'vuex';

    export default {
        name: "ReservationCheckinContract",
        components: {
            ReservationCharges, StripeCreditCard, ReservationVerificationReport,
            SignaturePad
        },
        data(){
            return {
                dialog: false,
                signature: null,
                checkingin: false,
            }
        },
        props: {
            checkin: Object,
        },
        computed: {

            reservation(){
                return this.checkin.reservation
            },

            property(){
                return this.checkin.reservation.property
            },

            agreements(){
                return this.checkin.checkin.agreements
            },

            questions(){
                return this.checkin.checkin.questions
            },

            credit_card(){
                return this.checkin.checkin.credit_card
            },

            verification(){
                return this.checkin.verification
            }
        },

        methods: {
            ...mapActions([
                'mutate'
            ]),

            open(){
                this.dialog = true;
            },

            close(){
                this.dialog = false;
            },

            finalizeCheckin(){
                this.checkingin = true;
                this.mutate({
                    mutation: CHECKIN_RESERVATION,
                    variables: {
                        reservation_id: this.reservation.id,
                        agreements: this.agreements,
                        questions: this.questions,
                        verification: this.verification,
                        credit_card: this.credit_card,
                        signature: this.signature,
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
                        retry: () => this.reservationCheckin(),
                        exception: e
                    })
                })
                .finally(() => {
                    this.checkingin = false;
                })
            },

        }
    }
</script>