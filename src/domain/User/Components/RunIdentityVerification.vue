<template>
    <v-btn v-if="!session" @click="createVerificationSession" color="primary" :loading="loading"><slot>Verify Me</slot></v-btn>
</template>

<script>
import CREATE_VERIFICATION_SESSION from '../Mutations/createUserVerificationSession';
import { mapActions } from 'vuex';

export default {
    name: "RunIdentityVerification",
    data(){
        return {
            loading: false,
            session: null
        }
    },
    methods: {
        ...mapActions([
            'mutate',
        ]),

        createVerificationSession(){
            this.loading = true;
            this.mutate({
                mutation: CREATE_VERIFICATION_SESSION,
                variables: {
                    user_id: this.$store.getters.current_user.profile.id,
                    return_url: this.url(this.$router.resolve({name: 'account'}).route.fullPath),
                    refresh_url: this.url(this.$router.resolve({name: 'account', query: {vs_refresh: 1}}).route.fullPath)
                }
            })
            .then(response => {
                this.session = response.data.createVerificationSession;
                this.$emit('created', response.data.createVerificationSession);
                window.location.href = this.session.url;
            })
            .catch(e => {
                 this.$store.commit('TOAST_ERROR', {
                     show: true,
                    message: `Could not create verification session.`,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.createVerificationSession();
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