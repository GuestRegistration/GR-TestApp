<template>
    <v-form v-bind="$attrs" ref="form" @submit.prevent="submit">
        <v-card flat>
            <v-card-text>
                <v-form ref="form">
                    <v-text-field
                        outlined
                        label="Title"
                        :rules="[rules.required]"
                        type="text"
                        v-model="form.title"
                    ></v-text-field>
                    
                    <v-textarea
                    outlined
                    label="Body"
                    :rules="[rules.required]"
                    v-model="form.body"
                    ></v-textarea>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary" :loading="loading">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>

</template>
<script>
import CREATE_PROPERTY_CHECKIN_INSTRUCTION_TEMPLATE from '../Mutations/createPropertyCheckinInstructionTemplate';
import UPDATE_PROPERTY_CHECKIN_INSTRUCTION_TEMPLATE from '../Mutations/updatePropertyCheckinInstructionTemplate';
import formValidation from '@/helper/formValidation';

export default {
    name: "PropertyCheckinInstructionTemplateForm",
    props: {
        property: Object,
        template: Object,
    },
    data(){
        return {
            loading: false,
            rules: formValidation.rules,
            form: {
                title: null,
                body: null,
            },
        }
    },
    methods: {
        submit(){
            if(this.template) this.updateInstructionTemplate();
            else this.createInstructionTemplate();
        },

        createInstructionTemplate(){
            this.loading = true;
            this.$store.dispatch('mutate', {
                mutation: CREATE_PROPERTY_CHECKIN_INSTRUCTION_TEMPLATE,
                variables: {
                    property_id: this.property.id,
                    ...this.form
                }
            }).then(response => {
                const template = response.data.createPropertyCheckinInstructionTemplate;
                this.$emit('created', template);
                this.$refs.form.reset();
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: `${template.title} instruction created`,
                    color: 'success'
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },

        updateInstructionTemplate(){
            this.loading = true;
            this.$store.dispatch('mutate', {
                mutation: UPDATE_PROPERTY_CHECKIN_INSTRUCTION_TEMPLATE,
                variables: {
                    property_id: this.property.id,
                    template_id: this.template.id,
                    ...this.form
                }
            }).then(response => {
                const template = response.data.updatePropertyCheckinInstructionTemplate
                this.$emit('updated',  template)
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: `${template.title} instruction updated`,
                    color: 'success'
                })
            })
            .finally(() => {
                this.loading = false;
            })

        }
    },
    watch: {
        template: {
            immediate: true,
            handler(template){
                if(template){
                    this.form = {
                        title: template.title,
                        body: template.body
                    }
                }
                
            }
        },
    }
}
</script>