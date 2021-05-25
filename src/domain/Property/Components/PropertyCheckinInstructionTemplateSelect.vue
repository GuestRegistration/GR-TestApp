<template>
    <v-select 
        :loading="loading"
        :items="items"
        item-text="title"
        item-value="id"
        dense
        v-on="$listeners"
        v-bind="$attrs"
        v-model="selected"
        :no-data-text="`${loading ? 'Please wait...': `No template created in the property yet. Create some under property settings first`}`"
    >
    
    <template v-slot:item="{ item, on }">

        <v-list-item v-on="on" three-line>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.body }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

    </template>
    </v-select>
</template>

<script>

import GET_PROPERTY_CHECKIN_INSTRUCTION_TEMPLATES from '../Queries/getPropertyCheckinInstructionTemplates';

export default {
    name: "PropertyCheckinInstructionTemplateSelect",

    props: {
        property: Object,
        templates: Array,
        value:{},
    },

    data(){
        return {
            loading: false,
            items: [],
            selected: null
        }
    },

    computed: {
        
    },

    methods: {
        getPropertyTemplates(){
            if(this.templates){
                this.items = this.templates;
                return;
            }
            this.loading = true;
            this.$store.dispatch('query', {
                query: GET_PROPERTY_CHECKIN_INSTRUCTION_TEMPLATES,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.items = response.data.getPropertyCheckinInstructionTemplates
            })
            .finally(() => {
                this.loading = false;
            })
        }
    },

    watch: {
        value: {
            immediate: true,
            handler(template) {
                this.selected = template
            }
        },
        
        property: {
            immediate: true,
            handler(property){
                if(property) this.getPropertyTemplates();
            }
        }
    }

}
</script>