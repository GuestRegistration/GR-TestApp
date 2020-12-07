<template>
    <div>

        <v-card outlined>
            <v-card-text>
                <p>Hey, <strong>{{reservation.name}}</strong>,</p>
                <br>
                <p>Thank you for booking with us at <strong>{{reservation.property.name}}</strong>. Below are the details of your bookings</p>
                <ReservationDetails :_reservation="reservation" />
                <p>Here are some information, please make sure to review it when you have some time or click on the button below to receive a copy in your email. </p>
                
                <v-dialog v-model="instructionsDialog" scrollable max-width="500px">
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
                <div class="text-center mt-3">
                    <router-link :to="{name: 'property.rules', params: {property: reservation.property.id} }">
                        Property Rules
                    </router-link>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import ReservationDetails from './../components/ReservationDetails'

    export default {
        components: { ReservationDetails },
        data(){
            return {
                reservation: this._reservation,
                instructionsDialog: false,
            }
        },
        props: ['_reservation'],
        computed: {
            ...mapGetters([
               
            ])
           
        },
        methods:{
            
        },
        mounted(){
            
        },
        watch: {
            _reservation: function (r){
                this.reservation = r
            }
        }
        
    }
</script>

<style scoped>

</style>

