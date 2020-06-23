<template>
    <app-layer ref="app">
        <div class="reservations">    
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
        </div>
    </app-layer>
</template>

<script>
// @ is an alias to /src
import GET_USER_RESERVATIONS from '@/graphql/query/get_user_reservations'
import Reservation from '@/components/Reservation.vue'
import AppLayer from '@/AppLayer.vue'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Reservations',
  components: {
    Reservation, AppLayer
  },
  data(){
     return {
         reservations: {
             data: []
         }
     }
  },
  computed: {

    },
  props:[],
  mounted(){
    this.getReservations()
  },
  methods:{
      ...mapActions([
          'query',
          'mutate',
      ]),

    getReservations(){
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
                     this.getReservations()
                 },
                 exception: e
             })
          })
          .finally(() => {
              this.$refs.app.setState(true);
          })
      }
  },
}
</script>
