<template>
    <div class="py-2">
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title> {{ charge.title  }} <span v-show="charge.optional"> (optional) </span> </v-list-item-title>
                <v-list-item-subtitle>{{ charge.description }}</v-list-item-subtitle>
                
            </v-list-item-content>
            <h4 class="mt-2">{{ [currency, charge.amount].join('') }}</h4>
        </v-list-item>
        <div class="text-right my-2">
            <div v-if="payment">
                <v-chip pill color="green" text-color="white">
                    {{ !isPreAuthorized ? 'Paid' : 'Authorized' }}
                </v-chip>
                <p>Payment Status: {{ payment.status }}</p>
                <p>Captured: {{ payment.captured ? `YES, ${payment.currency.toUpperCase()} ${payment.amount_captured/100}` : 'NO' }}</p>
            </div>
            <v-btn v-else-if="isMyReservation" btn color="primary" :loading="loading" @click="payCharge()">{{ !isPreAuthorized ? 'Pay Now' : 'Authorize charge' }}</v-btn>
        </div> 
        <slot v-bind="{ stripeAuth, reservation, charge, payment: payments.find(p => p.metadata.charge_id === charge.id) }" />
        <stripe-payment
                ref="stripePayment" 
                :publishable-key="stripePublishableKey" 
                :amount="charge.amount"
                :currency="currency"
                :charge-callback="stripeChargeCallBack"
                :pre-authorize="isPreAuthorized"
                @success="paymentSuccessful"
                @error="paymentError"
                @abort="paymentAborted"
            />
    </div>
</template>

<script>

import StripePayment from '../../../components/Utilities/StripePayment.vue';
import CREATE_STRIPE_CHARGE from '../../Services/Payment/Mutations/createStripeCharge';

export default {
    name: "ReservationCharge",
    components: {
        StripePayment
    },
    data(){
        return {
            loading: false,
            currency: 'USD',
            payment: null,
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
        },
        
        isPreAuthorized(){
            return this.charge.type === 'pre-authorize'
        }

    },

    props: {
        stripeAuth: Object,
        reservation: Object,
        charge:Object,
        payments: Array
    },
    methods: {
        payCharge(){
            if(!this.stripeAuth) {
                this.$store.commit('SNACKBAR', {
                    status: true,
                    color: 'error',
                    text: `${this.property.name} can not process your payment at the moment`,
                })
                return;
            }
            this.$refs.stripePayment.open();

            this.loading = true;
        },

        stripeChargeCallBack(token){

            return new Promise((resolve, reject) => {
                const variables = {
                    stripe_account: this.stripeAuth.stripe_user_id,
                    amount: this.charge.amount * 100,
                    currency: 'USD',
                    source: token,
                    description: `${this.isPreAuthorized ? 'Authorization' : 'Payment'} for ${this.charge.title} at ${this.property.name} by ${[this.$store.getters.current_user.profile.name.first_name, this.$store.getters.current_user.profile.name.last_name].join(' ')}`,
                    capture: !this.isPreAuthorized,
                    metadata: {
                        user_id: this.$store.getters.current_user.profile.id,
                        property_id: this.property.id,
                        reservation_id: this.reservation.id,
                        charge_id: this.charge.id
                    }
                }

                if(this.$store.getters.current_user.profile.email){
                    variables.receipt_email = this.$store.getters.current_user.profile.email
                }else if(this.$store.getters.current_user.auth.email){
                    variables.receipt_email = this.$store.getters.current_user.auth.email
                }

                this.$store.dispatch('mutate', {
                    mutation: CREATE_STRIPE_CHARGE,
                    variables
                })
                .then(response => {
                    resolve(response.data.createStripeCharge)
                })
                .catch(e => {
                    reject(e)
                })
            })

        },

        paymentSuccessful(stripeCharge){
            this.$store.commit('SNACKBAR', {
                status: true,
                color: 'success',
                text: `${this.isPreAuthorized ? 'Authorization' : 'Payment'} of ${stripeCharge.currency.toUpperCase()} ${stripeCharge.amount/100} for ${this.charge.title} successful`
            })

            this.$refs.stripePayment.close();
            this.payment = stripeCharge;
            this.$emit('payment', stripeCharge)
            this.loading = false;
        },

        paymentError(e){
            this.$store.commit('SNACKBAR', {
                status: true,
                color: 'error',
                text: `Payment for ${this.charge.title} failed. ${e.message}`
            })
            this.loading = false;
        },

        paymentAborted(){
            this.$store.commit('SNACKBAR', {
                status: true,
                color: 'info',
                text: `Payment for ${this.charge.title} aborted`
            })
            this.loading = false;
        }
    },

    watch: {
        charge: {
            immediate: true,
            handler(charge){
                if(charge){
                    this.payment = this.payments.find(p => p.metadata.charge_id == charge.id);
                }
            }
        }
    }
}
</script>