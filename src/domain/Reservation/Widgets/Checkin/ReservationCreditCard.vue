<template>
    <data-container :loading="loading">
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
                        <stripe-credit-card class="my-1" :card="card" />
                    </template>
                    </v-radio>
                </v-radio-group>
        </div>
        <div v-else>
            <stripe-credit-card-form
                ref="stripeCreditCard" 
                :publishable-key="stripePublishableKey" 
                :token-callback="stripeTokenCallback"
                @success="customerCreateSuccessfull"
                @error="customerCreateError"
                @abort="customerCreateAborted"
            >
            <template #submit-btn-text> Add card </template>
            </stripe-credit-card-form>
        </div>
    </data-container>
</template>

<script>
import { mapActions } from 'vuex';

import DataContainer from '../../../../components/DataContainer.vue';
import StripeCreditCard from '../../../../components/Utilities/StripeCreditCard.vue';
import StripeCreditCardForm from '../../../../components/Utilities/StripeCreditCardForm.vue';

import CREATE_PROPERTY_CUSTOMER from '../../../Property/Mutations/createPropertyCustomer';
import GET_PROPERTY_CUSTOMER from '../../../Property/Queries/getPropertyCustomer';

export default {
    name: "ReservationCreditCard",
    data(){
        return {
            loading: false,
            customer: null,
            creditCard: null
        }
    },
    components: {
        DataContainer, StripeCreditCard, StripeCreditCardForm
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
            return this.customer && this.customer.sources ? this.customer.sources.data : []
        }
    },

    methods: {
        ...mapActions([
            'query', 'mutate'
        ]),

        getPropertyCustomer(){
            this.loading = true;
            this.query({
                query: GET_PROPERTY_CUSTOMER,
                variables: {
                    property_id: this.reservation.property_id,
                }
            })
            .then(response => {
                this.customer = response.data.getPropertyCustomer;
                this.creditCard = this.cards.length ? this.cards[0] : null
            })
            .finally(() => {
                this.loading = false
            })
        },

        stripeTokenCallback(token){
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

        customerCreateSuccessfull(customer){
            this.customer = customer;
            this.creditCard = this.cards.length ? this.cards[0] : null
        },

        customerCreateError(e){
            this.$store.commit('SNACKBAR', {
                status: true,
                color: 'error',
                text: `${e.message}`
            })
        },

        customerCreateAborted(){
            
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