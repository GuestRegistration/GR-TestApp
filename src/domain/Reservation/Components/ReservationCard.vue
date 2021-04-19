<template>
  <v-card
  >
    <v-card-text class="text-center">
      <v-avatar color="primary" size="100">
            <v-img
            v-if="reservation.property.image"
            :src="reservation.property.image"
            ></v-img>
            <v-img v-else
                src="@/assets/img/default-property.jpg"
            ></v-img>
        </v-avatar>
        <router-link :to="{name: 'property.show', params: {id: reservation.property.id, _property: reservation.property}}" class="text-decoration-none">
          <h3>{{ reservation.property.name }}</h3> 
        </router-link>
          <p>{{reservation.property.address}}</p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <router-link :to="{name: 'reservation.show', params:  {id: reservation.id, _reservation: reservation}}" >
          <v-btn text dark class="primary">View Reservation</v-btn>
      </router-link>
    </v-card-actions>
  
  </v-card>
</template>

<script>
    import helper from '@/helper'

    export default {
        data(){
            return {
                reservation: this._reservation
            }
        },
        props: {
          _reservation: Object
        },
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
          _reservation: {
            immediate: true,
            handler(reservation){
                this.reservation = reservation

            }
          }
            
        }
    }
</script>

<style scoped>

</style>
