<template>
    <div>
        <v-card flat>
            <v-card-text>
                <p>Thank you for booking with us at <strong>{{reservation.property.name}}</strong>. Below are the details of your bookings</p>
                <reservation-details :reservation="reservation" />
                <reservation-instruction-dialog :reservation="reservation" />
            </v-card-text>
        </v-card>

        <data-container :loading="loading">
            <template v-if="checkin">
                <h4 class="my-3">Checkin Information</h4>
                <v-tabs
                v-model="tab"
                background-color="transparent"
                color="primary"
                grow
                icons-and-text
                show-arrows
                >
                    <v-tab>
                    ID Verification 
                    <v-icon>mdi-account-check</v-icon>
                    </v-tab>
                    <v-tab>
                        Credit Card
                        <v-icon>mdi-credit-card</v-icon>
                    </v-tab>
                    <v-tab>
                        Charges
                        <v-icon>mdi-credit-card</v-icon>
                    </v-tab>
                    <v-tab>
                        Questions
                        <v-icon>mdi-account-question</v-icon>
                    </v-tab>
                    <v-tab>
                        Agreements
                        <v-icon>mdi-handshake</v-icon>
                    </v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">

                    <v-tab-item>
                        <v-card
                        flat
                        >
                        <v-card-text>
                            <identity-verification :property="property" />  
                        </v-card-text>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item>
                        <stripe-credit-card :card="checkin.checkin.credit_card" />
                    </v-tab-item>


                    <v-tab-item>
                        <v-card
                        flat
                        >
                            <v-card-text>
                                <reservation-charges :reservation="reservation" :property="property" />
                            </v-card-text>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item>
                        <v-card
                        flat
                        v-if="checkin"
                        >
                            <v-card-text>
                                <v-list v-if="checkin.checkin.questions &&  checkin.checkin.questions.length">
                                    <v-list-item v-for="(question, q) in checkin.checkin.questions" :key="q">
                                        <v-list-item-icon>
                                            <v-icon>mdi-account-question</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{ question.question }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                Ans: {{ question.response ? question.response : 'NIL'  }}
                                            </v-list-item-subtitle>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                                <div v-else class="my-5 grey--text text-center">
                                    No question responded to for this reservation
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>


                    <v-tab-item>
                        <v-card
                        flat
                        v-if="checkin"
                        >
                            <v-card-text>
                                <v-list v-if="checkin.checkin.agreements &&  checkin.checkin.agreements.length">
                                    <v-list-item v-for="(agreement, i) in checkin.checkin.agreements" :key="i">
                                        <v-list-item-icon>
                                            <v-icon>mdi-handshake</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{ agreement.agreement }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle v-if="agreement.link && agreement.link !== ''">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <a
                                                            target="_blank"
                                                            :href="agreement.link"
                                                            @click.stop
                                                            v-on="on"
                                                        >
                                                            Read agreement
                                                        </a>
                                                    </template>
                                                    Opens in new window
                                                </v-tooltip>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                                <div v-else class="my-5 grey--text text-center">
                                    No agreement for the reservation
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                        
                </v-tabs-items>
            </template>
        </data-container>

    </div>
</template>

<script>
    import DataContainer from '../../../components/DataContainer.vue';
    import ReservationDetails from '../Components/ReservationDetails';
    import ReservationInstructionDialog from '../Components/ReservationInstructionDialog';
    import ReservationCharges from './Checkin/ReservationCharges';
    import StripeCreditCard from '../../../components/Utilities/StripeCreditCard'
    import IdentityVerification from '../../User/Components/IdentityVerification.vue';

    import GET_RESERVATION_CHECKIN from '../Queries/getReservationCheckin';
    export default {
        name: "ReservationCheckinDetails",
        components: { 
            DataContainer,
            ReservationDetails, 
            ReservationInstructionDialog,
            IdentityVerification,
            ReservationCharges,
            StripeCreditCard,
         },

        data(){
            return {
                loading: true,
                tab: null,
                checkin: null
            }
        },
        props: {
            reservation: Object,
            property: Object,
        },
        methods: {

            getReservationCheckin(){
                this.loading = true;
                this.$store.dispatch('query',{
                    query: GET_RESERVATION_CHECKIN,
                    variables: {
                        id: this.reservation.id
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
                })
                .catch(e => {
                    this.$store.commit("TOAST_ERROR", {
                        show: true,
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

        },
        watch: {
            reservation: {
                immediate: true,
                handler(reservation){
                    if(reservation){
                        this.getReservationCheckin();
                    }
                }
            }
        }
    }
</script>

