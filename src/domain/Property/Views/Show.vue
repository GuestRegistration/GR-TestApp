<template>
    <app-layer ref="app">
        <data-container :loading="loading">
            <template v-slot:loading>
                <property-skeleton />
            </template>
            <v-container v-if="!property">
                <div class="text-center">
                    <h1>We could not find that property</h1>
                </div>
            </v-container>

            <template v-else>
                <v-row
                align="center"
                justify="center"
                
                >
                    <v-col class="text-center" cols="12">
                        

                        <v-avatar color="primary" size="150">
                            <v-img
                            v-if="property.image"
                            :src="property.image"
                            ></v-img>
                            <v-img v-else
                                src="@/assets/img/default-property.jpg"
                            ></v-img>
                        </v-avatar>
                        <div class="d-flex justify-center align-center">
                            <h1>{{ property.name }}</h1>
                            <v-btn v-if="property.user_id == current_user.auth.uid" icon title="Edit property" color="primary" class="ml-3" @click="$router.push({name: 'property.settings', params: {id: property.id}})">
                                <v-icon>mdi-cog</v-icon>
                            </v-btn>
                        </div>
                    
                        <p v-if="property.full_address">{{ property.full_address }}</p>
                        <v-icon color="white" v-if="property.phone">mdi-phone</v-icon> {{ property.phone }}
                        <br>
                        <v-icon color="white" v-if="property.email">mdi-email</v-icon>  {{ property.email }}
            
                    </v-col>
                </v-row>

                <slot v-bind="property" />
            </template>
        </data-container>
    </app-layer>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

import AppLayer from '@/AppLayer';
import DataContainer from '../../../components/DataContainer.vue';
import PropertySkeleton from '../Components/PropertySkeleton.vue';

import GET_PROPERTY from '../Queries/getProperty';

export default {
    name: 'Property',
    components: {
        AppLayer, DataContainer, PropertySkeleton
    }, 
    data(){
        return {
            loading: false,
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
        this.getProperty();
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
            this.loading = true;
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
                    retry: () => this.getProperty(),
                    exception: e
                });
            })
            .finally(() => {
                this.loading = false;
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
