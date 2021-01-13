<template>
    <div>
        <v-card outline>
            <v-card-title>{{reservation.property.name}}</v-card-title>
            <v-card-subtitle>{{reservation.property.country}}</v-card-subtitle>
            <v-card-text v-if="reservation.already_checkedin">
                <p>checked in {{checkin_time}}</p>
            </v-card-text>
            <v-card-actions>
                <v-chip
                    class="ma-2"
                    :color="`${reservation.checkedin_at ? (reservation.approved ? `teal` : `info`) : `warning`}`"
                    text-color="white"
                    >
                    <v-avatar left>
                        <v-icon>mdi-checkbox-marked-circle</v-icon>
                    </v-avatar>
                    {{reservation.checkedin_at ? (reservation.approved ? `Approved`: `Pending approval`) : `Checkin pending`}}
                </v-chip>
                <v-spacer></v-spacer>
                <router-link :to="{name: 'reservation.show', params:  {id: reservation.id, _reservation: reservation}}" >
                    <v-btn text dark class="primary">View Reservation</v-btn>
                </router-link>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import helper from '@/helper'

    export default {
        data(){
            return {
                reservation: this._reservation
            }
        },
        props: ['_reservation'],
        computed:{
            checkin_time(){
                return helper.resolveTimestamp(this.reservation.checkedin_at)
            },
            approved_time(){
                return helper.resolveTimestamp(this.reservation.approved_at)
            }
        },
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
