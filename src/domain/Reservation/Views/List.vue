<template>
    <app-layer ref="app">
        <template #header>
            <h3 class="text-center">Reservations</h3>
        </template>
            <v-row v-if="hasAnyProperty" justify="center">
                <v-col cols="12" sm="8" md="6">
                    <v-tabs v-model="currentTab" @change="tabChanged" align-with-title grow icons-and-text>
                        <v-tabs-slider color="primary"></v-tabs-slider>
                        <v-tab v-for="tab in tabs" :key="tab.name">
                            {{ tab.name }}
                            <v-icon>{{tab.icon}}</v-icon>
                        </v-tab>
                    </v-tabs>
                </v-col>
            </v-row>
            <component :is="`${reservation}-reservations`"></component>
    </app-layer>
</template>

<script>
import AppLayer from '@/AppLayer';
import PersonalReservations from '../Widgets/UserReservations.vue';
import PropertyReservations from '../Widgets/PropertyReservationsTable.vue';

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
                    route: {name: 'reservation.list', params: {reservation: 'personal'}},
                    icon: 'mdi-account'
                },
                {
                    name: 'Property',
                    alias: 'property',
                    route: {name: 'reservation.list', params: {reservation: 'property'}},
                    icon: 'mdi-domain'
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

        tabChanged(tab){
            this.$router.push(this.tabs[tab].route)
        }

    },

}
</script>
