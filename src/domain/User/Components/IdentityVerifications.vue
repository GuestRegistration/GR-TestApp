<template>
    <data-container :loading="loading">
        <div v-if="refresh">
            <v-alert 
            border="left"
            colored-border
            elevation="2"
            type="warning">
                Previous ID verification invalid
            </v-alert>
            <run-identity-verification v-if="isMine" :property="property" class="ma-1" @created="verificationCreated" :redirect="redirect">Restart verification</run-identity-verification>
        </div>
        <div v-else-if="verifications.length">
            <p>Your ID verification at {{ property.name }}</p>
            <user-verification v-for="(verification, v) in verifications" :key="v" :verification="verification" class="my-1">
                <template #verification="props">
                    <slot name="verification" v-bind="props" />
                </template>
            </user-verification>
            <slot name="actions" v-bind="{ verifications }" />
        </div>
        <div v-else>
            <v-alert 
            class="ma-2"
            border="left"
            colored-border
            elevation="2"
            type="warning">
                {{ property.name }} needs to verify your identity
            </v-alert>
            <run-identity-verification :property="property" @created="verificationCreated" :metadata="metadata" :redirect="redirect" />
        </div>
    </data-container>
</template>

<script>
import GET_USER_STRIPE_VERIFICATIONS from '../Queries/getUserStripeVerifications';

import { mapActions } from 'vuex';
import DataContainer from '../../../components/DataContainer.vue';
import RunIdentityVerification from './RunIdentityVerification';
import UserVerification from './IdentityVerification';

export default {
    name: "UserIdentityVerifications",
    components: {
        RunIdentityVerification, DataContainer, UserVerification
    },
    
    data(){
        return {
            loading: false,
            verifications: []
        }
    },

    props: {
        property: Object,
        metadata: Object,
        redirectPath: String
    },

    computed: {
        refresh(){
            return this.$route.query.vs_refresh
        },

        isMine(){
            if(this.verification && this.verification.metadata) {
                return this.verification.metadata.user_id === this.$store.getters.current_user.profile.id
            } 
            return false;
        },

        redirect(){
            return this.url(this.redirectPath);
        }


    },  
    methods: {
        ...mapActions([
            'query',
        ]),

        getUserStripeVerifications(){
            this.loading = true;
            this.query({
                query: GET_USER_STRIPE_VERIFICATIONS,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.verifications = response.data.getUserStripeVerifications;
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                     show: true,
                    message: `Could not get your verifications.`,
                    retry: () => this.getUserStripeVerifications(),
                    exception: e
                });
            })
            .finally(() => {
                this.loading = false
            })
        },
        
        verificationCreated(verification){
            this.verifications.unshift({
                property_id: this.property.id,
                session: verification.id,
                report: verification.last_verification_report ? verification.last_verification_report.id : null,
                url: verification.url,
                type: verification.type,
                status: verification.status
            })
        }
    },

    watch: {
        property:{
            immediate: true,
            handler(){
                this.getUserStripeVerifications();
            }
        },

        verifications: {
            immediate: true,
            handler(v){
                this.$emit('verifications', v);
            }
        },

        $route: {
            immediate: true,
            handler(route){
                if(route.query.vs_refresh){
                    this.$emit('restart-verification')
                }
            }
        }
    }
}
</script>