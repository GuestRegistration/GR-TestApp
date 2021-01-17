<template>
    <app-layer ref="app" @ready="getProperty">

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
                    <p v-if="property.full_address">{{ property.full_address }}</p>
                    <v-icon color="white" v-if="property.phone">mdi-phone</v-icon> {{ property.phone }}
                    <br>
                    <v-icon color="white" v-if="property.email">mdi-email</v-icon>  {{ property.email }}
                    <br>
                    <v-btn v-if="property.user_id == current_user.auth.uid" color="primary" @click="$refs.propertyFormDialog.open()" class="mt-5"> Edit property</v-btn>
                </v-col>
                </v-row>
            </v-parallax>
                <slot v-bind="property">
            </slot>
        </template>
        <PropertyFormDialog ref="propertyFormDialog" :property="property" @success="propertyFormSuccess" />
    </app-layer>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';

import helper from '@/helper';
import AppLayer from '@/AppLayer';
import PropertyFormDialog from '../Components/PropertyFormDialog';

import GET_PROPERTY from '../Queries/getProperty';

export default {
    name: 'Property',
    components: {
        AppLayer, PropertyFormDialog
    }, 
    data(){
        return {
            property: null,
        }
    },

    computed:{
        ...mapGetters([
            'current_user'
        ]),
         id(){
            return this.$route.params.id;
        },
    },

    mounted(){
        //this.getProperty();
        
        // if(this.$route.params._property){
        //     this.property = this.$route.params._property;
        //     this.$refs.app.setState(true);
        // }else{
        //     this.getProperty()
        // }
    },
    
    methods:{
        ...mapActions([
            'query',
            'mutate',
        ]),
        ...mapMutations([
            'UPDATE_USER_PROPERTY'
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
        propertyFormSuccess(property){
            this.property = property;
            this.$refs.app.alert(`Property updated`, 'success');
            this.UPDATE_USER_PROPERTY(property);
            this.$refs.propertyFormDialog.close();
        },
    },
}
</script>
