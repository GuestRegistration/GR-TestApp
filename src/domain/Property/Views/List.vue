<template>
    <app-layer ref="app">
        <template #header>
            <h3>Properties</h3>
        </template>
        <v-container>
            <data-container :loading="loading">
                <template v-slot:loading>
                    <v-row>
                        <v-col cols="12" sm="6" md="4" v-for="i in 6" :key="i">
                            <property-card-skeleton class="ma-2" />
                        </v-col>
                    </v-row>
                </template>
                 <v-row v-if="properties.data.length">
                    <v-col  v-for="property in properties.data" :key="property.id" 
                    cols="12" sm="6" md="4" >
                        <PropertyCard  :_property="property" />
                    </v-col>
                </v-row>
                <div v-else class="text-center">
                    <p class="grey--text">No property yet</p>
                </div>
            </data-container>
           
        </v-container>
        <v-btn
        class="mx-2"
        fab
        dark
        bottom
        right
        fixed
        color="primary"
        @click="$router.push({name: 'property.create'})"
        >
        <v-icon dark>
            mdi-plus
        </v-icon>
    </v-btn>
    </app-layer>
</template>

<script>

// @ is an alias to /src
import { mapActions, mapMutations } from 'vuex'

import AppLayer from '@/AppLayer.vue';
import PropertyCard from '../Components/PropertyCard.vue';
import DataContainer from '../../../components/DataContainer.vue';
import PropertyCardSkeleton from '../Components/PropertyCardSkeleton.vue';

// graphql
import GET_USER_PROPERTIES from '../Queries/getUserProperties';

export default {
  name: 'PropertyList',
  components: {
    AppLayer, PropertyCard, DataContainer, PropertyCardSkeleton
  },
  data(){
     return {
         loading: false,
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
        this.loading = true;
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
            this.loading = false;
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
  mounted(){
      this.getProperties();
  }
}
</script>
