<template>
    <v-select 
        :loading="loading"
        :items="items"
        item-text="title"
        item-value="id"
        dense
        v-on="$listeners"
        v-bind="$attrs"
        no-data-text="No charge yet"
    >
    
    <template v-slot:item="{ item, on }">

        <v-list-item v-on="on" :disabled="!item.enable">
            <v-list-item-action>
              <v-checkbox :input-value="selected.map(s => s.id).includes(item.id)"></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

    </template>
    </v-select>
</template>

<script>

import GET_PROPERTY_CHARGES from '../Queries/getPropertyCharges';

export default {
    name: "PropertyChargesSelect",

    props: {
        property: Object,
        charges: Array,
        value:{}
    },

    data(){
        return {
            loading: false,
            items: [],
            selected: []
        }
    },

    computed: {
        
    },

    methods: {
        getPropertyCharges(){
            if(this.charges){
                this.items = this.charges;
                return;
            }
            this.loading = true;
            this.$store.dispatch('query', {
                query: GET_PROPERTY_CHARGES,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.items = response.data.getPropertyCharges.map( charge => {
                            delete charge.__typename;
                            return charge
                        })
            })
            .finally(() => {
                this.loading = false;
            })
        }
    },

    mounted(){
        
    },

    watch: {
        value: {
            immediate: true,
            handler(charges) {
                if(!charges) return
                this.selected = charges instanceof Array ? charges : [charges]
            }
        },
        property: {
            immediate: true,
            handler(property){
                if(property) this.getPropertyCharges();
            }
        }
    }

}
</script>