<template>
    <div>
        <slot name="heading" />
        <data-container v-if="property" :loading="loading">
                <template v-slot:loading>
                    <v-skeleton-loader
                        type="card"
                        height="40"
                    ></v-skeleton-loader>
                </template>
                <template v-if="product">
                    <template  v-if="!subscription">
                         <confirmation-dialog ref="subscriptionConfirmation" @confirmed="createSubscription">
                            <div class="text-center">
                                <h2 class="my-5">You will be charged {{ plan.amount | money_value }} for {{ plan.interval_count }} {{ plan.interval }}</h2>
                                <p class="my-5">Do you want to proceed ?</p>
                            </div>
                        </confirmation-dialog>
                        <v-row justify="center" align="center">
                            <v-col cols="12" md="4" >
                                <div class="text-center" v-if="!subscriptionWasCanceled">
                                    <h4 class="my-2 grey--text">Try {{ product.name }}</h4>
                                    <h1 class="my-5">{{ plan.trial_period_days }} day<span v-show="plan.trial_period_days > 1">s</span> free</h1>
                                    <h4 class="my-2 grey--text">{{ monthlyPrice | money_value }}/month</h4>
                                </div>
                                <div v-else class="text-center">
                                    <h1 class="my-5">{{ monthlyPrice | money_value }}/month</h1>
                                </div>
                            </v-col>
                            <v-col cols="12" md="8">
                                <h4 class="mb-5 grey--text">Enter payment details</h4>
                                <v-card :disabled="subscribing" :loading="subscribing">
                                    <v-card-text>
                                        <stripe-credit-card-form
                                            v-if="!cards.length"
                                            ref="stripeCreditCard" 
                                            :publishable-key="stripePublishableKey" 
                                            :token-callback="stripeTokenCallback"
                                            @success="tokenCallbackSuccessfull"
                                            @error="tokenCallbackError"
                                            @abort="tokenCallbackAborted"
                                            >
                                            <template v-if="subscriptionWasCanceled" #submit-btn-text>Subscribe</template>
                                            <template v-else #submit-btn-text>Start trial</template>
                                        </stripe-credit-card-form>

                                        <div v-else class="">
                                            <p>Select a credit card</p>
                                            <stripe-credit-card outlined class="my-2" v-for="card in cards" :key="card.id" :card="card">
                                                <template #actions>
                                                    <v-btn sm color="primary" @click="creditCard = card">
                                                        Use card
                                                    </v-btn>
                                                    <v-spacer></v-spacer>
                                                    <v-icon v-if="creditCard && card.id == creditCard.id" size="40" color="success">mdi-check-circle</v-icon>
                                                </template>
                                            </stripe-credit-card>
                                            <v-btn class="mt-5" color="primary" @click="$refs.subscriptionConfirmation.open()" :disabled="creditCard == null" :loading="subscribing">
                                                Subscribe
                                            </v-btn>
                                        </div>
                                    </v-card-text>
                                </v-card>
                                <p v-if="!subscriptionWasCanceled" class="grey--text text-center mt-5">After your trial ends, you will be charged {{ plan.amount | money_value }} per <span v-show="plan.interval_count > 1">{{ plan.interval_count }}</span> {{ plan.interval }} starting {{ trialEndsOn | timestamp_to_date('day mName, year')  }}. You can always cancel before then.</p>
                                <p v-else class="grey--text text-center mt-5">You will be charged {{ plan.amount | money_value }} per <span v-show="plan.interval_count > 1">{{ plan.interval_count }}</span> {{ plan.interval }}</p>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-else >
                        <confirmation-dialog ref="cancelConfirmation" @confirmed="cancelSubscription">
                            <div class="text-center">
                                Are you sure you want to cancel your subscription. 
                                You will no longer be eligible for free trial if you decide to subscribe again.
                            </div>
                        </confirmation-dialog>
                        <confirmation-dialog ref="cancelSubsequentConfirmation" @confirmed="cancelSubsequentSubscription">
                            <div class="text-center">
                                Are you sure you want to cancel at the end of current subscription. 
                                You will no longer be able to use the service from {{ subscription.current_period_end | timestamp_to_date('day mName, year')  }}
                            </div>
                        </confirmation-dialog>

                        <v-row justify="center"> 
                            <v-col cols="12" sm="8" md="6">
                                <v-card flat :disabled="subscribing" :loading="subscribing">
                                    <v-card-text v-if="subscription.status == 'trialing'">
                                        <div class="text-center">
                                            <h1 class="my-3">On Trial</h1>
                                            <p class="my-3 grey--text">until {{ subscription.trial_end | timestamp_to_date('day mName, year. diff') }}</p>
                                        </div>
                                    </v-card-text>
                                    <v-card-text v-else>
                                        <div class="text-center">
                                            <p class="my-5"> status: </p>
                                            <h1 class="my-5"><span class="text-uppercase"> {{ subscription.status | replace_underscore }} </span></h1>
                                            <p class="my-5">{{ subscription.current_period_start | timestamp_to_date('day mName, year') }} -  {{ subscription.current_period_end | timestamp_to_date('day mName, year') }}</p>
                                            <p class="my-3">{{ subscription.current_period_end | timestamp_to_date('diff') }}</p>
                                        </div>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn v-if="subscription.status === 'trialing'" small text color="error" @click="$refs.cancelConfirmation.open()">Cancel subscription</v-btn>
                                        <v-btn v-else-if="subscription.status === 'active' && !subscription.cancel_at_period_end" small text color="error" @click="$refs.cancelSubsequentConfirmation.open()">Cancel after current subscription</v-btn>
                                    </v-card-actions>
                                </v-card>
                                <v-alert v-if="subscription.cancel_at_period_end"
                                     border="top"
                                    colored-border
                                    elevation="2"
                                    type="info"
                                >
                                    Your subscription is set to cancel on {{ subscription.current_period_end | timestamp_to_date('day mName, year') }}
                                </v-alert>
                            </v-col>
                        </v-row>
                    </template>
                </template>
        </data-container>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import helper from '../../../helper';
