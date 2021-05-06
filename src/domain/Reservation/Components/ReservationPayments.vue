<template>

<div>
    <v-dialog 
        v-model="selectedPaymentDialog"
        width="500"
    >
    <v-card>
         <v-card-title class="headline">
            <span>Card payment</span>
        </v-card-title>
        <v-card-text>
            <stripe-credit-card :card="creditCard" class="mb-2" />
            <template v-if="payment" >
                <p>{{ payment.description }}</p>
                <v-row justify="center" align="center">
                    <v-col cols="12" md="5" class="mb-5 mb-md-0">
                        <h1>{{ payment.amount | cents }}</h1>
                    </v-col>
                    <v-col cols="12" md="7">
                        <v-list>
                            <v-list-item>
                                <v-list-item-icon >
                                    <v-icon color="success">mdi-check-circle</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ payment.amount_captured | cents }} Captured
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon color="warning">mdi-credit-card-refund</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title >
                                        {{ payment.amount_refunded | cents }} Refunded
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon color="info">mdi-credit-card</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title >
                                        {{ payment.net_captured | cents }} at hand
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>

                        <refund 
                            v-if="canRefund"
                            :property="property"
                            :reservation="reservation"
                            :payment="payment"
                            @refunded="paymentRefunded"
                        />
                    </v-col>
                </v-row>
            </template>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="selected = null" text>Back</v-btn>
        </v-card-actions>
    </v-card>

    </v-dialog>

    <v-dialog
        v-model="dialog"
        width="600"
        scrollable
        persistent
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            >
            <slot>Payments</slot>
            </v-btn>
        </template>
        <v-card>
            <v-card-title class="headline">
                <span>Payments with card</span>
            </v-card-title>
            <v-card-text >
                <stripe-credit-card :card="creditCard" class="mb-2" />
                <data-container :loading="loading">
                    <template #loading>
                        <v-skeleton-loader
                        v-for="i in 4" :key="i"
                            type="list-item-three-line, divider"
                            ></v-skeleton-loader>
                    </template>
                    <v-list v-if="payments.length">
                        <v-list-item-group
                            v-model="selected"
                            active-class="primary white--text"
                        >
                            <v-list-item three-line v-for="payment in payments" :key="payment.id">
                                <v-list-item-icon>
                                    <v-icon color="success">mdi-contactless-payment-circle</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{  payment.amount | cents }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ payment.description }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>

                               <v-list-item-action v-if="!payment.metadata.charge_id">
                                <v-list-item-action-text>Extra charge</v-list-item-action-text>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon  v-on="on" color="warning">
                                                mdi-information
                                            </v-icon>
                                        </template>
                                        This charge was not set for the reservation initially
                                    </v-tooltip>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                    <div v-else class="py-5 grey--text text-center">
                        No payment for the reservation with the card
                    </div>
                </data-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" @click="dialog = false" text>Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>    

</div>

</template>

<script>
import DataContainer from '../../../components/DataContainer.vue';
import StripeCreditCard from '../../../components/Utilities/StripeCreditCard';
import Refund from './ReservationChargeRefund'
import GET_RESERVATION_PAYMENTS from '../Queries/getReservationPayments';

export default
{
    name: "ReservationPayments",
    components: { DataContainer, StripeCreditCard, Refund }, 
    data(){
        return {
            dialog: false,
            selectedPaymentDialog: false,
            loading: false,
            payments: [],
            selected: null
        }
    },
    computed: {
        payment(){
            if(this.selected === null) return null;
            return this.payments[this.selected]
        }
    },
    props: {
        reservation: Object,
        property: Object,
        creditCard: Object,
        canRefund: {
            type: Boolean,
            default: () => false
        }
    },

    filters: {
        cents(amount){
            return `USD${amount/100}`;
        }
    },

    methods: {
        getPayments(){
            this.loading = true;
            this.$store.dispatch('query', {
                query: GET_RESERVATION_PAYMENTS,
                variables: {
                    id: this.reservation.id
                }
            })
            .then(response => {
                this.payments = response.data.getReservationPayments;
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: `Could not get payments.`,
                    retry: () => this.getPayments(),
                    exception: e
                });
            })
            .finally(() => {
                this.loading = false;
            })
        },

        paymentRefunded(refund){
            this.payments = this.payments.map(payment => {
                if(payment.id == refund.charge.id) return refund.charge
                return payment;
            })
        }
    },
    watch: {
        dialog: {
            immediate: true,
            handler(dialog){
                if(dialog) this.getPayments();
            }
        },
        selected: {
            immediate: true,
            handler(payment){
                if(payment !== null) this.selectedPaymentDialog = true;
                else this.selectedPaymentDialog = false;
            }
        }
    }
}
</script>