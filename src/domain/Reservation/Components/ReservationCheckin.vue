<template>
    <div>
        <v-dialog
            v-model="loading"
            hide-overlay
            persistent
            width="400"
            >
            <v-card
                color="primary"
                dark
            >
                <v-card-text>
                    <div class="d-flex py-5">
                        <div>Getting checkin information</div>
                        <v-spacer></v-spacer>
                        <div> 
                            <v-btn
                                text
                                @click="close"
                            >
                                cancel
                            </v-btn>
                        </div>
                    </div>
                    
                    <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0"
                    ></v-progress-linear>
               
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog 
            v-model="dialog"
            scrollable  
            max-width="500"
            transition="dialog-bottom-transition"
            persistent
        >
        <v-card>
            <v-card-title class="headline">
                <span>Checkin Information</span>
            </v-card-title>
            <v-card-text>
                <template v-if="checkin">
                    <v-list >
                        <v-subheader>User</v-subheader>
                        <v-list-item v-if="checkin.user">
                            <v-list-item-content>
                                <v-list-item-title v-text="`${checkin.user.name.first_name} ${checkin.user.name.last_name}`"></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <v-list>
                        <v-subheader>Identity</v-subheader>
                        <v-list-item v-if="userVerification">
                            <v-list-item-content>
                                <v-list-item-title>
                                    Document: {{ userVerification.status ? userVerification.status : 'unverified'  }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-btn class="ma-1" color="primary" @click="$refs.userVerificationReport.open()">View Verification Report</v-btn>
                    
                    <verification-report ref="userVerificationReport" :verification="userVerification" />
                
                </template>
                <template v-else>
                    <div class="py-5 text-center">
                        Could not get checkin information
                    </div>
                </template>
            </v-card-text>

            <v-card-actions>
                <v-btn
                    color="red darken-1"
                    text
                    @click="close"
                >
                    close
                </v-btn>
                <v-spacer></v-spacer>
                <template v-if="checkin">

                    <v-btn v-if="!checkin.reservation.approved_at"
                        color="primary"
                        @click="approveCheckin"
                        :loading="approval.loading"
                    >
                        Approve checkin
                    </v-btn>
                    <v-btn v-else
                        color="primary"
                        text
                        disabled
                    >
                    Already approved
                    </v-btn>
                </template>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

import GET_RESERVATION_CHECKIN from '../Queries/getReservationCheckin';
import APPROVE_RESERVATION_CHECKIN from '../Mutations/approveReservationCheckin';
import VerificationReport from '../../User/Components/VerificationReport.vue';

export default {
    name: "ReservationCheckin",
    components: {
        VerificationReport
    },
    data(){

        return {
            dialog: false,
            checkin: null,
            loading: false,
            approval: {
                loading: false,
            }
        }
    },

    computed: {
        user(){
            return this.checkin ? this.checkin.user : {}
        },
        userVerification(){
            if(this.checkin && this.checkin.verifications && this.checkin.verifications.length){
                return  this.checkin.verifications[this.checkin.verifications.length - 1];
            }
            return {}
        }
    },

    props: {
        _reservation: Object
    },

    methods: {
        ...mapActions([
            'query',
            'mutate'
        ]),
        ...mapMutations([
            'TOAST_ERROR'
        ]),

        open(){
            this.getReservationCheckin();
        },
        close(){
            this.loading = false;
            this.dialog = false;
        },

        getReservationCheckin(){
            this.loading = true;
            this.query({
                query: GET_RESERVATION_CHECKIN,
                variables: {
                    id: this._reservation.id
                }
            })
            .then(response => {
                this.checkin = response.data.getReservationCheckin;
                if(!this.checkin.user){
                    this.$store.commit('SNACKBAR', {
                        status: true,
                        text: "The user account that checked in no longer exist",
                        color: "error"
                    })
                    return;
                }
                this.dialog = true;
            })
            .catch(e => {
                this.$refs.app.toastError({
                    message: `Could not get reservation checkin information.`,
                    retry: () => {
                        this.getReservationCheckin()
                    },
                    exception: e
                });
            })
            .finally(() => {
                this.loading = false;
            })
        },

        approveCheckin(){
            this.approval.loading = true;

            this.mutate({
                mutation: APPROVE_RESERVATION_CHECKIN,
                variables: {id: this.checkin.reservation.id}
            })
            .then(response => {
                this.checkin.reservation = response.data.approveReservationCheckin;
                this.$emit('approved', response.data.approveReservationCheckin);
            })
            .catch(e => {
               this.TOAST_ERROR({
                    show: true,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.approveCheckin();
                        })
                    },
                    message: 'Could not approve reservation checkin. ',
                    exception: e
                });
                this.$emit('error', e);
            })
            .finally(() => {
                this.approval.loading = false;
            })
        }
    }
}

</script>