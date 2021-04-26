<template>
    <v-btn v-if="!session" @click="createStripeVerificationSession" color="primary" :loading="loading"><slot>Verify ID</slot></v-btn>
</template>

<script>
import GET_PROPERTY_STRIPE_AUTH from '../../Property/Queries/getPropertyStripeAuthorization';
import CREATE_STRIPE_VERIFICATION_SESSION from '../Mutations/createUserStripeVerificationSession';
import { mapActions } from 'vuex';

export default {
    name: "RunIdentityVerification",
    data(){
        return {
            loading: false,
            session: null
        }
    },

    props: {
        property: Object
    },

    methods: {
        ...mapActions([
            'query',
            'mutate',
        ]),

        createStripeVerificationSession(){
            if(!this.property.stripe_connected){
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: `${this.property.name} cannot verify your Identity at the moment`,
                    color: 'error'
                })
                return;
            }
            this.loading = true;
            this.query({
                query: GET_PROPERTY_STRIPE_AUTH,
                variables: {
                    property_id: this.property.id
                }
            }).then(response => {
                if(!response.data.getPropertyStripeAuthorization || !response.data.getPropertyStripeAuthorization.stripe_user_id) return Promise.reject()
                return  this.mutate({
                    mutation: CREATE_STRIPE_VERIFICATION_SESSION,
                    variables: {
                        stripe_account: response.data.getPropertyStripeAuthorization.stripe_user_id,
                        metadata: {
                            user_id: this.$store.getters.current_user.profile.id,
                            property_id: this.property.id
                        },
                        return_url: this.url(this.$router.resolve({name: this.$router.currentRoute.name}).route.fullPath),
                        refresh_url: this.url(this.$router.resolve({name:  this.$router.currentRoute.name, query: {vs_refresh: 1}}).route.fullPath)
                    }
                })
            })
            .then(response => {
                this.session = response.data.createUserStripeVerificationSession;
                this.$emit('created', response.data.createUserStripeVerificationSession);
                window.location.href = this.session.url;
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: `Could not create verification session.`,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.createStripeVerificationSession();
                            resolve();
                        })
                    },
                    exception: e
                });
            })
            .finally(() => {
                this.loading = false
            })
        }
    },
}
</script>