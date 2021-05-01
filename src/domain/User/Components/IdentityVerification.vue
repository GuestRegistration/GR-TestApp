<template>
    <data-container :loading="loading">
        <div v-if="refresh">
            <v-alert 
            border="left"
            colored-border
            elevation="2"
            type="warning">
                You need to restart your verification
            </v-alert>
            <run-identity-verification v-if="isMine" :property="property" class="ma-1" @created="verificationCreated">Restart verification</run-identity-verification>
        </div>
        <div v-else-if="verification">
            <p>Your ID verification at {{ property.name }}</p>
            <v-card>
                <v-card-text>
                    <div class="text-uppercase">Verification Type: {{ verification.type  }}</div>
                    <div v-if="verification.status == 'requires_input'">
                        <a :href="verification.url" target="_blank">Continue Verification</a>
                    </div>
                    <div>
                        status:  <v-chip
                            class="ma-2"
                            :color="`${verification.status === 'verified' ? 'green' : 'orange'}`"
                            text-color="white"
                            >
                            {{ verification.status }}
                        </v-chip>
                    </div>
                    <run-identity-verification v-if="isMine && canRestart" :property="property" class="ma-1" @created="verificationCreated">Restart verification</run-identity-verification>
                    <template v-if="verification.report">
                        <v-btn class="ma-1" color="primary" @click="$refs.report.open()">View Verification</v-btn>
                        <verification-report :verification="verification" ref="report" />
                    </template>
                </v-card-text>
            </v-card>
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
            <run-identity-verification :property="property" @created="verificationCreated" />
        </div>
    </data-container>
</template>

<script>
import GET_USER_STRIPE_VERIFICATIONS from '../Queries/getUserStripeVerifications';

import { mapActions } from 'vuex';
import DataContainer from '../../../components/DataContainer.vue';
import RunIdentityVerification from './RunIdentityVerification';
import VerificationReport from './VerificationReport';

export default {
    name: "UserIdentityVerification",
    components: {
        RunIdentityVerification, DataContainer, VerificationReport
    },
    data(){
        return {
            loading: false,
            verifications: []
        }
    },

    props: {
        property: Object,
        canRestart: Boolean
    },

    computed: {
        refresh(){
            return this.$route.query.vs_refresh
        },
        verification(){
            return this.verifications.length ? this.verifications[this.verifications.length-1] : null;
        },

        isMine(){
            if(this.verification && this.verification.metadata) {
                return this.verification.metadata.user_id === this.$store.getters.current_user.profile.id
            } 
            return false;
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
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.getUserStripeVerifications();
                            
                            resolve();
                        })
                    },
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

        verification: {
            immediate: true,
            handler(v){
                if(v){
                    this.$emit('verification', v)
                }
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