import DataContainer from '../../../components/DataContainer.vue';
import StripeCreditCard from '../../../components/Utilities/StripeCreditCard.vue';
import StripeCreditCardForm from '../../../components/Utilities/StripeCreditCardForm.vue';
import ConfirmationDialog from '../../../components/Utilities/ConfirmationDialog.vue'

import GET_PROPERTY_AS_CUSTOMER from '../Queries/getPropertyAsCustomer';
import GET_PROPERTY_SUBSCRIPTION from '../Queries/getPropertySubscription';
import GET_SUBSCRIPTION_PLAN from '../Queries/getSubscriptionPlan';

import CREATE_PROPERTY_AS_CUSTOMER from '../Mutations/createPropertyAsCustomer';
import CREATE_PROPERTY_SUBSCRIPTION from '../Mutations/createPropertySubscription';
import CANCEL_PROPERTY_SUBSCRIPTION from '../Mutations/cancelPropertySubscription';
import UPDATE_PROPERTY_SUBSCRIPTION from '../Mutations/updatePropertySubscription';

export default {
    name: "PropertySubscription",
    components: {
        DataContainer, StripeCreditCard, StripeCreditCardForm, ConfirmationDialog
    },
    props: {
        property: Object,
    },
    data(){
        return {
            loading: true,
            subscribing: false,
            subscription: null,
            customer: null,
            plan: null,
            creditCard: null
        }
    }, 

    computed: {

        stripePublishableKey(){
            return process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
        },

        cards(){
            return this.customer && this.customer.sources ? this.customer.sources.data : []
        },

        product(){
            return this.plan && this.plan.product ? this.plan.product : null
        },

        monthlyPrice(){
            if(this.plan){
                if(this.plan.interval == 'year') return this.plan.amount/(12 * this.plan.interval_count)
                if(this.plan.interval == 'month') return this.plan.amount/this.plan.interval_count
            }
            return 0;
        },

        trialEndsOn(){
            if(!this.plan) return helper.nowTimestamp();
            return helper.nowTimestamp() + (this.plan.trial_period_days * 60 * 60 * 24);
        },

        subscriptionWasCanceled(){
            return this.property.subscription && this.property.subscription.status === 'canceled'
        }

    },

    methods: {

        ...mapActions([
            'query', 'mutate'
        ]),

        getSubscription(){

            this.loading = true;

            this.query({
                query: GET_SUBSCRIPTION_PLAN,
                
            })
            .then(response => {
                this.plan = response.data.getSubscriptionPlan

                return this.$store.dispatch('query', {
                    query: GET_PROPERTY_AS_CUSTOMER,
                    variables: {
                        property_id: this.property.id
                    }
                })
            })
            .then(response => {
                this.customer = response.data.getPropertyAsCustomer;

                return this.$store.dispatch('query', {
                    query: GET_PROPERTY_SUBSCRIPTION,
                    variables: {
                        property_id: this.property.id,
                    }
                })
            })
            .then(response => {
                this.subscription = response.data.getPropertySubscription
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => this.getSubscription(),
                    message: 'Could not get subscription',
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },

        createSubscription(){
            if(this.customer && this.customer.customer && this.creditCard){
                this.subscribing = true;

                this.mutate({
                    mutation: CREATE_PROPERTY_SUBSCRIPTION,
                    variables: {
                        property_id: this.property.id,
                        customer_id: this.customer.customer.id,
                        credit_card_id: this.creditCard.id
                    }
                })
                .then(response => {
                    this.subscription = response.data.createPropertySubscription
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: "Subscription successful",
                        color: "success"
                    })
                })
                .catch(e => {
                    this.$store.commit('TOAST_ERROR', {
                        show: true,
                        retry: () => this.createSubscription(),
                        message: 'Subscription failed',
                        exception: e
                    })
                })
                .finally(() => {
                    this.subscribing = false;
                })
            }else{
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "Cannot subscribe",
                    color: "error"
                })
            }
        },

        updateSubscription(update){
                this.subscribing = true;

                this.mutate({
                    mutation: UPDATE_PROPERTY_SUBSCRIPTION,
                    variables: {
                        property_id: this.property.id,
                        update
                    }
                })
                .then(response => {
                    this.subscription = response.data.updatePropertySubscription
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: "Subscription updated",
                        color: "success"
                    })
                })
                .catch(e => {
                    this.$store.commit('TOAST_ERROR', {
                        show: true,
                        retry: () => this.updateSubscription(),
                        message: 'Subscription update failed',
                        exception: e
                    })
                })
                .finally(() => {
                    this.subscribing = false;
                })
        },

        cancelSubscription(){
            this.subscribing = true;

             this.mutate({
                mutation: CANCEL_PROPERTY_SUBSCRIPTION,
                variables: {
                    property_id: this.property.id,
                }
            })
            .then(response => {
                this.subscription = response.data.cancelPropertySubscription

                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "Subscription cancelled",
                    color: "success"
                })
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => this.cancelSubscription(),
                    message: 'Subscription failed',
                    exception: e
                })
            })
            .finally(() => {
                this.subscribing = false;
            })
        },

        cancelSubsequentSubscription(){
           this.updateSubscription({
               cancel_at_period_end: true
           })
        },

        stripeTokenCallback(token){
            return new Promise((resolve, reject) => {
                this.subscribing = true
                this.mutate({
                    mutation: CREATE_PROPERTY_AS_CUSTOMER,
                    variables: {
                        property_id: this.property.id,
                        source: token
                    }
                })
                .then(response => {
                    resolve(response.data.createPropertyAsCustomer)
                })
                .catch(e => {
                    reject(e)
                })
                .finally(() => {
                    this.subscribing = false;
                })
            })
        },

        tokenCallbackSuccessfull(data){
            this.customer = data;
            this.creditCard = this.cards[0];
            this.createSubscription();
        },

        tokenCallbackError(e){
            this.$store.commit('SNACKBAR', {
                status: true,
                color: 'error',
                text: `${e.message}`
            })
        },

        tokenCallbackAborted(card){
            
        },

    },

    watch: {
        property: {
            immediate: true,
            handler(property){
                if(property) this.getSubscription();
                else this.loading = true;
            }
        },
        subscription: {
            immediate: true,
            handler(subscription){
                if(subscription){
                    this.$store.commit('UPDATE_USER_PROPERTY', {
                        ...this.property, active: subscription.status == 'active' || subscription.status == 'trialing'
                    });
                }
            }
        }
    }
}
</script>