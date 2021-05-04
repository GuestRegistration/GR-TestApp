<template>
    <data-container :loading="loading">
        <template v-if="checkin">
            <confirmation-dialog ref="approvalConfirmation" @confirmed="approveCheckin">
                <div class="mt-5">
                    <h4>Are you sure you want to approve the checkin ?</h4>
                </div>
            </confirmation-dialog>
            
            <v-tabs
            v-model="tab"
            background-color="transparent"
            color="primary"
            grow
            icons-and-text
            show-arrows
            >
            <v-tab>
            Guest 
            <v-icon>mdi-account</v-icon>
            </v-tab>
            <v-tab>
            ID Verification 
            <v-icon>mdi-account-check</v-icon>
            </v-tab>
            <v-tab>
                Credit Card
                <v-icon>mdi-credit-card</v-icon>
            </v-tab>
            <v-tab>
                Charges
                <v-icon>mdi-credit-card</v-icon>
            </v-tab>
            <v-tab>
                Questions
                <v-icon>mdi-account-question</v-icon>
            </v-tab>
            <v-tab>
                Agreements
                <v-icon>mdi-handshake</v-icon>
            </v-tab>
            <v-tab>
                Instructions
                <v-icon>mdi-information</v-icon>
            </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab" class="pb-15">
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <div v-if="user">
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-content>
                                            Booking Name: {{ checkin.reservation.name }}
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>
                                            Account name: {{ [user.name.first_name, user.name.last_name].join(' ') }}
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </div>
                            <v-alert v-else
                            border="top"
                            colored-border
                            elevation="2"
                            type="error"
                            class="mt-5">
                                User not found
                            </v-alert>
                        </v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <div class="text-uppercase">Verification Type: {{ userVerification.type  }}</div>
                            <div>
                                status:  <v-chip
                                    class="ma-2"
                                    :color="`${userVerification.status === 'verified' ? 'green' : 'orange'}`"
                                    text-color="white"
                                    >
                                    {{ userVerification.status }}
                                </v-chip>
                            </div>
                            <v-btn class="ma-1" color="primary" @click="$refs.userVerificationReport.open()">View Verification Report</v-btn>
                            <verification-report ref="userVerificationReport" :verification="userVerification" />
                        </v-card-text>
                    </v-card>

                </v-tab-item>

                <v-tab-item>
                    <v-row justify="center"> 
                        <v-col cols="12" md="8">
                            <stripe-credit-card :card="checkin.checkin.credit_card">
                                <template #actions="attrs">
                                    <reservation-payments 
                                    :property="property"
                                    :reservation="checkin.reservation" 
                                    :credit-card="attrs.credit_card" 
                                    :can-refund="true"
                                    />
                                    <v-spacer></v-spacer>
                                    <reservation-extra-charge 
                                    :reservation="checkin.reservation" 
                                    :credit-card="attrs.credit_card"
                                    :user="user"
                                    :property="property"
                                />
                                </template>
                            </stripe-credit-card>
                           
                        </v-col>
                    </v-row>
                    
                </v-tab-item>

                <v-tab-item>
                    <v-card
                    flat
                    >
                        <v-card-text>
                            <reservation-charges :reservation="reservation" :property="property" :refresh="refreshCharges">
                                <template v-slot:options="props">
                                    <reservation-charge-refund v-bind="props" @refunded="(refund) => props.updateCharge(refund.charge)" />
                                    <reservation-charge-capture v-bind="props" @captured="(charge) => props.updateCharge(charge)" />
                                </template>
                            </reservation-charges>
                        </v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item>
                    <v-card
                    flat
                    v-if="checkin"
                    >
                        <v-card-text>
                            <v-list v-if="checkin.checkin.questions &&  checkin.checkin.questions.length">
                                <v-list-item v-for="(question, q) in checkin.checkin.questions" :key="q">
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
                </v-tab-item>

                <v-tab-item>
                    <v-card
                    flat
                    v-if="checkin"
                    >
                        <v-card-text>
                            <v-list v-if="checkin.checkin.agreements &&  checkin.checkin.agreements.length">
                                <v-list-item v-for="(agreement, i) in checkin.checkin.agreements" :key="i">
                                    <v-list-item-icon>
                                        <v-icon>mdi-handshake</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ agreement.agreement }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle v-if="agreement.link && agreement.link !== ''">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <a
                                                        target="_blank"
                                                        :href="agreement.link"
                                                        @click.stop
                                                        v-on="on"
                                                    >
                                                        Read agreement
                                                    </a>
                                                </template>
                                                Opens in new window
                                            </v-tooltip>
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <div v-else class="my-5 grey--text text-center">
                                No agreement for the reservation
                            </div>
                        </v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item>
                    <v-card
                    flat
                    >
                        <v-card-text>
                            <div class="text-center mt-5" v-if="reservation.instruction">
                                {{reservation.instruction}}
                            </div>
                            <div class="text-center mt-5" v-else>
                                No checkin instruction
                            </div>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                
            </v-tabs-items>

            <div class="text-center text-md-right">
                <v-btn fixed bottom v-if="!checkin.reservation.approved" 
                    color="success"
                    @click="$refs.approvalConfirmation.open()"
                    :loading="approval.loading"
                    :disabled="!canApprove"
                    class="my-7"
                >
                  <v-icon class="mr-2">mdi-check-circle</v-icon>  Approve checkin
                </v-btn>
            </div>
        </template>
        <template v-else>
            <v-alert
                border="top"
                colored-border
                elevation="2"
                type="error"
                class="mt-5">
                    No checkin information
                </v-alert>
        </template>
    </data-container>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

