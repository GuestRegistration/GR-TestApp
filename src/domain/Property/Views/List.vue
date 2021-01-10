<template>
    <app-layer ref="app" @ready="getProperties">
        <template #header>
            <h3>Properties</h3>
        </template>
        <v-container>
            <v-row v-if="properties.data.length">
                <v-col  v-for="property in properties.data" :key="property.id" 
                cols="12" sm="6" md="4" >
                    <PropertyCard  :_property="property" />
                </v-col>
            </v-row>
            <div v-else class="text-center">
                <p class="grey--text">No property yet</p>
            </div>
        </v-container>
        <PropertyFormDialog ref="propertyFormDialog" @success="propertyFormSuccess" />
        <v-btn
        class="mx-2"
        fab
        dark
        bottom
        right
        fixed
        color="primary"
        @click="$refs.propertyFormDialog.open()"
        >
        <v-icon dark>
            mdi-plus
        </v-icon>
    </v-btn>
    </app-layer>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import AppLayer from '@/AppLayer.vue';
import PropertyCard from '../Components/PropertyCard.vue';
import PropertyFormDialog from '../Components/PropertyFormDialog.vue';

// graphql
import GET_USER_PROPERTIES from '../Queries/getUserProperties';

export default {
  name: 'PropertyList',
  components: {
    AppLayer, PropertyCard, PropertyFormDialog
  },
  data(){
     return {
         properties: {
             data: []
         }
     }
  },
  computed: {
     
  },

  methods:{
      ...mapActions([
          'query',
          'mutate',
      ]),

       ...mapMutations([
          'ADD_USER_PROPERTY'
      ]),

    getProperties(){
          this.$refs.app.setState(false, 'Getting your properties...')
          this.query({
              query: GET_USER_PROPERTIES
          })
          .then(response => {
              this.properties.data = response.data.getUserProperties ? response.data.getUserProperties : []
          })
          .catch(e => {
             this.$refs.app.toastError({
                 message: `Couldn't get your properties.`,
                 retry: () => {
                     this.getProperties()
                 },
                 exception: e
             })
          })
          .finally(() => {
              this.$refs.app.setState(true);
          })
      },

      propertyFormSuccess(property){
            this.$refs.app.alert(`New property ${property.name} created successfully`, 'success');
            this.properties.data.push(property);
            this.ADD_USER_PROPERTY(property);
            this.$refs.propertyFormDialog.close();
      },

      propertyFormError(e){
          
      }
  },
}
</script>
