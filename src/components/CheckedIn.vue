<template>
    <div>
        <v-card elevation-20>
            <v-card-text>
            <p>Hey, <strong>{{reservation.name}}</strong>,</p>
            <br>
            <p>Thank you for booking with us at <strong>{{reservation.property.name}}</strong>. Below are the details of your bookings</p>
            <ReservationDetails :reservation="reservation" />
            <p>Here are some information, please make sure to review it when you have some time or click on the button below to receive a copy in your email. </p>
            </v-card-text>
            
            <v-card-actions>
                <v-btn
                    text
                    dark color="accent-4"
                    class="primary"
                    block
                >
                    Send checkin instruction
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import ReservationDetails from './../components/ReservationDetails'

    export default {
        data(){
            return {
                
            }
        },
        components: { ReservationDetails },
        props: ['reservation'],
        methods:{
            
        }

    }
</script>

<style scoped>

</style>

