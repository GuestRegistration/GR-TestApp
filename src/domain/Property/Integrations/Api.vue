<template>
    <v-card class="my-2">
        <v-card-title><h4>API Key</h4></v-card-title>
        <v-card-subtitle>This a unique API key for {{ property.name }}.</v-card-subtitle>
        <v-card-text>
            <div class="my-2">
                <clip-board v-model="api_key" />
            </div>
            <v-btn class="mx-2" :loading="loading" @click="generateApiKey" color="primary"><v-icon>mdi-refresh</v-icon>  Generate key</v-btn>
        </v-card-text>
    </v-card>
</template>

<script>

import ClipBoard from '../../../components/Utilities/ClipBoard.vue';
import GENERATE_PROPERTY_API_KEY from '../Mutations/generatePropertyApiKey';

export default {
    name: "Api",
    components: {
        ClipBoard
    },
    props: {
        property: Object,
        integrations: Object,
    },
    data(){
        return {
            loading: false,
            api_key: ''
        }
    }, 

    methods: {
        generateApiKey() {
            this.loading = true;
            this.$store.dispatch('mutate', {
                mutation: GENERATE_PROPERTY_API_KEY,
                variables: {
                    property_id: this.property.id,
                }
            })
            .then(response => {
                this.api_key = response.data.generatePropertyApiKey;
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "API key generated",
                    color: "success"
                });
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: `Failed. `,
                    retry: () => this.generateApiKey(),
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },
    },

    watch: {
        integrations: {
            immediate: true,
            handler(integrations){
                if(integrations && integrations.api_key){
                    this.api_key = integrations.api_key
                }
            }
        }
    }
}
</script>