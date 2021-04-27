<template>
    <div>
        <slot name="heading" />
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
            <div class="d-flex justify-end">
                <v-btn color="primary"  icon title="New template" @click="createNewTemplate = true"><v-icon dark> mdi-plus</v-icon> </v-btn>
            </div>

            <v-card v-if="createNewTemplate" class="my-1">
                <v-card-title>
                    <h2 class="headline">New template</h2>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="createNewTemplate = false"><v-icon>mdi-close</v-icon> </v-btn>
                </v-card-title>
                <v-card-text>
                    <property-checkin-instruction-template-form class="my-2" :property="property"  @created="templateCreated"  />
                </v-card-text>
            </v-card>
            <template v-if="templates.length">
                <property-checkin-instruction-template v-for="template in templates" :key="template.id" :property="property" :template="template"  class="my-1" />
            </template>
            <template v-else>
                <div class="py-5 text-center">
                    <p class="grey--text">No template yet</p>
                </div>
            </template>
        </data-container>
    </div>

</template>
<script>
import DataContainer from '../../../components/DataContainer.vue';
import PropertyCheckinInstructionTemplateForm from '../Components/PropertyCheckinInstructionTemplateForm';
import PropertyCheckinInstructionTemplate from '../Components/PropertyCheckinInstructionTemplate';

import GET_PROPERTY_CHECKIN_INSTRUCTION_TEMPLATES from '../Queries/getPropertyCheckinInstructionTemplates';

export default {
    name: "PropertyCheckinInstructionTemplates",
    components: {
        DataContainer,
        PropertyCheckinInstructionTemplate,
        PropertyCheckinInstructionTemplateForm,
    },

    props: {
        property: Object
    },

    data(){
        return {
            loading: false,
            createSecurityDeposit: false,
            createNewTemplate: false,
            templates: [],
        }
    },  

    methods: {
        getTemplates(){
            this.loading = true;
           
             this.$store.dispatch('query', {
                query: GET_PROPERTY_CHECKIN_INSTRUCTION_TEMPLATES,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.templates = response.data.getPropertyCheckinInstructionTemplates
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.getTemplates();
                        })
                    },
                    message: 'Could not get property templates ',
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },

        templateCreated(template){
            this.templates.unshift(template);
            this.createNewTemplate = false;
        }
    },

    watch: {
        property: {
            immediate: true,
            handler(property){
                if(property) this.getTemplates()
                else this.loading = true;
            }
        }
    }
}
</script>