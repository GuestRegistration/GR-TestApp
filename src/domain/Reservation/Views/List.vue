<template>
    <app-layer ref="app" @ready="ready">
        <div class="notifications">    
          <v-container>
              <v-row justify="center">
                  <v-col cols="12" sm="8" md="6">

                    <v-tabs v-if="hasAnyProperty" v-model="currentTab" @change="tabChanged" align-with-title>
                        <v-tabs-slider color="primary"></v-tabs-slider>
                        <v-tab v-for="tab in tabs" :key="tab.name">{{ tab.name }}</v-tab>
                    </v-tabs>

                    <component :is="`${reservation}-reservations`"></component>
                      
                  </v-col>
              </v-row>
              
          </v-container>
        </div>
    </app-layer>
</template>

<script>
import AppLayer from '@/AppLayer';
import PersonalReservations from '../Widgets/UserReservations.vue';
import PropertyReservations from '../Widgets/PropertyReservations.vue';

export default {
  name: 'Reservations',
  components: {
      AppLayer, PersonalReservations, PropertyReservations
  }, 
  data(){
      return {
            tabs: [
                {
                    name: 'My Trips',
                    alias: 'personal',
                    route: {name: 'reservation.list', params: {reservation: 'personal'}}
                },
                {
                    name: 'Property',
                    alias: 'property',
                    route: {name: 'reservation.list', params: {reservation: 'property'}}
                }
            ],
      }
  },

    computed:{
        hasAnyProperty(){
            return this.$store.getters.current_user.profile.properties && this.$store.getters.current_user.profile.properties.length
        },

        reservation(){
            return this.$route.params.reservation ?  this.$route.params.reservation  : 'personal';
        },

        currentTab: {
            get: function(){
                return this.tabs.findIndex(t => t.alias == this.reservation)
            },
            set: function(tab){}
        }
    },

    methods:{

        ready(){
            this.$refs.app.setState(true);
        },

        tabChanged(tab){
            this.$router.push(this.tabs[tab].route)
        }

    },

}
</script>
