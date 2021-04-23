<template>
    <app-layer ref="app">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" sm="8" md="6">
                <h1 class="headline text-center">Update Property</h1>
                <v-tabs v-model="currentTab" @change="tabChanged" align-with-title>
                    <v-tabs-slider color="primary"></v-tabs-slider>
                    <v-tab v-for="tab in tabs" :key="tab.name" :disabled="tab.disabled">
                        {{ tab.name }}
                    </v-tab>
                </v-tabs>
                    <data-container :loading="loading">
                        <div class="mt-3">
                            <component :is="`${tab}-tab`" :property="property" @property-updated="propertyUpdated"></component>
                        </div>
                    </data-container>
                </v-col>
            </v-row>
        </v-container>
               
    </app-layer>
</template>

<script>
import AppLayer from '@/AppLayer';
import DataContainer from '../../../components/DataContainer.vue';
import InfoTab from '../Components/PropertyForm.vue';
import ChargesTab from '../Components/PropertyCharges.vue';
import GatewayTab from '../Components/PropertyStripeConnect.vue';
import GET_PROPERTY from '../Queries/getProperty';

export default {
    name: 'EditProperty',
    components: {
        AppLayer, DataContainer, InfoTab, ChargesTab, GatewayTab
    }, 
    data(){
        return {
            loading: false,
            property: null,
        }
    },

    computed:{

        tabs(){
            return [
                {
                    name: 'Info',
                    alias: 'info',
                    route: {name: this.$route.name, params: {tab: 'info'}},
                    disabled: false,
                },
                {
                    name: 'Gateway',
                    alias: 'gateway',
                    route: {name: this.$route.name, params: {tab: 'gateway'}},
                    disabled: false,
                },
                {
                    name: 'Charges',
                    alias: 'charges',
                    route: {name: this.$route.name, params: {tab: 'charges'}},
                    disabled: this.property ? !this.property.stripe_connected : true,
                }
          ]
        },

        id(){
            return this.$route.params.id
        },

         tab:{
            get: function() {
                return this.$route.params.tab ?  this.$route.params.tab  : 'info';
            },
            set: function(tab){}
        },

        currentTab: {
            get: function(){
                return this.tabs.findIndex(t => t.alias == this.tab)
            },
            set: function(tab){}
        },

    },
    
    methods:{
        getProperty(){
            this.loading = true;
            this.$store.dispatch('query', {
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
                this.loading = false;
            })
        },

        propertyUpdated(property){
            this.$refs.app.alert(`${property.name} updated successfully`, 'success');
            this.property = property;
            this.$store.commit('UPDATE_USER_PROPERTY', property)
            // this.$router.push({name: this.$route.name, params: { ...this.$route.params, tab: 'charges' }})
        },

        tabChanged(tab){
            this.$router.push(this.tabs[tab].route)
        }
    },

    mounted(){
        this.getProperty();
    }

}
</script>
