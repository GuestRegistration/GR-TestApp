<template>
  <app-layer ref="app" @ready="ready">
    <h4>My Trips</h4>
     <div v-if="!reservations.length" class="pa-5">
       <p class="grey--text">No reservation</p>
    </div>
    <v-row>
      <v-col v-for="reservation in reservations" :key="reservation.id"
       cols="12" sm="6" md="4">
        <ReservationCard  :_reservation="reservation"  />
      </v-col>
    </v-row>
    <h4>Properties</h4>
    <div v-if="!properties.length" class="pa-5">
      <p class="grey--text">No property</p>
    </div>
    <v-row v-else>
      <v-col v-for="property in properties" :key="property.id"
       cols="12" sm="6" md="4">
        <PropertyCard  :_property="property"  />
      </v-col>
    </v-row>
  </app-layer>
</template>

<script>
import { mapGetters } from 'vuex';

import AppLayer from '@/AppLayer.vue';
import ReservationCard  from '@/domain/Reservation/Components/ReservationCard';
import PropertyCard from '@/domain/Property/Components/PropertyCard';

export default {
  name: 'Home',
  components: {
    AppLayer, PropertyCard, ReservationCard
  },
  computed: {
    ...mapGetters([
      'current_user',
      'profile_loaded'
    ]),
    reservations(){
      return this.profile_loaded && this.current_user.profile.reservations ? this.current_user.profile.reservations.map(reservation => {
        return {
          id: reservation.id,
          name: reservation.name,
          checkin_date: reservation.checkin_date,
          checkout_date: reservation.checkout_date,
          property: {
            id: reservation.property_id,
            name: reservation.property_name,
            image: reservation.property_image,
            address: reservation.property_address
          }
        }
      }) : [];
    },

    properties(){
      return this.profile_loaded && this.current_user.profile.properties ? this.current_user.profile.properties.map(property => {
        return {
          id: property.id,
          name: property.name,
          image: property.image,
          full_address: property.address
        }
      }) : []
    }
  },

  methods: {
    ready(){
      this.$refs.app.setState(true);
    }
  }
}
</script>
