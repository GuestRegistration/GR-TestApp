<template>
    <app-layer ref="app" @ready="ready">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" sm="8" md="6">
                    <h1 class="headline text-center" >New Property</h1>
                     <v-alert 
                        v-if="property"
                        border="top"
                        colored-border
                        elevation="2"
                        class="my-2"
                        type="success">
                        Your property has been created 
                    </v-alert>
                    <v-tabs v-model="currentTab" @change="tabChanged" align-with-title>
                        <v-tabs-slider color="primary"></v-tabs-slider>
                        <v-tab v-for="tab in tabs" :key="tab.name" :disabled="tab.alias !== 'info' && (property == null || property == undefined)">
                            {{ tab.name }}
                        </v-tab>
                    </v-tabs>

                    <div class="mt-3">
                        <component :is="`${tab}-tab`" @property-created="propertyCreated" :property="property"></component>
                    </div>

                </v-col>
            </v-row>
        </v-container>
               
    </app-layer>
</template>

<script>
import AppLayer from '@/AppLayer';
import InfoTab from '../Components/PropertyForm.vue';
import ChargesTab from '../Components/PropertyCharges.vue';
import StripeTab from '../Components/PropertyStripeConnect.vue';

export default {
    name: 'CreateProperty',
    components: {
        AppLayer, InfoTab, ChargesTab, StripeTab
    }, 
    data(){
        return {
            property: null,
            tabs: [
                {
                    name: 'Info',
                    alias: 'info',
                    route: {name: this.$route.name, params: {tab: 'info'}}
                },
                {
                  name: 'Stripe',
                  alias: 'stripe',
                  route: {name: this.$route.name, params: {tab: 'stripe'}}
                },
                {
                  name: 'Charges',
                  alias: 'charges',
                  route: {name: this.$route.name, params: {tab: 'charges'}}
                },
               
          ],
        }
    },

    computed:{

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
        ready(){
            this.$refs.app.setState(true);
        },

        tabChanged(tab){
            this.$router.push(this.tabs[tab].route)
        },

        propertyCreated(property){
            this.$refs.app.alert(`New property ${property.name} created successfully`, 'success');
            this.property = property;
            this.$store.commit('ADD_USER_PROPERTY', property)
            this.$router.push({name: this.$route.name, params: { ...this.$route.params, tab: 'stripe' }})
        }
    },
}
</script>
