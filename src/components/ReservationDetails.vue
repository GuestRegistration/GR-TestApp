<template>
    <div>
        <v-list rounded>
            <v-list-item-group color="primary">
                <v-list-item >
                    <v-list-item-icon>
                        <v-icon>mdi-clock</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Stay from {{reservation.checkin_date}} to {{reservation.checkout_date}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item >
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
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                reservation: this._reservation
            }
        },
        props: ['_reservation'],
        methods:{
            
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
