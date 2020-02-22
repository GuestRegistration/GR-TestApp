<template>
    <div>
        <v-container>
            <v-row justify="center">
                <v-col md="6">
                    <h2 class="text-center">Reservation</h2>
                    <div v-if="$apollo.queries.reservation.loading">
                        <v-skeleton-loader
                                height="80"
                                type="list-item-two-line"
                        >
                        </v-skeleton-loader>
                    </div>
                    <div v-else>
                        <h1 v-if="reservation == null" color="grey" class="text-center">We cannot find that reservation</h1>
                        <div v-else>
                           <v-card outlined>
                                <v-list-item>
                                    <v-list-item-avatar color="grey"></v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title class="headline">{{reservation.property.name}}</v-list-item-title>
                                        <v-list-item-subtitle>{{reservation.property.city}}, {{reservation.property.country}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-card-text>
                                   Reservation for {{reservation.name}}
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn
                                        text
                                        dark color="accent-4"
                                        class="primary"
                                    >
                                        Continue to checkin
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </div>
                    </div>

                    
                </v-col>
            </v-row>
        </v-container>
        
    </div>
</template>

<script>

import gql from 'graphql-tag'

export default {
  name: 'reservation',

  data(){
      return {
        id: this.$route.params.reservation,
        reservation: null,
      }
  },
  components: {
    
  },
  created(){
      this
  },
  apollo:{
    reservation: {
    // graphql query
        query(){
            
            return gql`
                query getReservation($id: String!){
                    getReservation(id: $id){
                        id
                        name
                        checkin_date
                        checkout_date
                        property{
                            id
                            name
                            city
                            country
                            image
                        }
                        guests{
                            name
                            gender
                            type
                        }
                    
                    }
                }`
        },
        variables(){
            return {
                id: this.id
            }
        },
        update: data => data.getReservation
        
    }
  } 
}
</script>
