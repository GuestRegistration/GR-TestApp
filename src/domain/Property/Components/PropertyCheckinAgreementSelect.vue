<template>
    <v-select 
        dense
        :loading="loading"
        :items="items"
        item-text="agreement"
        item-value="agreement"
        v-on="$listeners"
        v-bind="$attrs"
        :no-data-text="`${loading ? 'Please wait...': `No agreement created in the property yet. Create some under property settings first`}`"
    >
    
    <!-- <template v-slot:item="{ item, on }">

        <v-list-item v-on="on" three-line>
            <v-list-item-content>
              <v-list-item-title>{{ item.agreement }}</v-list-item-title>
              <v-list-item-subtitle v-if="item.link">{{ item.link }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

    </template> -->
    </v-select>
</template>

<script>

import GET_PROPERTY_CHECKIN_AGREEMENTS from '../Queries/getPropertyCheckinAgreements';

export default {
    name: "PropertyCheckinAgreementSelect",

    props: {
        property: Object,
        agreements: Array,
    },

    data(){
        return {
            loading: false,
            items: [],
        }
    },

    computed: {
        
    },

    methods: {
        getPropertyAgreements(){
            if(this.agreements){
                this.items = this.agreements;
                return;
            }
            this.loading = true;
            this.$store.dispatch('query', {
                query: GET_PROPERTY_CHECKIN_AGREEMENTS,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.items = response.data.getPropertyCheckinAgreements ? response.data.getPropertyCheckinAgreements  : []
            })
            .finally(() => {
                this.loading = false;
            })
        }
    },

    watch: {        
        property: {
            immediate: true,
            handler(property){
                if(property) this.getPropertyAgreements();
            }
        }
    }

}
</script>