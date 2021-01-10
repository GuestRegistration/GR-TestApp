<template>
    <app-layer ref="app" >

        <v-container v-if="!property">
            <div class="text-center">
                <h1>We could not find that property</h1>
            </div>
        </v-container>

        <template v-else>
            <v-parallax
                dark
                src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
                height="300"
                >
                <v-row
                align="center"
                justify="center"
               
                >
                <v-col class="text-center" cols="12">
                <h1>{{ property.name }}</h1>
                    <p>{{ [property.address.street, property.address.city, property.address.state, property.address.country].join(', ') }}</p>
                    <v-icon color="white" v-if="property.phone_meta.complete_phone">mdi-phone</v-icon> {{ property.phone_meta.complete_phone }}
                    <br>
                    <v-icon color="white" v-if="property.email">mdi-email</v-icon>  {{ property.email }}
                </v-col>
                </v-row>
            </v-parallax>
                <slot v-bind="property">
            </slot>
        </template>
    </app-layer>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';

import helper from '@/helper';
import AppLayer from '@/AppLayer';

import GET_PROPERTY from '../Queries/getProperty';

export default {
    name: 'Property',
    components: {
        AppLayer,
    }, 
    data(){
        return {
            property: null,
        }
    },

    computed:{
         id(){
            return this.$route.params.property;
        },
    },

    mounted(){
        if(this.$route.params._property){
            this.property = this.$route.params._property;
            this.$refs.app.setState(true);
        }else{
            this.getProperty()
        }
    },
    
    methods:{
      ...mapActions([
          'query',
          'mutate',
      ]),

    getProperty(){
        this.$refs.app.setState(false, "Getting the property...");
        this.query({
            query: GET_PROPERTY,
            variables: {
                id: this.id
            }
        })
        .then(response => {
            this.property = response.data.getProperty;
        })
        .catch(e => {
            this.$refs.app.toastError({
                message: `Could not get property.`,
                retry: () => {
                    this.getProperty()
                },
                exception: e
            });
        })
        .finally(() => {
            this.$refs.app.setState(true);
        })
    },
  },
}
</script>
