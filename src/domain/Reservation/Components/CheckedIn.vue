<template>
    <div>

        <v-card outlined>
            <v-card-text>
                <p>Hey, <strong>{{reservation.name}}</strong>,</p>
                <p>Thank you for booking with us at <strong>{{reservation.property.name}}</strong>. Below are the details of your bookings</p>
                <ReservationDetails :_reservation="reservation" />
                <p>Here are some instructions, please make sure to review them when you have some time.</p>
                
                <v-dialog v-if="reservation.approved" v-model="instructionsDialog" scrollable max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        color="primary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        block
                        >
                        See checkin instruction
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>Checkin Instructions</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <div class="text-center mt-5" v-if="reservation.instruction">
                                {{reservation.instruction}}
                            </div>
                            <div class="text-center mt-5" v-else>
                                No checkin instruction
                            </div>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn color="red darken-1" text @click="instructionsDialog = false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-alert v-else 
                    border="top"
                    colored-border
                    elevation="2"
                    type="warning"
                >
                    Your checkin needs to be approved before you can see instructions
                </v-alert>
                <div class="text-center mt-3">
                    <router-link :to="{name: 'property.rules', params: {id: reservation.property.id, _property: reservation.property} }">
                        Property Rules
                    </router-link>
                </div>
            </v-card-text>
        </v-card>

        <v-card class="mt-5" outlined>
            <v-card-text>
                <h2>Charges</h2>
                <reservation-charges :reservation="reservation" />
            </v-card-text>
        </v-card>

        <v-card class="mt-5" outlined>
            <v-card-text>
                <h2>Identity</h2>
                <identity-verification :property="property" />  
            </v-card-text>
        </v-card>        

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import ReservationDetails from './ReservationDetails';
    import ReservationCharges from './ReservationCharges';
    import IdentityVerification from '../../User/Components/IdentityVerification.vue';

    export default {
        components: { 
            ReservationDetails, 
            IdentityVerification,
            ReservationCharges
         },
        data(){
            return {
                reservation: {},
                instructionsDialog: false,
            }
        },
        props: ['_reservation', 'property'],
        computed: {
            ...mapGetters([
               
            ])
           
        },
        methods:{
            
        },
        mounted(){
            
        },
        watch: {
            _reservation: {
                immediate: true,
                handler(r){
                    this.reservation = r
                }
            }
        }
        
    }
</script>

<style scoped>

</style>

