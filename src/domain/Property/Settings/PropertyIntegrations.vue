<template>
    <div>
        <slot name="heading" />
        <data-container v-if="property" :loading="loading">
            <property-api-key :property="property" :integrations="integrations" />
        </data-container>
    </div>
</template>

<script>
import DataContainer from '../../../components/DataContainer.vue';
import PropertyApiKey from '../Components/PropertyApiKey.vue';

import GET_PROPERTY_INTEGRATIONS from '../Queries/getPropertyIntegrations';

export default {
    name: "PropertyIntegrations",
    components: {
        DataContainer, PropertyApiKey
    },
    props: {
        property: Object,
    },
    data(){
        return {
            loading: true,
            integrations: null
        }
    }, 

    methods: {
        getPropertyIntegrations(){
            this.loading = true;
           
             this.$store.dispatch('query', {
                query: GET_PROPERTY_INTEGRATIONS,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.integrations = response.data.getPropertyIntegrations
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => this.getPropertyIntegrations(),
                    message: 'Could not get property integrations',
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },
    },

    watch: {
        property: {
            immediate: true,
            handler(property){
                if(property) this.getPropertyIntegrations()
                else this.loading = false;
            }
        }
    }
}
</script>