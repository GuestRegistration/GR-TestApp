<template>
    <v-form v-bind="$attrs" ref="form" @submit.prevent="submit">
        <div class="d-flex justify-space-between align-center">
        </div>
        <v-card flat>
            <v-card-text>
                <v-switch v-model="form.enable" label="Enable" color="primary"></v-switch>
                <v-radio-group v-model="form.type" label="Charge Type" :readonly="readOnly.includes('type')">
                    <v-radio
                        v-for="type in chargeTypes"
                        :key="type"
                        :label="type"
                        :value="type"
                    ></v-radio>
                </v-radio-group>
                <v-text-field
                    outlined
                    label="Title"
                    :rules="[rules.required]"
                    type="text"
                    v-model="form.title"
                    :readonly="readOnly.includes('title')"
                ></v-text-field>
                <v-text-field
                    outlined
                    label="Amount"
                    prefix="$"
                    type="number"
                    :rules="[rules.required]"
                    v-model="form.amount"
                    :readonly="readOnly.includes('amount')"
                ></v-text-field>
                <v-textarea
                outlined
                label="Description"
                :rules="[rules.required]"
                v-model="form.description"
                :readonly="readOnly.includes('description')"
                ></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary" :loading="loading">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>

</template>
<script>
import CREATE_PROPERTY_CHARGE from '../Mutations/createPropertyCharge';
import UPDATE_PROPERTY_CHARGE from '../Mutations/updatePropertyCharge';
import formValidation from '@/helper/formValidation';
import PropertyCharge from '../Models/Charge';

export default {
    name: "PropertyChargeForm",
    props: {
        property: Object,
        charge: Object,
        prefill: Object,
        readOnly: {
            type: Array,
            default: () => []
        },
        title: String,
    },
    data(){
        return {
            loading: false,
            rules: formValidation.rules,
            form: {
                title: null,
                description: null,
                enable: false,
                amount: null,
                type: 'Instant',
            },
            chargeTypes: [
                'Instant',
                'Pre-authorize'
            ],
        }
    },
    methods: {
        submit(){
            this.form.amount = parseInt(this.form.amount, 10);
            if(this.charge) this.updatePropertyCharge();
            else this.createPropertyCharge();
        },

        createPropertyCharge(){
            this.loading = true;
            this.$store.dispatch('mutate', {
                mutation: CREATE_PROPERTY_CHARGE,
                variables: {
                    property_id: this.property.id,
                    data: this.form
                }
            }).then(response => {
                console.log(response);
                this.$emit('created',  response.data.createPropertyCharge)
            })
            .finally(() => {
                this.loading = false;
            })
        },

        updatePropertyCharge(){
            this.loading = true;
            this.$store.dispatch('mutate', {
                mutation: UPDATE_PROPERTY_CHARGE,
                variables: {
                    property_id: this.property.id,
                    charge_id: this.charge.id,
                    data: this.form
                }
            }).then(response => {
                console.log(response);
                this.$emit('updated',  response.data.updatePropertyCharge)
            })
            .finally(() => {
                this.loading = false;
            })

        }
    },
    watch: {
        charge: {
            immediate: true,
            handler(charge){
                this.form = new PropertyCharge(charge)
            }
        },
        
        prefill: {
            immediate: true,
            handler(prefill){
                if(prefill){
                    this.form = {...prefill}
                }
            }
        }
    }
}
</script>