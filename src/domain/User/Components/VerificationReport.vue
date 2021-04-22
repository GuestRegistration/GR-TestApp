<template>
<div>
    <confirmation-dialog ref="confirmation" @confirmed="dialog = true">
        <div class="text-center mt-5">
            <p>
                You are accessing another user identity verification. The user will be notified about this.
            </p>
            <h4>
                Do you want to continue ?
            </h4>
        </div>
    </confirmation-dialog>
    <v-dialog
        v-model="dialog"
        width="400"
        scrollable
        persistent
        >
        <v-card outlined :loading="loading"> 
            <v-card-title
            class="headline"
            primary-title
            >
                Verification Report
            </v-card-title>
            <v-card-text>
                <data-container :loading="loading">
                    <div v-if="report" class="mt-5">
                        
                        <v-list>
                            <v-subheader>Document: {{ document.document_type }}</v-subheader>
                            <v-list-item>
                                <v-list-item-content>
                                     Name: {{ [document.first_name, document.last_name].join(' ') }}
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                     DOB: {{ [dob.day, dob.month, dob.year].join('/')  }}
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                     Issued Date: {{ [issued_date.day, issued_date.month, issued_date.year].join('/') }}
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                     Expiration Date: {{ [expiration_date.day, expiration_date.month, expiration_date.year].join('/') }}
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                     Issuing country: {{ document.issuing_country }}
                                </v-list-item-content>
                            </v-list-item>
                             <v-list-item>
                                <v-list-item-content>
                                     status: {{ document.status }}
                                </v-list-item-content>
                            </v-list-item>
                            <v-subheader>Address</v-subheader>
                            <v-list-item>
                                <v-list-item-content>
                                     Line1: {{ address.line1 }}
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                     Line2: {{ address.line2 }}
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    City: {{ address.city }}
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    State: {{ address.state }}
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    Country: {{ address.country }}
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    Postal code: {{ address.postal_code }}
                                </v-list-item-content>
                            </v-list-item>
                            
                        </v-list>

                        <v-list>
                            <v-subheader>Selfie</v-subheader>
                            <v-list-item>
                                <v-list-item-content>
                                     Status: {{ selfie.status }}
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </div>
                    <div v-else class="mt-5" >
                        <v-alert 
                        border="left"
                        colored-border
                        elevation="2"
                        type="error">
                            No verification report
                        </v-alert>
                    </div>
                </data-container>
            </v-card-text>
            <v-card-actions v-if="!loading">
                <v-spacer></v-spacer>
                <v-btn text @click.prevent="close" color="red">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
    
</template>

<script>
import DataContainer from '../../../components/DataContainer.vue';
import ConfirmationDialog from '@/components/Utilities/ConfirmationDialog'
import GET_STRIPE_VERIFICATION_REPORT from '../Queries/getUserStripeVerificationReport';

export default
    {
    name: "VerificationReport",
    components: { DataContainer, ConfirmationDialog },
    props: {
        verification: Object,
    },
    data(){
        return {
            dialog: false,
            loading: false,
            report: null
        }
    },
    computed: {
        document(){
            return this.report ? this.report.document : {}
        },
        expiration_date(){
            return this.document.expiration_date ? this.document.expiration_date : {}
        },

        issued_date(){
            return this.document.issued_date ? this.document.issued_date : {}
        },
        dob(){
            return this.document.dob ? this.document.dob : {}
        },

        address(){
            return this.document.address ? this.document.address : {}
        },

        selfie(){
            return this.report ? this.report.selfie :{}
        },

        files(){
            return this.report ? this.report.files :{}
        }
    },
    methods: {
        open(){
            if(this.verification.metadata.user_id === this.$store.getters.current_user.auth.uid){
                this.dialog = true;
                return;
            }
            this.$refs.confirmation.open();
        },
        close(){
            this.dialog = false;
        },

        getUserStripeVerificationReport(){

            if(!this.verification.report) return;

            this.loading = true;
            this.$store.dispatch('query', {
                query: GET_STRIPE_VERIFICATION_REPORT,
                variables: {
                    user_id: this.verification.metadata.user_id,
                    verification_id: this.verification.session
                }
            })
            .then(response => {
                this.report = response.data.getUserStripeVerificationReport
            })
            .finally(() => {
                this.loading = false;
            })
        },
        
    },

    watch: {
        dialog: {
            immediate: true,
            handler(open){
                if(open) this.getUserStripeVerificationReport()
            }
        }
    }
}
</script>