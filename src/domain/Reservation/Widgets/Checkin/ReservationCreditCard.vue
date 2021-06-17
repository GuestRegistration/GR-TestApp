<template>
    <data-container :loading="loading">
        <confirmation-dialog ref="confirmation" @confirmed="confirmation.action()">
            {{ confirmation.text }}
        </confirmation-dialog>
        <template v-if="property.stripe_connected">
            <div v-if="cards.length">
                <v-radio-group 
                    v-model="creditCard" 
                    :label="`Your credit card at ${property.name}`"
                    :rules="[(value) => !value ? 'Select a credit card' : true]"
                    >
                        <v-radio
                            v-for="(card, c) in cards" :key="c"
                            :value="card"
                        >
                            <template #label>
                                <div class="pr-2" style="width: 100%">
                                    <stripe-credit-card class="my-1" :card="card" >
                                        <template #actions="attr">
                                            <v-spacer></v-spacer>
                                            <v-btn icon @click="confirmCardRemoval(attr.card)">
                                                <v-icon small color="red">mdi-delete</v-icon>
                                            </v-btn>
                                        </template>
                                    </stripe-credit-card>
                                </div>
                            </template>
                        </v-radio>
                    </v-radio-group>
                    <a href="#" @click.prevent="addCard = !addCard">Use another card </a>
            </div>
            <div v-if="addCard">
                <stripe-credit-card-form
                    ref="stripeCreditCard" 
                    :publishable-key="stripePublishableKey" 
                    :token-callback="stripeTokenCallback"
                    @success="tokenCallbackSuccessfull"
                    @error="tokenCallbackError"
                    @abort="tokenCallbackAborted"
                >
                <template #submit-btn-text> Add card </template>
                </stripe-credit-card-form>
            </div>
        </template>
         <v-alert v-else
            border="top"
            colored-border
            elevation="2"
            type="error">
            {{ property.name }} can not process credit card at the moment
        </v-alert>
    </data-container>
</template>

<script>
import { mapActions } from 'vuex';

import DataContainer from '../../../../components/DataContainer.vue';
import StripeCreditCard from '../../../../components/Utilities/StripeCreditCard.vue';
import StripeCreditCardForm from '../../../../components/Utilities/StripeCreditCardForm.vue';
import ConfirmationDialog from '../../../../components/Utilities/ConfirmationDialog.vue'

import CREATE_PROPERTY_CUSTOMER from '../../../Property/Mutations/createPropertyCustomer';
import GET_PROPERTY_CUSTOMER from '../../../Property/Queries/getPropertyCustomer';
import ADD_PROPERTY_CUSTOMER_CREDIT_CARD from '../../../Property/Mutations/addPropertyCustomerCreditCard';
import REMOVE_PROPERTY_CUSTOMER_CREDIT_CARD from '../../../Property/Mutations/removePropertyCustomerCreditCard';

export default {
    name: "ReservationCreditCard",
    data(){
        return {
            loading: false,
            customer: null,
            addCard: false,
            creditCard: null,
            confirmation: {
                text: String,
                action: Function
            }
        }
    },
    components: {
        DataContainer, StripeCreditCard, StripeCreditCardForm,
        ConfirmationDialog
    },

    props: {
        reservation: Object,
        property: Object,
    },

    computed: {
        stripePublishableKey(){
            return process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
        },

        cards(){
            return this.customer && this.customer.sources  && this.customer.sources.data ? this.customer.sources.data : []
        }
    },

    methods: {
        ...mapActions([
            'query', 'mutate'
        ]),

        getPropertyCustomer(){
            if(!this.property.stripe_connected) return;
            this.loading = true;
            this.query({
                query: GET_PROPERTY_CUSTOMER,
                variables: {
                    property_id: this.reservation.property_id,
                }
            })
            .then(response => {
                this.customer = response.data.getPropertyCustomer;

                if(!this.cards.length) this.addCard = true;
                else this.creditCard = this.cards[0];

            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: ``,
                    retry: () => this.getPropertyCustomer(),
                    exception: e
                });
            })
            .finally(() => {
                this.loading = false
            })
        },

        stripeTokenCallback(token){

            if(this.customer.customer){
                return new Promise((resolve, reject) => {
                    this.mutate({
                        mutation: ADD_PROPERTY_CUSTOMER_CREDIT_CARD,
                        variables: {
                            property_id: this.property.id,
                            customer_id: this.customer.customer.id,
                            source: token
                        }
                    })
                    .then(response => {
                        resolve(response.data.addPropertyCustomerCreditCard)
                    })
                    .catch(e => {
                        reject(e)
                    })
                })
            }

            return new Promise((resolve, reject) => {
                const variables = {
                    property_id: this.reservation.property_id,
                    user_id: this.$store.getters.current_user.profile.id,
                    source: token,
                    description: `New customer from reservation checkin into ${this.property.name}`,
                    name: [this.$store.getters.current_user.profile.name.first_name, this.$store.getters.current_user.profile.name.last_name].join(' '),
                }

                if(this.$store.getters.current_user.profile.email){
                    variables.email = this.$store.getters.current_user.profile.email
                }else if(this.$store.getters.current_user.auth.email){
                    variables.email = this.$store.getters.current_user.auth.email
                }

                if(this.$store.getters.current_user.profile.phone){
                    variables.phone = this.$store.getters.current_user.profile.phone
                }

                this.mutate({
                    mutation: CREATE_PROPERTY_CUSTOMER,
                    variables
                })
                .then(response => {
                    resolve(response.data.createPropertyCustomer)
                })
                .catch(e => {
                    reject(e)
                })
            })

        },

        tokenCallbackSuccessfull(data){
            if(!data) return;
            if(data.object == 'card' && this.customer){
                this.customer.sources.data.push(data);
                this.creditCard = data;
            }
            else{
                this.customer = data;
            }
            this.$store.commit("SNACKBAR", {
                status: true,
                text: "Credit card added",
                color: "success"
            })
            this.addCard = false;
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

        confirmCardRemoval(card){
            this.confirmation = {
                text: `Are you sure you want to remove the card ending ${card.last4} `,
                action: () => {
                    this.removeCreditCard(card)
                }
            }
            this.$refs.confirmation.open();
        },

        removeCreditCard(card){
            this.mutate({
                mutation: REMOVE_PROPERTY_CUSTOMER_CREDIT_CARD,
                variables: {
                    property_id: this.property.id,
                    customer_id: this.customer.customer.id,
                    card_id: card.id
                }
            })
            .then(response => {
                if(response.data.removePropertyCustomerCreditCard == true){
                    const index = this.customer.sources.data.findIndex(c => c.id == card.id);
                    this.customer.sources.data.splice(index, 1);

                    if(!this.cards.length) {
                        this.creditCard = null;
                        this.addCard = true;
                    } else {
                        this.creditCard = this.cards[0];
                    }

                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: "Credit card removed",
                        color: "success"
                    })
                }
                else{
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: "Credit card not removed",
                        color: "error"
                    })
                }
            })
            .catch(e => {
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: `Credit card not removed. ${e.message}`,
                    color: "error"
                })
            })
        }
    },

    watch: {
        reservation: {
            immediate: true,
            handler(reservation){
                if(reservation) this.getPropertyCustomer()
            }
        },

        creditCard: {
            immediate: true,
            handler(card){
                this.$emit('credit-card', card)
            }
        }
    }

}
</script>