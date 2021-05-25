<template>
    <div>
        <v-card v-bind="$attrs">
            <v-card-text v-if="verification">
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
                <template v-if="verification.report">
                    <slot name="verification" v-bind="{ verification }" />
                    <v-btn class="ma-1" color="primary" @click="$refs.report.open()">View Verification</v-btn>
                </template>
            </v-card-text>
            <v-card-text v-else>
                <p class="text-center grey--text">No verification available</p>
            </v-card-text>
        </v-card>
        <verification-report ref="report" :verification="verification" />
    </div>
</template>

<script>
import VerificationReport from './VerificationReport';

export default {
    name: "UserIdentityVerification",
    components: {
       VerificationReport
    },
    
    data(){
        return {}
    },

    props: {
        verification: Object
    },

    computed: {
        isMine(){
            if(this.verification && this.verification.metadata) {
                return this.verification.metadata.user_id === this.$store.getters.current_user.profile.id
            } 
            return false;
        },
    },  
}
</script>