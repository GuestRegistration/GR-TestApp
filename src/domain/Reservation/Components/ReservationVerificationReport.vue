<template>
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
</template>

<script>
import DataContainer from '../../../components/DataContainer.vue';
import GET_STRIPE_VERIFICATION_REPORT from '../../User/Queries/getUserStripeVerificationReport';

export default
    {
    name: "ReservationVerificationReport",
    components: { DataContainer },
    props: {
        verification: Object,
    },
    data(){
        return {
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
        getUserStripeVerificationReport(){

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
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: `Could not get verification report.`,
                    retry: () => this.getUserStripeVerificationReport(),
                    exception: e
                });
            })
            .finally(() => {
                this.loading = false;
            })
        },
    },

    watch: {
        verification: {
            immediate: true,
            handler(verification){
                if(verification && verification.report){
                    this.getUserStripeVerificationReport();
                }
            }
        }
    }

}
</script>