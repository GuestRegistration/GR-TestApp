<template>
    <div>
    <slot name="heading" />
        <property-subscription-alert v-if="property" :property="property">
            Activate subscription for {{ property.name }} to connect Stripe
        </property-subscription-alert>

        <v-card v-if="property && property.active" >
            <v-card-title>
                Stripe
            </v-card-title>
            <v-card-text>
                <data-container :loading="loading">
                    <template v-if="auth">
                        <div v-if="account" class="text-center">
                            <p class="grey--text">Stripe connected as</p>
                            <h1> {{ account.name }} </h1>
                            <a v-if="account.url" :href="account.url">{{ account.url }}</a>
                        </div>
                        <v-alert
                            v-else 
                            border="top"
                            colored-border
                            elevation="2"
                            type="success">
                            Stripe connected
                        </v-alert>
                        <div class="text-center my-5">
                            <v-btn
                                dark
                                small
                                color="error"
                                :loading="disconnecting"
                                @click="disconnect"
                                >
                                <v-icon class="mr-2">mdi-cancel</v-icon> Disconnect Stripe
                            </v-btn>
                        </div>
                    </template>

                    <template v-else>
                        <v-alert 
                            border="top"
                            colored-border
                            elevation="2"
                            type="error">
                            Stripe not connected
                        </v-alert>
                        <div class="text-center my-5">
                            <v-btn
                                dark
                                small
                                color="primary"
                                :loading="connecting"
                                @click="connect"
                                >
                                Connect Stripe
                            </v-btn>
                        </div>
                    </template>                   
                </data-container>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import config from '../../../config';
import DataContainer from '../../../components/DataContainer.vue';
import PropertySubscriptionAlert from '../Components/PropertySubscriptionAlert'

import GET_PROPERTY_STRIPE_AUTH from '../Queries/getPropertyStripeAuthorization';
import UNSET_PROPERTY_STRIPE_AUTHORIZATION from '../Mutations/unsetPropertyStripeAuthorization';

export default {
    name: "PropertyStripeConnect",
    components: {
        DataContainer, PropertySubscriptionAlert
    },
    props: {
        property: Object,
    },
    data(){
        return {
            loading: true,
            connecting: false,
            disconnecting: false,
            disconnected: false,
            auth: null,
        }
    }, 

    computed: {
        connected(){
            return this.auth && this.auth.stripe_user_id
        },

        account() {
            return this.auth && this.auth.account && this.auth.account.business_profile ? this.auth.account.business_profile : null
        }
    },

    methods: {
        getPropertyStripeAuthorization(){
            this.loading = true;
           
             this.$store.dispatch('query', {
                query: GET_PROPERTY_STRIPE_AUTH,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.auth = response.data.getPropertyStripeAuthorization
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => this.getPropertyStripeAuthorization(),
                    message: 'Could not get property stripe authorization',
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },


        connect(){
            this.connecting = true;

            const clientId = config.stripe.client_id;
            const return_uri = this.url(this.$router.resolve({name: 'property.stripe.connect.callback'}).route.fullPath);
            window.localStorage.setItem('property-stripe-connect', this.property.id)
            window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${return_uri}`;

        },

        disconnect(){
            this.disconnecting = true;
            this.$store.dispatch('mutate', {
                mutation: UNSET_PROPERTY_STRIPE_AUTHORIZATION,
                variables: {
                    property_id: this.property.id,
                }
            })
            .then(response => {
                this.disconnected = true;
                this.auth = null;
                this.$emit('disconnected');
                this.refresh();
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: `Disconnection failed. `,
                    retry: () => this.disconnect(),
                    exception: e
                })
            })
            .finally(() => {
                this.disconnecting = false;
            })
        },

        refresh() {
            this.$store.commit('SET_APP_STATE', false);
            this.$store.commit('SET_APP_PROCESS', 'Hold on...');
            setTimeout(()=> {
                window.location.reload();
            }, 5000);
        }

    },

    watch: {
        property: {
            immediate: true,
            handler(property){
                if(property && property.active && property.stripe_connected) this.getPropertyStripeAuthorization()
                else this.loading = false;
            }
        }
    }
}
</script>