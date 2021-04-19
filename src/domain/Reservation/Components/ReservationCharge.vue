<template>
    <div>
        <v-list-item class="py-2">
            <v-list-item-content>
                <v-list-item-title> {{ charge.title  }} </v-list-item-title>
                <v-list-item-subtitle>{{ charge.description }}</v-list-item-subtitle>
            </v-list-item-content>
            <div>
                <h4 class="mt-2">{{ [currency, charge.amount].join('') }}</h4>
                <v-chip v-if="paid" pill color="green" text-color="white">
                    Paid
                </v-chip>
                <v-btn v-else-if="isMyReservation" btn color="primary" :loading="loading" @click="payCharge()">Pay</v-btn>
            </div>
        </v-list-item>
        <stripe-payment
                ref="stripePayment" 
                :publishable-key="stripePublishableKey" 
                :amount="charge.amount"
                :currency="currency"
                @success="paymentSuccessful"
                @error="paymentError"
            />
    </div>
</template>

<script>

import StripePayment from '../../../components/Utilities/StripePayment.vue';
import CREATE_PAYMENT_INTENT from '../../Services/Payment/Mutations/createStripePaymentIntent';

export default {
    name: "ReservationCharge",
    components: {
        StripePayment
    },
    data(){
        return {
            loading: false,
            currency: 'USD',
            paid: false,
        }
    },

    computed: {
        isMyReservation(){
            return this.reservation.user_id == this.$store.getters.current_user.profile.id
        },

        stripePublishableKey(){
            return process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
        },

        property(){
            return this.reservation.property
        }
    },

    props: {
        stripeAuth: Object,
        reservation: Object,
        charge:Object,
        payments: Array,
    },
    methods: {
        payCharge(){
            if(!this.stripeAuth) {
                this.$store.commit('SNACKBAR', {
                    status: true,
                    color: 'error',
                    text: 'Payment cannot be processed at the moment'
                })
                return;
            }

            this.loading = true;
            
            this.$store.dispatch('mutate', {
                mutation: CREATE_PAYMENT_INTENT,
                variables: {
                    stripe_account: '',
                    amount: this.charge.amount,
                    currency: 'USD',
                    payment_method_types: ['card'],
                    metadata: {
                        user_id: this.$store.getters.current_user.profile.id,
                        property_id: this.property.id,
                        reservation_id: this.reservation.id,
                        charge_id: this.charge.id
                    }
                }
            }).then(response => {
                this.$refs.stripePayment.open(response.data.createStripePaymentIntent);
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.payCharge();
                        })
                    },
                    message: 'Payment failed ',
                    exception: e
                });
                this.$emit('error', e);
            })
            .finally(() => {
                this.loading = false;
            })
        },

        paymentSuccessful(){
            this.$store.commit('SNACKBAR', {
                status: true,
                color: 'success',
                text: `Payment for ${this.charge.title} successful`
            })

            this.$refs.stripePayment.close();
            this.paid = true;
        },

        paymentError(e){
            this.$store.commit('SNACKBAR', {
                status: true,
                color: 'error',
                text: `Payment for ${this.charge.title} failed. ${e.message}`
            })
        }
    },

    watch: {
        charge: {
            immediate: true,
            handler(charge){
                if(charge){
                    this.paid = this.payments.find(p => p.metadata.charge_id == charge.id) ? true : false
                }
            }
        }
    }
}
</script>