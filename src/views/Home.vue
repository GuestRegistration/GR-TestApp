<template>
  <app-layer ref="app">
    <h3>Recent Checkins</h3>
     <div v-if="!reservations.length" class="pa-5">
       <p class="grey--text text-center">No reservation</p>
    </div>
    <div v-else>
      <v-row >
        <v-col v-for="reservation in reservations" :key="reservation.id"
        cols="12" sm="6" md="4">
          <ReservationCard  :_reservation="reservation"  />
        </v-col>
      </v-row>
      <div class="text-right my-3">
        <router-link :to="{name: 'reservation.list'}" class="text-decoration-none"> All reservations</router-link>
      </div>
    </div>
    
    <div v-if="!properties.length" class="pa-5">
      <div class="text-center">
         <p class="grey--text text-center">Become a host, create your propertyty</p>
         <router-link :to="{name: 'property.create'}" class="text-decoration-none">
           <v-btn color="primary">
             Create property
           </v-btn>
         </router-link>
      </div>
    </div>
    <div v-else>
      <h3>Properties</h3>
        <v-row >
          <v-col v-for="property in properties" :key="property.id"
          cols="12" sm="6" md="4">
          <property-card  :_property="property" >
            <template #action>
              <!-- <v-icon v-if="property.active" color="success" class="mx-2" title="Subscription active">mdi-check-circle</v-icon>
              <v-icon v-else color="error"  class="mx-2" title="Subscription not active">mdi-close-circle</v-icon> -->
              <router-link :to="{name: 'property.settings', params: {id: property.id}}" class="text-decoration-none">
                <v-btn icon><v-icon>mdi-cog</v-icon></v-btn>
              </router-link >
            </template>
          </property-card>
          </v-col>
        </v-row>
        <div class="text-right my-3">
          <router-link :to="{name: 'property.list'}" class="text-decoration-none">All properties</router-link>
        </div>
    </div>
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
    ]),
    reservations(){
      return this.current_user.profile.reservations ? this.current_user.profile.reservations.map(reservation => {
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
      return this.current_user.profile.properties ? this.current_user.profile.properties.map(property => {
        return {
          id: property.id,
          name: property.name,
          image: property.image,
          full_address: property.address
        }
      }) : []
    }
  },

}
</script>
