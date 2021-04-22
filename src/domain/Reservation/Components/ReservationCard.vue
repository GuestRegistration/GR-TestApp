<template>
  <v-card
  >
    <v-card-text class="text-center">
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
          <h3>{{ reservation.property.name }}</h3> 
          <p>{{reservation.property.address}}</p>
          <p class="grey--text">{{ reservation.checkin_date }} - {{ reservation.checkout_date }}</p>
        </router-link>
    </v-card-text>  
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
