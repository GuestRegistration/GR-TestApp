<template>
    <div>
        <p>This a unique API key for {{ property.name }}.</p>
        <v-text-field
            outlined
            id="api-key-input"
            label="API Key"
            type="text"
            v-model="api_key"
            :disabled="true"
            append-icon="mdi-key"
        ></v-text-field>
        <v-btn class="mx-2" v-if="api_key" @click="copyKey" color="primary"><v-icon>mdi-content-copy</v-icon>  Copy</v-btn>
        <v-btn class="mx-2" :loading="loading" @click="generateApiKey" color="primary"><v-icon>mdi-refresh</v-icon>  Generate key</v-btn>
    </div>
</template>

<script>

import GENERATE_PROPERTY_API_KEY from '../Mutations/generatePropertyApiKey';

export default {
    name: "PropertyIntegrations",
    props: {
        property: Object,
        integrations: String,
    },
    data(){
        return {
            loading: false,
            api_key: null
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

        copyKey() {
            const input = document.getElementById('api-key-input');
            input.select();
            if(document.execCommand('copy')){
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "API key copied to clipboard",
                    color: "success"
                });
            }else{
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "Could not copy key to clipboard",
                    color: "error"
                });
            }
        }
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