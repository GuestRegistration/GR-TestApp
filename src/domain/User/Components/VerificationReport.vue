<template>
<div>
    <v-dialog
        v-model="dialog"
        width="500"
        scrollable
        >
        <v-card outlined :loading="loading"> 
            <v-card-title
            class="headline grey lighten-2"
            primary-title
            >
                Verification Report
            </v-card-title>
            <v-card-text>
                <data-container :loading="loading">
                    <div v-if="report" class="mt-5">
                        
                        <v-list>
                            <v-subheader>Document: {{ document.document_type }}</v-subheader>
                            
                            <div class="text-center d-flex justify-content-center">
                                <div class="text-center px-2">
                                    <p>Document Front</p>
                                    <img v-if="files.document_front" :src="`${files.document_front.img_src}`" width="200px">
                                    <div v-else>
                                        Image not available
                                    </div>
                                </div>
                                <div class="text-center px-2">
                                    <p>Document back</p>
                                    <img v-if="files.document_back" :src="`${files.document_back.img_src}`" width="200px">
                                    <div v-else>
                                        Image not available
                                    </div>
                                </div>
                            </div>

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
                            <img v-if="selfie.selfie" :src="`${files.selfie.img_src}`" width="200px">
                            <div v-else>
                                Image not available
                            </div>
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
                        type="warning">
                            No verification report
                        </v-alert>
                    </div>
                </data-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</div>
    
</template>

<script>
import DataContainer from '../../../components/DataContainer.vue';
import GET_USER_VERIFICATION_REPORT from '../Queries/getUserVerificationReport';

export default
    {
    name: "UserVerificationReport",
    components: { DataContainer },
    props: {
        userId: String
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
            this.dialog = true;
            this.getVerificationReport()
        },
        close(){
            this.dialog = false;
        },

        getVerificationReport(){
            this.loading = true;
            this.$store.dispatch('query', {
                query: GET_USER_VERIFICATION_REPORT,
                variables: {
                    id: this.userId
                }
            })
            .then(response => {
                this.report = response.data.getUserVerificationReport
            })
            .finally(() => {
                this.loading = false;
            })
        }
    }
}
</script>