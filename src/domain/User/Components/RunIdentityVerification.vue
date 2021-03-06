<template>
    <div>
        <v-btn v-if="!session" @click="createStripeVerificationSession" small color="primary" :loading="loading" :disabled="!property.stripe_connected"><slot>Verify ID</slot></v-btn>
        <v-alert
            v-if="!property.stripe_connected"
            class="mt-2"
            border="top"
            colored-border
            elevation="2"
            type="error">
            {{ property.name }} can not process ID verification at the moment
        </v-alert>
    </div>
</template>

<script>
import CREATE_STRIPE_VERIFICATION_SESSION from '../Mutations/createUserStripeVerificationSession';
import { mapActions } from 'vuex';

export default {
    name: "RunIdentityVerification",
    data(){
        return {
            loading: false,
            session: null,
        }
    },

    props: {
        property: Object,
        redirect: String,
        metadata: Object,
    },

    methods: {
        ...mapActions([
            'query',
            'mutate',
        ]),

        createStripeVerificationSession(){
            this.loading = true;
            this.mutate({
                mutation: CREATE_STRIPE_VERIFICATION_SESSION,
                variables: {
                    property_id: this.property.id,
                    metadata: {
                        user_id: this.$store.getters.current_user.profile.id,
                        property_id: this.property.id,
                        ...this.metadata
                    },
                    return_url: this.redirect ? this.redirect : this.url(this.$router.resolve({name: this.$router.currentRoute.name}).route.fullPath),
                    refresh_url: this.redirect ? this.redirect+'&vs_refresh=1' : this.url(this.$router.resolve({name:  this.$router.currentRoute.name, query: {vs_refresh: 1}}).route.fullPath)
                }
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
                    retry: () => this.createStripeVerificationSession(),
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