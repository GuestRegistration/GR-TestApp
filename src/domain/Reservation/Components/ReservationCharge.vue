<template>
    <div class="py-2">
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title> {{ charge.title  }} <span v-show="charge.optional"> (optional) </span> </v-list-item-title>
                <v-list-item-subtitle>{{ charge.description }}</v-list-item-subtitle>
                
            </v-list-item-content>
            <h4 class="mt-2">{{ [currency, charge.amount].join('') }}</h4>
        </v-list-item>
        <div class="my-2">
            <div v-if="stripe_charge" class="d-flex">
                <v-chip pill :color="status.color" text-color="white">
                    {{ status.text }}
                </v-chip>
                <v-chip v-if="amountRefunded" pill color="info" text-color="white" class="ml-2">
                    Refunded {{ amountRefunded }}
                </v-chip>
                <v-spacer></v-spacer>
                <slot name="options" v-bind="{ property, reservation, charge, payment: stripe_charge, updateCharge }" />
            </div>
            <v-btn v-else-if="canPay" btn color="primary" :loading="loading" @click="payCharge()">{{ !isPreAuthorized ? 'Pay Now' : 'Authorize charge' }}</v-btn>
        </div> 
        <slot v-bind="{ property, reservation, charge, payment: stripe_charge}" />
    </div>
</template>

<script>

import CREATE_RESERVATION_CHARGE from '../Mutations/createReservationCharge';

export default {
    name: "ReservationCharge",
    components: {
        
    },
    data(){
        return {
            loading: false,
            currency: 'USD',
            stripe_charge: null
        }
    },

    computed: {
        isMyReservation(){
            return this.reservation.user_id == this.$store.getters.current_user.profile.id
        },

        stripePublishableKey(){
            return process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
        },
        
        isPreAuthorized(){
            return this.charge.type === 'pre-authorize'
        },

        amountRefunded(){
            if(!this.stripe_charge) return null;
            if(!this.stripe_charge.amount_refunded) return null;

            return `${this.stripe_charge.currency.toUpperCase()}${this.stripe_charge.amount_refunded/100}`;
        },

        status(){
            if(this.stripe_charge){

                if(this.stripe_charge.captured) {
                    return {
                        color: "success",
                        text: this.isPreAuthorized ? `Captured ${this.stripe_charge.currency.toUpperCase()}${this.stripe_charge.amount_captured/100}` : `Paid ${this.stripe_charge.currency.toUpperCase()}${this.stripe_charge.amount_captured/100}`,
                    }
                }

                return {
                        color: "success",
                        text: `Authorized ${this.stripe_charge.currency.toUpperCase()}${this.stripe_charge.amount/100}`,
                    }
            }

            return {
                color: "error",
                text: this.isPreAuthorized ? "Not Authorized" : "Not Paid"
            }
        },

        creditCardAvailable(){
            return this.creditCard ? true : false
        }

    },

    props: {
        reservation: Object,
        property: Object,
        payment: Object,
        charge:Object,
        canPay: Boolean,
        creditCard: Object
    },
    methods: {
        payCharge(){
            if(!this.creditCardAvailable) {
                this.$store.commit('SNACKBAR', {
                    status: true,
                    color: 'error',
                    text: `No credit card to use`,
                })
                return;
            }
            this.loading = true;

             const variables = {
                    property_id: this.property.id,
                    amount: this.charge.amount * 100,
                    currency: 'USD',
                    source: this.creditCard.id,
                    customer: this.creditCard.customer,
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
                    mutation: CREATE_RESERVATION_CHARGE,
                    variables
                })
                .then(response => {
                    this.paymentSuccessful(response.data.createReservationCharge)
                })
                .catch(e => {
                    this.paymentError(e)
                })
                .finally(() => {
                    this.loading = false;
                })
        },


        paymentSuccessful(stripeCharge){
            this.$store.commit('SNACKBAR', {
                status: true,
                color: 'success',
                text: `${this.isPreAuthorized ? 'Authorization' : 'Payment'} of ${stripeCharge.currency.toUpperCase()} ${stripeCharge.amount/100} for ${this.charge.title} successful`
            })

            this.stripe_charge = stripeCharge;
            this.$emit('payment', stripeCharge)
        },

        paymentError(e){
            this.$store.commit('SNACKBAR', {
                status: true,
                color: 'error',
                text: `Payment for ${this.charge.title} failed. ${e.message}`
            })
        },

        updateCharge(charge){
            this.stripe_charge = charge;
        },
    },

    watch: {
        payment: {
            immediate: true,
            handler(payment){
                this.stripe_charge = payment;
            }
        }
    }
}
</script>