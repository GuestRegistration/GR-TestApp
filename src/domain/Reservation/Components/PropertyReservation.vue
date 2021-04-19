<template>
    <div>
        <v-card outline>
            <v-card-text>
                <div class="text-center">
                    <v-avatar color="primary" size="100">
                        <v-img
                        v-if="reservation.property.image"
                        :src="reservation.property.image"
                        ></v-img>
                        <v-img v-else
                            src="@/assets/img/default-property.jpg"
                        ></v-img>
                    </v-avatar>
                </div>
                <h4>Guest: {{reservation.name}}</h4>
                <p  v-if="reservation.already_checkedin" class="success--text">checked in {{checkin_time}}</p>
                <p v-else class="gray--text">waiting for checkin</p>
            </v-card-text>
            <v-card-actions>
                <v-chip
                    class="ma-2"
                    :color="`${reservation.approved ? `teal` : `warning`}`"
                    text-color="white"
                    >
                    <v-avatar left>
                        <v-icon>mdi-checkbox-marked-circle</v-icon>
                    </v-avatar>
                    {{reservation.approved ? `Approved`: `Pending`}}
                </v-chip>
                <v-spacer></v-spacer>
                <router-link :to="{name: 'property.reservation.show', params: {id: reservation.id, _reservation: reservation}}" >
                    <v-btn text dark class="primary">View Reservation</v-btn>
                </router-link>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import helper from '@/helper'

    export default {
        name: "PropertyReservation",
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
