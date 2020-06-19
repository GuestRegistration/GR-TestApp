<template>
  <div class="reservations">
    <template  v-if="report">
        <Report :_message="report" @close="report = null"/>
    </template>
    <template v-if="!app_ready">
        <Wait />
    </template>         
    
      <template v-if="reservations.loading">
            <v-dialog
               v-model="loading"
                hide-overlay
                persistent
                width="300"
                >
                <v-card
                    color="primary"
                    dark
                >
                    <v-card-text>
                    Please stand by
                    <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0"
                    ></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
      </template>
      <template v-else>
          <v-container>
              <v-row justify="center">
                  <v-col cols="12" sm="8" md="6">
                      <template v-if="reservations.data.length > 0">
                        <h3>My Reservations</h3>
                        <Reservation  v-for="reservation in reservations.data" :_reservation="reservation" :key="reservation.id" class="my-2" />
                      </template>
                      <template v-else>
                        <div class="text-center">
                            <p class="grey--text">No reservation found</p>
                        </div>
                     </template>
                  </v-col>
              </v-row>
          </v-container>
      </template>

  </div>
</template>

<script>
// @ is an alias to /src
import GET_USER_RESERVATIONS from '@/graphql/query/get_user_reservations'
import Reservation from '@/components/Reservation.vue'
import Wait from '@/components/Wait.vue'
import Report from '@/components/Report.vue'
import _apollo from './../apollo'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'reservations',
  components: {
    Reservation, Report, Wait
  },
  data(){
     return {
         loading: true,
         report: null,
         apollo: _apollo(),
         reservations: {
             loading: true,
             data: []
         }
     }
  },
  computed: {
      ...mapGetters([
          'app_ready'
      ])
  },
  props:[],
  mounted(){
    this.getReservations()
  },
  methods:{
      getReservations(){
          this.apollo.client.query({
              query: GET_USER_RESERVATIONS
          })
          .then(response => {
              this.reservations.data = response.data.getUserReservations
          })
          .catch(e => {
              console.log(e)
              this.report = e.message
          })
          .finally(() => {
              this.reservations.loading = false
          })
      }
  },
//   apollo:{
//     reservations: {
//     // graphql query
//         query: GET_USER_RESERVATIONS,
//         update: data => data.getUserReservations,
//         error(error) {
//             this.report = error.message
//         }
//     }
//   } 
}
</script>