import GETRESERVATION_CHECKIN from '../Queries/getReservationCheckin';
import APPROVERESERVATION_CHECKIN from '../Mutations/approveReservationCheckin';

import DataContainer from '../../../components/DataContainer'
import VerificationReport from '../../User/Components/VerificationReport.vue';
import ReservationChargeCapture from '../Components/ReservationChargeCapture';
import ReservationChargeRefund from '../Components/ReservationChargeRefund';
import ReservationCharges from './Checkin/ReservationCharges';
import StripeCreditCard from '../../../components/Utilities/StripeCreditCard'
import ConfirmationDialog from '@/components/Utilities/ConfirmationDialog';
import ReservationExtraCharge from '../Components/ReservationExtraCharge'
import ReservationPayments from '../Components/ReservationPayments'

export default {
    name: "PropertyReservationCheckin",
    components: {
        DataContainer,
        ReservationChargeCapture,
        ReservationChargeRefund,
        VerificationReport,
        ReservationCharges, 
        StripeCreditCard,
        ConfirmationDialog,
        ReservationExtraCharge,
        ReservationPayments
    },
    data(){

        return {
            tab: null,
            checkin: null,
            loading: false,
            approval: {
                loading: false,
            },
            refreshCharges: false,
        }
    },

    computed: {
        user(){
            return this.checkin ? this.checkin.user : null
        },
        userVerification(){
            if(this.checkin && this.checkin.verifications && this.checkin.verifications.length){
                return  this.checkin.verifications[this.checkin.verifications.length - 1];
            }
            return {}
        },
        canApprove(){
            return this.user !== null
        }
    },

    props: {
        reservation: Object,
        property: Object,
    },

    methods: {
        ...mapActions([
            'query',
            'mutate'
        ]),
        ...mapMutations([
            'TOAST_ERROR'
        ]),

        getReservationCheckin(){
            this.loading = true;
            this.query({
                query: GETRESERVATION_CHECKIN,
                variables: {
                    id: this.reservation.id
                }
            })
            .then(response => {
                this.checkin = response.data.getReservationCheckin;
                if(!this.checkin.user){
                    this.$store.commit('SNACKBAR', {
                        status: true,
                        text: "The user account that checked in no longer exist",
                        color: "error"
                    })
                    return;
                }
            })
            .catch(e => {
                this.$refs.app.toastError({
                    message: `Could not get reservation checkin information.`,
                    retry: () => {
                        this.getReservationCheckin()
                    },
                    exception: e
                });
            })
            .finally(() => {
                this.loading = false;
            })
        },

        approveCheckin(){
            this.approval.loading = true;

            this.mutate({
                mutation: APPROVERESERVATION_CHECKIN,
                variables: {id: this.checkin.reservation.id}
            })
            .then(response => {
                this.checkin.reservation = response.data.approveReservationCheckin;
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: "Checkin Approved",
                    color: "success"
                })
                this.$emit('approved', response.data.approveReservationCheckin);
            })
            .catch(e => {
               this.TOAST_ERROR({
                    show: true,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.approveCheckin();
                        })
                    },
                    message: 'Could not approve reservation checkin. ',
                    exception: e
                });
                this.$emit('error', e);
            })
            .finally(() => {
                this.approval.loading = false;
            })
        }
    },

    watch: {
        reservation: {
            immediate: true,
            handler(reservation){
                if(reservation) this.getReservationCheckin();
            }
        }
    }
}

</script>