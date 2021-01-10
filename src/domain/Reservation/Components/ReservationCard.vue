<template>
  <v-card
    max-width="344"
  >
    <v-img
      :src="reservation.property.image"
      height="200px"
    ></v-img>

    <v-card-title>
      <router-link :to="{name: 'property.show', params: {property: reservation.property.id}}">
        {{ reservation.property.name }}
      </router-link>
    </v-card-title>

    <v-card-subtitle>
      {{ reservation.property.city }} {{ reservation.property.country }}
    </v-card-subtitle>

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
