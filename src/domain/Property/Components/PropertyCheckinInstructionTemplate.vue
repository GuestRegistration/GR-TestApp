<template>
     <v-card >
        <v-card-title>
            <h1 class="headline">{{ data_template.title }}</h1>
            <v-spacer></v-spacer>
            <v-icon @click="edit = !edit">mdi-pen</v-icon>
        </v-card-title>
        <v-card-text v-if="edit">
            <property-checkin-instruction-template-form :template="data_template" :property="property"  @updated="templateUpdated"  />
        </v-card-text>
    </v-card>
</template>

<script>
import PropertyCheckinInstructionTemplateForm from './PropertyCheckinInstructionTemplateForm';

export default {
    name: "PropertyCheckinInstructionTemplate",
    props: {
        property: Object,
        template: Object,
    },
    data(){
        return {
            edit: false,
            data_template: {},
        }
    },
    components: {
        PropertyCheckinInstructionTemplateForm
    },

    methods: {
        templateUpdated(template){
            this.data_template = template;
            this.edit = false;
        }
    },
    watch: {
        template: {
            immediate: true,
            handler(template){
                this.data_template = template
            }
        }
    }
}
</script>