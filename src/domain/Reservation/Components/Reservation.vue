<template>
    <div>
        <v-card outline>
            <v-card-text class="text-center" >
                <router-link :to="{name: 'reservation.show', params:  {id: reservation.id, _reservation: reservation}}" class="text-decoration-none" >
                    <v-avatar color="primary" size="100">
                        <v-img
                        v-if="reservation.property.image"
                        :src="reservation.property.image"
                        ></v-img>
                        <v-img v-else
                            src="@/assets/img/default-property.jpg"
                        ></v-img>
                    </v-avatar>
                    <h3>{{reservation.property.name}}</h3>
                    <p>{{reservation.property.address}}</p>
                    <p v-if="reservation.already_checkedin" class="success--text">Checked in {{checkin_time}}</p>
                    <p v-else class="gray--text">Waiting for checkin</p>
                </router-link>
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
