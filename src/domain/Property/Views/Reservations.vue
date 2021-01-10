<template>
    <app-layer ref="app" @ready="getReservations">
        <template #header>
            <h3>Reservations</h3>
            <p v-if="current_user.property.name">Reservations in {{ current_user.property.name }}</p>
        </template>
        <div class="reservations">    
          <v-container>
              <v-row>
                  <v-col cols="12" sm="8" md="6">
                      <template v-if="reservations.data.length > 0">
                        <PropertyReservation  v-for="reservation in reservations.data" :_reservation="reservation" :key="reservation.id" class="my-2" />
                      </template>
                      <template v-else>
                        <div class="text-center">
                            <p class="grey--text">No reservation created in {{ current_user.property.name }} yet</p>
                        </div>
                     </template>
                  </v-col>
              </v-row>
            
          </v-container>
            <ReservationFormDialog ref="reservationFormDialog" @success="reservationFormSuccess" :property="current_user.property" />
            <v-btn
                class="mx-2"
                fab
                dark
                bottom
                right
                fixed
                color="primary"
                @click="$refs.reservationFormDialog.open()"
                >
                <v-icon dark>
                    mdi-plus
                </v-icon>
              </v-btn>
        </div>
    </app-layer>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import AppLayer from '@/AppLayer.vue';
import PropertyReservation from '../../Reservation/Components/PropertyReservation.vue';
import ReservationFormDialog from '../../Reservation/Components/ReservationFormDialog.vue';

// graphql
import GET_PROPERTY_RESERVATIONS from '../../Reservation/Queries/getPropertyReservations';

export default {
    name: 'PropertyReservations',
    components: {
        AppLayer, PropertyReservation, ReservationFormDialog
    },
    data(){
        return {
            reservations: {
                data: []
            }
        }
    },
    computed: {
        ...mapGetters([
            'current_user'
        ])
        },
    props:[], 
    
    created() {
        this.$eventHub.$on('property-switched', this.getReservations);
    },
    beforeDestroy() {
        this.$eventHub.$off('property-switched');
    },

    methods:{
        ...mapActions([
            'query',
            'mutate',
        ]),

        getReservations(){
            this.$refs.app.setState(false, `Getting reservations in ${this.current_user.property.name}...`);
            this.query({
                query: GET_PROPERTY_RESERVATIONS,
                variables: {
                    id: this.current_user.property.id
                }
            })
            .then(response => {
                this.reservations.data = response.data.getPropertyReservations
            })
            .catch(e => {
                this.$refs.app.toastError({
                    message: `Couldn't get reservations.`,
                    retry: () => {
                        this.getReservations()
                    },
                    exception: e
                })
            })
            .finally(() => {
                this.$refs.app.setState(true);
            })
        },

        reservationFormSuccess(reservation){
            this.$refs.app.alert(`New reservation created for ${reservation.name}`, 'success');
            this.reservations.data.push(reservation);
            this.$refs.reservationFormDialog.close();
        }
    },
}
</script>
