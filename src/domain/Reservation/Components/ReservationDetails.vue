<template>
    <div>
        <v-list v-if="reservation" dense>

            <v-list-item >
                <v-list-item-icon>
                    <v-icon color="primary">mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Booking Ref: {{reservation.booking_reference | nullable}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item >
                <v-list-item-icon>
                    <v-icon color="primary">mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Booking Name: {{reservation.name | nullable}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

             <v-list-item >
                <v-list-item-icon>
                    <v-icon color="primary">mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Room/Listing: {{reservation.room | nullable}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item >
                <v-list-item-icon>
                    <v-icon color="primary">mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Checkin Date: {{reservation.checkin_date | nullable}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item >
                <v-list-item-icon>
                    <v-icon color="primary">mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Checkout Date: {{reservation.checkout_date | nullable}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item >
                <v-list-item-icon>
                    <v-icon color="primary">mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Balance: {{reservation.balance | nullable}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <!-- <v-list-item >
                <v-list-item-icon>
                    <v-icon>mdi-flag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Booking channel: {{reservation.booking_channel}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item >
                <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Number of Guests: {{reservation.guests ? reservation.guests.length: 0}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item> -->
        </v-list>
    </div>
</template>

<script>
    export default {
        data(){
            return {
            }
        },
        props: {
            reservation: Object
        },
        methods:{
            
        },
        watch: {
           
        }
    }
</script>


