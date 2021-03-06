<template>
    <app-layer ref="app">
        <template #header>
            <div class="d-flex">
                <h3 class="mr-2">Properties</h3> 
                <router-link :to="{name: 'property.create'}" class="text-decoration-none">
                    <v-btn
                        class="mx-2"
                        dark
                        color="primary"
                        >
                        <v-icon dark>
                            mdi-plus
                        </v-icon> 
                        Create New
                    </v-btn>
                </router-link>
            </div>
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
                        <property-card :_property="property">
                            <template #action>
                                <v-icon v-if="property.active" color="success" class="mx-2" title="Subscription active">mdi-check-circle</v-icon>
                                <v-icon v-else color="error"  class="mx-2" title="Subscription not active">mdi-close-circle</v-icon>
                                <property-link :to="{name: 'property.settings', params: {id: property.id}}" class="text-decoration-none">
                                    <v-btn icon><v-icon>mdi-cog</v-icon></v-btn>
                                </property-link >
                            </template>
                        </property-card>
                    </v-col>
                </v-row>
                <div v-else class="text-center">
                    <p class="grey--text">No property yet</p>
                </div>
            </data-container>
           
        </v-container>
        
    </app-layer>
</template>

<script>

// @ is an alias to /src
import { mapActions, mapMutations } from 'vuex'

import AppLayer from '@/AppLayer.vue';
import PropertyCard from '../Components/PropertyCard.vue';
import DataContainer from '../../../components/DataContainer.vue';
import PropertyCardSkeleton from '../Components/PropertyCardSkeleton.vue';
import PropertyLink from '../Components/PropertyLink.vue';

// graphql
import GET_USER_PROPERTIES from '../Queries/getUserProperties';

export default {
  name: 'PropertyList',
  components: {
    AppLayer, PropertyCard, DataContainer, PropertyCardSkeleton, PropertyLink
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
                retry: () => this.getProperties(),
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
