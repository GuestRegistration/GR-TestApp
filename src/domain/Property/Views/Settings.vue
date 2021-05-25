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
                    <v-toolbar-title>Property Settings <span v-if="property"> - {{ property.name }}</span> </v-toolbar-title>
                    </v-toolbar>
                    <v-tabs vertical v-model="currentTab" @change="tabChanged" color="primary">

                        <v-tab v-for="tab in tabs" :key="tab.name" :disabled="tab.disabled" class="d-flex">
                            <v-icon flex>
                               {{ tab.icon }}
                            </v-icon>
                            <span :class="{'d-none d-sm-block': !expandTab}">{{ tab.name }} </span>
                        </v-tab>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <data-container v-if="property" :loading="loading">
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
                                        <h4 class="ml-3">Property info</h4>
                                    </template>
                                </info-tab>
                            </data-container>
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <gateway-tab :property="property">
                                <template #heading>
                                    <h4 class="ml-3">Stripe Gateway</h4>
                                </template>
                            </gateway-tab>
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <integrations-tab :property="property">
                                <template #heading>
                                    <h4 class="ml-3">Integrations</h4>
                                </template>
                            </integrations-tab>
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <charges-tab :property="property">
                                <template #heading>
                                    <h4 class="ml-3">Charges</h4>
                                </template>
                            </charges-tab>
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <checkin-instructions-tab :property="property">
                                <template #heading>
                                    <h4 class="ml-3">Checkin instructions</h4>
                                </template>
                            </checkin-instructions-tab>
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <checkin-agreements-tab :property="property">
                                <template #heading>
                                    <h4 class="ml-3"> Checkin agreements</h4>
                                </template>
                            </checkin-agreements-tab>
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <checkin-questions-tab :property="property">
                                <template #heading>
                                    <h4 class="ml-3"> Checkin questions</h4>
                                </template>
                            </checkin-questions-tab>
                        </v-tab-item>

                        <v-tab-item class="pa-5" :class="{'d-none d-sm-block': expandTab}">
                            <property-subscription :property="property">
                                <template #heading>
                                    <h4 class="ml-3"> Subscription</h4>
                                </template>
                            </property-subscription>
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
import ChargesTab from '../Settings/PropertyCharges.vue';
import GatewayTab from '../Settings/PropertyStripeConnect.vue';
import IntegrationsTab from '../Settings/PropertyIntegrations.vue';
import CheckinInstructionsTab from '../Settings/PropertyCheckinInstructionTemplates';
import CheckinAgreementsTab from '../Settings/PropertyCheckinAgreements';
import CheckinQuestionsTab from '../Settings/PropertyCheckinQuestions';
import PropertySubscription from '../Settings/PropertySubscription';

import GET_PROPERTY from '../Queries/getProperty';

export default {
    name: 'EditProperty',
    components: {
        AppLayer, DataContainer, InfoTab, ChargesTab, GatewayTab, IntegrationsTab,
        CheckinInstructionsTab, CheckinAgreementsTab, CheckinQuestionsTab,
        PropertySubscription
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
                    disabled: this.property ? false : true,
                    icon: 'mdi-domain'
                },
                {
                    name: 'Gateway',
                    alias: 'gateway',
                    route: {name: this.$route.name, params: {tab: 'gateway'}},
                    disabled: this.property ? false : true,
                    icon: 'mdi-connection'
                },
                {
                    name: 'Integrations',
                    alias: 'integrations',
                    route: {name: this.$route.name, params: {tab: 'integrations'}},
                    disabled: this.property ? false : true,
                    icon: 'mdi-cog-box'
                },
                {
                    name: 'Charges',
                    alias: 'charges',
                    route: {name: this.$route.name, params: {tab: 'charges'}},
                    disabled: this.property ? false : true,
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
                    route: {name: this.$route.name, params: {tab: 'checkin-agreements'}},
                    disabled: this.property ? false : true,
                    icon: 'mdi-handshake'
                },
                {
                    name: 'Checkin Questions',
                    alias: 'checkin-questions',
                    route: {name: this.$route.name, params: {tab: 'checkin-questions'}},
                    disabled: this.property ? false : true,
                    icon: 'mdi-account-question'
                },
                {
                    name: 'Subscription',
                    alias: 'subscription',
                    route: {name: this.$route.name, params: {tab: 'subscription'}},
                    disabled: this.property ? false : true,
                    icon: 'mdi-credit-card'
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
                    retry: () => this.getProperty(),
                    exception: e
                });
            })
            .finally(() => {
                this.loading = false;
            })
        },

        propertyUpdated(property){
            this.property = property;
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
