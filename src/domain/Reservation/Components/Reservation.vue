<template>
    <router-link :to="{name: 'reservation.show', params:  {id: reservation.id, _reservation: reservation}}" class="text-decoration-none" >
        <v-card outline>
            <v-card-text class="text-center" >
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
                <p v-if="reservation.already_checkedin" class="success--text">Checked in {{reservation.checkedin_at | timestamp_to_date('day mName, year. diff')}}</p>
                <p v-else class="gray--text">Waiting for checkin</p>
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
    </router-link>
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
