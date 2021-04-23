<template>
    <app-layer ref="app">
        <v-row justify="center">
            <v-col cols="12" md="10">
                <v-alert 
                    v-if="$route.params.new"
                    border="top"
                    colored-border
                    elevation="2"
                    class="my-2"
                    type="success">
                    Your property has been created, continue to setup...
                </v-alert>
                <v-card flat>
                    <v-toolbar
                    flat
                    >
                    <v-app-bar-nav-icon class="d-sm-none" @click="expandTab = !expandTab"></v-app-bar-nav-icon>
                    <v-toolbar-title>Update Property <span v-if="property"> - {{ property.name }}</span> </v-toolbar-title>
                    </v-toolbar>
                    <v-tabs vertical v-model="currentTab" @change="tabChanged" color="primary">
                        <v-tab v-for="tab in tabs" :key="tab.name" :disabled="tab.disabled" class="d-flex">
                            <v-icon flex>
                               {{ tab.icon }}
                            </v-icon>
                            <span :class="{'d-none d-sm-block': !expandTab}">{{ tab.name }} </span>
                        </v-tab>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <data-container :loading="loading">
                                <template v-slot:loading>
                                    <div  v-for="i in 4" :key="i">
                                        <v-skeleton-loader
                                            type="card"
                                            height="50"
                                            class="my-2"
                                        ></v-skeleton-loader>
                                    </div>
                                </template>
                                <info-tab :property="property" @property-updated="propertyUpdated">
                                    <template #heading>
                                        <h2 class="ml-3">Property info</h2>
                                    </template>
                                </info-tab>
                            </data-container>
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <gateway-tab :property="property">
                                <template #heading>
                                    <h2 class="ml-3">Stripe Gateway</h2>
                                </template>
                            </gateway-tab>
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <charges-tab :property="property">
                                <template #heading>
                                    <h2 class="ml-3">Property charges</h2>
                                </template>
                            </charges-tab>
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <checkin-instructions-tab :property="property">
                                <template #heading>
                                    <h2 class="ml-3">Property checkin instructions</h2>
                                </template>
                            </checkin-instructions-tab>
                        </v-tab-item>

                    </v-tabs>
                </v-card>
            </v-col>
        </v-row>
    </app-layer>
</template>

<script>
import AppLayer from '@/AppLayer';
import DataContainer from '../../../components/DataContainer.vue';
import InfoTab from '../Components/PropertyForm.vue';
import ChargesTab from '../Widgets/PropertyCharges.vue';
import GatewayTab from '../Widgets/PropertyStripeConnect.vue';
import CheckinInstructionsTab from '../Widgets/PropertyCheckinInstructionTemplates';
import GET_PROPERTY from '../Queries/getProperty';

export default {
    name: 'EditProperty',
    components: {
        AppLayer, DataContainer, InfoTab, ChargesTab, GatewayTab,
        CheckinInstructionsTab
    }, 
    data(){
        return {
            loading: false,
            property: null,
            expandTab: false,
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
                    icon: 'mdi-domain'
                },
                {
                    name: 'Gateway',
                    alias: 'gateway',
                    route: {name: this.$route.name, params: {tab: 'gateway'}},
                    disabled: false,
                    icon: 'mdi-connection'
                },
                {
                    name: 'Charges',
                    alias: 'charges',
                    route: {name: this.$route.name, params: {tab: 'charges'}},
                    disabled: this.property && this.property.stripe_connected ? false : true,
                    icon: 'mdi-credit-card'
                },
                {
                    name: 'Checkin Instructions',
                    alias: 'checkin-instructions',
                    route: {name: this.$route.name, params: {tab: 'checkin-instructions'}},
                    disabled: this.property ? false : true,
                    icon: 'mdi-information'
                },
                {
                    name: 'Checkin Agreements',
                    alias: 'checkin-agreements',
                    route: null,
                    disabled: this.property ? false : true,
                    icon: 'mdi-handshake'
                },
                {
                    name: 'Checkin Questions',
                    alias: 'checkin-agreements',
                    route: null,
                    disabled: this.property ? false : true,
                    icon: 'mdi-account-question'
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
            if(!this.tabs[tab].route) return;
            this.expandTab = false;
            this.$router.push(this.tabs[tab].route)
        }
    },

    mounted(){
        this.getProperty();
    }

}
</script>
