<template>
    <app-layer ref="app">
        <data-container :loading="loading">
            <v-container>
                <div v-if="!property" class="text-center">
                    <h1>We could not find that property</h1>
                </div>
                <div v-else>
                    <v-alert 
                        v-if="error && error == 'access_denied'"
                        border="top"
                        colored-border
                        elevation="2"
                        type="error">
                        Access was denied for Stripe Connect
                    </v-alert>

                    <v-alert 
                        v-if="!code"
                        border="top"
                        colored-border
                        elevation="2"
                        type="error">
                        Authorization failed
                    </v-alert>
                    
                </div>
            </v-container>
        </data-container>
    </app-layer>
</template>

<script>

import AppLayer from '@/AppLayer';
import DataContainer from '../../../components/DataContainer.vue';
import GET_PROPERTY from '../Queries/getProperty';
import SET_PROPERTY_STRIPE_AUTHORIZATION from '../Mutations/setPropertyStripeAuthorization';

export default {
    name: 'PropertyStripeConnectCallback',
    components: {
        AppLayer, DataContainer
    }, 
    data(){
        return {
            loading: true,
            property: null,
        }
    },

    computed:{
         id(){
            return window.localStorage.getItem('property-stripe-connect')
        },
        error(){
            return this.$route.query.error
        },
        code(){
            return this.$route.query.code
        }
    },

    methods:{

        startConnect(){
            this.loading = true;
            if(this.id){
                this.$store.dispatch('query', {
                    query: GET_PROPERTY,
                    variables: {
                        id: this.id
                    }
                })
                .then(response => {
                    this.property = response.data.getProperty;
                    if(this.code){
                        return this.$store.dispatch('mutate', {
                            mutation: SET_PROPERTY_STRIPE_AUTHORIZATION,
                            variables: {
                                property_id: this.property.id,
                                grant_type: 'authorization_code',
                                code: this.code
                            }
                        })
                    }
                    return Promise.resolve(null);
                })
                .then(authResponse => {
                    window.localStorage.removeItem('property-stripe-connect')
                    if(authResponse){
                        this.$router.push({name: 'property.edit', params: {id: this.property.id, tab: 'stripe', _property: this.property, stripe_connected: true}})
                    }else{
                        this.$refs.app.alert("Stripe connect could not be completed.")
                    }
                })
                .catch(e => {
                    this.$refs.app.toastError({
                        message: `Could not complete Stripe Connect`,
                        retry: () => {
                            this.startConnect()
                        },
                        exception: e
                    });
                })
                .finally(() => {
                    this.loading = false;
                })
            }else{
                this.$router.push({name: 'home'});
            }
        },
    },

    mounted(){
        this.startConnect();
    }
}
</script>
