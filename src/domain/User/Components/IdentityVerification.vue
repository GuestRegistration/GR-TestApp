<template>
    <div>
        <data-container :loading="loading">
            <div v-if="refresh">
                <v-alert 
                border="left"
                colored-border
                elevation="2"
                type="warning">
                    You need to restart your verification
                </v-alert>
                 <run-identity-verification class="ma-1" @created="verificationSessionCreated">Restart verification</run-identity-verification>
            </div>
            <div v-else-if="verification">
                <v-list>
                    <v-list-item>
                        Status: {{ verification.session.status }} 
                        <a v-if="verification.session.status == 'requires_input' " class="ml-5" :href="verification.session.url" target="_blank">Continue Verification</a>
                    </v-list-item>
                    <v-list-item>Type: {{ verification.session.type }}</v-list-item>
                </v-list>
                 <run-identity-verification class="ma-1" @created="verificationSessionCreated">Restart verification</run-identity-verification>
                <template v-if="verification.last_report">
                    <v-btn class="ma-1" color="primary" @click="$refs.report.open()">View Verification</v-btn>
                    <verification-report ref="report" />
                </template>
            </div>
            <div v-else>
                <v-alert 
                border="left"
                colored-border
                elevation="2"
                type="warning">
                    You need to run an Identity verification
                </v-alert>
                <run-identity-verification @created="verificationSessionCreated" />
            </div>
            

        </data-container>
       
    </div>
</template>

<script>
import GET_USER_VERIFICATION_SESSION from '../Queries/getUserVerificationSession';

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
            verification: null
        }
    },
    computed: {
        refresh(){
            return this.$route.query.vs_refresh
        }
    },  
    methods: {
        ...mapActions([
            'query',
        ]),

        getUserVerificationSession(){
            this.loading = true;
            this.query({
                query: GET_USER_VERIFICATION_SESSION,
            })
            .then(response => {
                console.log(response)
                this.verification = response.data.getUserVerificationSession
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                     show: true,
                    message: `Could not get your verification session.`,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.getUserVerificationSession();
                            
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
        verificationSessionCreated(session){
            this.verification = {session}
        }
    },
    mounted(){
        this.getUserVerificationSession();
    }
}
</script>