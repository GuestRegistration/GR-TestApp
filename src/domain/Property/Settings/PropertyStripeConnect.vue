<template>
    <div>
    <slot name="heading" />
    <data-container :loading="loading">
            <template v-slot:loading>
                <v-skeleton-loader
                    type="card"
                    height="40"
                ></v-skeleton-loader>
            </template>
            <v-alert 
                v-if="disconnected"
                border="top"
                colored-border
                elevation="2"
                type="success">
                Stripe account disconnected
            </v-alert>
            <v-alert 
                v-else-if="connected"
                border="top"
                colored-border
                elevation="2"
                type="success">
                Stripe account connected
            </v-alert>
            <div class="text-center mt-5">
                <v-btn v-if="connected"
                    dark
                    color="error"
                    :loading="disconnecting"
                    @click="disconnect"
                    >
                    Disconnect Stripe
                </v-btn>
                <v-btn v-else
                    dark
                    color="primary"
                    :loading="connecting"
                    @click="connect"
                    >
                    Connect Stripe
                </v-btn>
            </div>
    </data-container>
    </div>
</template>

<script>
import config from '../../../config';
import DataContainer from '../../../components/DataContainer.vue';
import GET_PROPERTY_STRIPE_AUTH from '../Queries/getPropertyStripeAuthorization';
import UNSET_PROPERTY_STRIPE_AUTHORIZATION from '../Mutations/unsetPropertyStripeAuthorization';

export default {
    name: "PropertyStripeConnect",
    components: {
        DataContainer
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
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.getPropertyStripeAuthorization();
                        })
                    },
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
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: `Disconnection failed. `,
                    retry: () => {
                        this.disconnect()
                    },
                    exception: e
                })
            })
            .finally(() => {
                this.disconnecting = false;
            })
        }
    },

    watch: {
        property: {
            immediate: true,
            handler(property){
                if(property) this.getPropertyStripeAuthorization()
                else this.loading = true;
            }
        }
    }
}
</script>