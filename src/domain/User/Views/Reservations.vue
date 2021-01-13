<template>
    <app-layer ref="app">
        <div class="notifications">    
          <v-container>
              <v-row justify="center">
                  <v-col cols="12" sm="8" md="6">
                    <v-tabs v-if="hasAnyProperty" v-model="currentTab" @change="tabChanged" align-with-title>
                        <v-tabs-slider color="primary"></v-tabs-slider>
                        <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
                    </v-tabs>

                    <template  v-if="tabs[currentTab] == 'user'">
                       <template v-if="reservations.data.length > 0">
                            <user-reservation  v-for="reservation in reservations.data" :_reservation="reservation" :key="reservation.id" class="my-2" />
                        </template>
                        <template v-else>
                            <div class="text-center">
                                <p class="grey--text">No reservation yet</p>
                            </div>
                        </template>
                    </template>

                    <template  v-if="tabs[currentTab] == 'property'">
                        <div class="my-5">
                            <property-switch @change="getPropertyNotifications" />
                        </div>
                        <template v-if="reservations.data.length > 0">
                            <property-reservation  v-for="reservation in reservations.data" :_reservation="reservation" :key="reservation.id" class="my-2" />
                        </template>
                        <template v-else>
                            <div class="text-center">
                                <p class="grey--text">No reservation created in {{ current_user.property.name }} yet</p>
                            </div>
                        </template>
                    </template>
                      
                  </v-col>
              </v-row>
          </v-container>
        </div>
    </app-layer>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'

import AppLayer from '@/AppLayer';
import UserReservation from '../../Reservation/Components/Reservation';
import PropertyReservation from '../../Property/Components/PropertyNotification';
import PropertySwitch from '../../Property/Components/PropertySwitch';

import GET_USER_RESERVATIONS from '../../Reservation/Queries/getUserReservations';
import GET_PROPERTY_RESERVATIONS from '../../Reservation/Queries/getPropertyReservations';

export default {
  name: 'Reservations',
  components: {
      AppLayer, 
      UserNotification, PropertyNotification, PropertySwitch
  }, 
  data(){
      return {
            tabs: ['my trips', 'property'],
            currentTab: 0,
            reservations: {
                data: []
            }
      }
  },

    computed:{
        ...mapGetters([
            'app_ready',
            'authenticated',
            'current_user',
        ]),
        hasAnyProperty(){
            return this.current_user.profile.properties && this.current_user.profile.properties.length
        }
    },

    methods:{
      ...mapActions([
          'query',
          'mutate',
        ]),

        tabChanged(){
            if(this.tabs[this.currentTab] == 'user'){
                this.getUserNotifications();
            }

            else if(this.tabs[this.currentTab] == 'property'){
                this.getPropertyNotifications();
            }
        },

        getUserReservations(){
          this.$refs.app.setState(false, 'Getting your reservations...')
          this.query({
              query: GET_USER_RESERVATIONS
          })
          .then(response => {
              this.reservations.data = response.data.getUserReservations
          })
          .catch(e => {
             this.$refs.app.toastError({
                 message: `Couldn't get your reservations.`,
                 retry: () => {
                     this.getUserReservations()
                 },
                 exception: e
             })
          })
          .finally(() => {
              this.$refs.app.setState(true);
          })
        },

        getPropertyReservations(){
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
                        this.getPropertyReservations()
                    },
                    exception: e
                })
            })
            .finally(() => {
                this.$refs.app.setState(true);
            })
        },

    },
    mounted(){
        this.getUserReservations();
    },


}
</script>
