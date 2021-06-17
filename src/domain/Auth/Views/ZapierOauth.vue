<template>
    <app-layer ref="app">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" class="mt-2">
            <v-card outlined>
                <v-card-text>
                    <div class="d-flex align-center justify-center">
                        <img src="@/assets/img/logo.png" alt="Guest Registration Logo" width="80px" class="mx-2">
                        <img src="@/assets/img/zapier.png" alt="Zapier Logo" width="80px" class="mx-2">
                    </div>
                    <div class="text-center mb-5">
                        <h1>Authorize Zapier</h1>
                        <p>Select property to authorize with Zapier</p>
                    </div>
                    <data-container :loading="loading">
                        <v-select
                            outlined
                            class="mx-2"
                            :items="properties"
                            item-text="name"
                            item-value="id"
                            dense
                            v-model="selected"
                            label="Select property"
                        ></v-select>
                    </data-container>
                    <div class="text-center">
                        <v-btn color="primary" :disabled="selected == null" @click="authorize" :loading="authorizing">Authorize</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
      </v-row>
    </app-layer>
</template>

<script>
    import gql from 'graphql-tag';
    import { mapActions, mapMutations } from 'vuex';
    import AppLayer from '@/AppLayer';
    import DataContainer from '../../../components/DataContainer.vue';
    import GET_USER_PROPERTIES from '../../Property/Queries/getUserProperties';
    import config from '../../../config';

    export default {
        name: 'ZapierOauth',
        components:{
           AppLayer, DataContainer
        },
        data(){
            return {
                loading: false,
                authorizing: false,
                properties: [],
                selected: null
            }
        },

        computed: {
            redirect_uri(){
                return this.$route.query.redirect_uri
            }
        },
        methods: {
            ...mapActions([
                'query',
                'mutate',
            ]),

            ...mapMutations([
                'SNACKBAR',
                'TOAST_ERROR'
            ]),

            getProperties() {
                this.loading = true;
                this.query({
                    query: GET_USER_PROPERTIES
                })
                .then(response => {
                    this.properties = response.data.getUserProperties ? response.data.getUserProperties : []
                })
                .catch(e => {
                    this.TOAST_ERROR({
                        show: true,
                        message: `Couldn't get your properties.`,
                        retry: () => this.getProperties(),
                        exception: e
                    })
                })
                .finally(() => {
                    this.loading = false;
                })
            },

            getCode(){
                
            },

            authorize() {
                const { client_id, redirect_uri, response_type, state } = this.$route.query;

                if(!client_id || !response_type || !state) {
                    this.SNACKBAR({
                        status: true,
                        text: "Incomplete request",
                        color: "error"
                    });
                    return;
                }

                this.authorizing = true;

                this.mutate({
                    mutation: gql `
                    mutation generateZapierOauthCode($property_id: ID!, $client_id: ID!, $redirect_uri: String, $response_type: String!, $state: String!){
                            generateZapierOauthCode(property_id: $property_id, client_id: $client_id, redirect_uri: $redirect_uri, response_type: $response_type, state: $state)
                        }
                    `,
                    variables: {
                        property_id: this.selected,
                        client_id, redirect_uri, response_type, state
                    }
                }).then(response => {
                    window.location.href = response.data.generateZapierOauthCode;
                })
                .catch(e => {
                    this.TOAST_ERROR({
                        show: true,
                        message: `Authorization failed.`,
                        retry: () => this.authorize(),
                        exception: e
                    });
                })
                .finally(() => {
                    this.authorizing = false;
                })
            }
        },

        mounted(){
            this.$store.commit('SET_APP_LAYOUT', 'plain');
            this.getProperties();
        },

    }
</script>

