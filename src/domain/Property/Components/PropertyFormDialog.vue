<template>
    <v-dialog 
    v-model="dialog"
    scrollable  
    max-width="600px"
    >
        <v-form ref="form" @submit.prevent>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ mode == 'edit' ? 'Update Property' : 'Create property' }}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-text-field
                        outlined
                        label="Name"
                        :rules="[rules.required]"
                        type="text"
                        name="name"
                        v-model="form.name"
                    ></v-text-field>

                    <v-text-field
                        outlined
                        label="Email"
                        :rules="[rules.required, rules.email]"
                        type="email"
                        name="email"
                        v-model="form.email"
                    ></v-text-field>

                    <phone-number v-model="phone" />

                    <v-row>
                        <v-col cols="12" sm="8">
                            <v-text-field
                                outlined
                                label="Street"
                                :rules="[rules.required]"
                                type="text"
                                name="street"
                                v-model="form.street"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field
                                outlined
                                label="Postal code"
                                :rules="[rules.required, rules.numeric]"
                                type="number"
                                name="postal_code"
                                v-model="form.postal_code"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field
                                outlined
                                label="City"
                                :rules="[rules.required]"
                                type="text"
                                name="city"
                                v-model="form.city"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-text-field
                                outlined
                                label="State"
                                :rules="[rules.required]"
                                type="text"
                                name="state"
                                v-model="form.state"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4"> 
                            <v-text-field
                                outlined
                                label="Country"
                                :rules="[rules.required]"
                                type="text"
                                name="country"
                                v-model="form.country"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-textarea
                    outlined
                    label="Property rules"
                    :rules="[rules.required]"
                    v-model="form.rules"
                    ></v-textarea>

                    <v-text-field
                        outlined
                        label="Terms"
                        :rules="[rules.required]"
                        type="text"
                        v-model="form.terms"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click.prevent="close" color="red">Cancel</v-btn>
                    <v-btn type="button" @click.prevent="submit" color="primary" :loading="loading">Submit</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import formValidation from '@/helper/formValidation';
import PhoneNumber from '@/components/Utilities/PhoneNumber.vue';
import CREATE_PROPERTY from '../Mutations/createProperty';
import UPDATE_PROPERTY from '../Mutations/updateProperty';

export default {
    name: "PropertyFormDialog",
    components: {
        PhoneNumber,
    },
    data(){
        return {
            dialog: false,
            mode: 'create',
            loading: false,
            rules: formValidation.rules,
            form: {},
            phone: {
                country_code: '',
                international: '',
                significant: '',
            }
        }
    },
    props: {
        property: Object
    },

    methods: {

        ...mapActions([
            'query',
            'mutate'
        ]),
        ...mapMutations([
            'TOAST_ERROR'
        ]),

        open(){
            this.dialog = true;
        },
        close(){
            this.dialog = false;
        },

        submit(){
            if(!this.phone.valid){
                this.TOAST_ERROR({
                    show: true,
                    message: 'Invalid phone number, check again',
                });
                return;
            }
            
            this.form.phone = this.phone.international,
            this.form.phone_country_code = this.phone.dialCode;
            this.form.phone_number = this.phone.significant;

            if(this.$refs.form.validate()){
                if(this.mode == 'edit') this.updateProperty();
                else this.createProperty();
            }
        },

        createProperty(){
            this.loading = true;
            this.mutate({
                variables: this.form,
                mutation: CREATE_PROPERTY
            })
            .then(response => {
                this.$emit('success', response.data.createProperty);
                this.$refs.form.reset();
            })
            .catch(e => {
                this.TOAST_ERROR({
                    show: true,
                    retry: () => {
                        return new Promise((resolve, reject) => {
                            this.createProperty();
                        })
                    },
                    message: 'Could not create property. ',
                    exception: e
                });
                this.$emit('error', e);
            })
            .finally(() => {
                this.loading = false;
            })
        },

        updateProperty(){
            this.loading = true;
            this.mutate({
                variables: this.form,
                mutation: UPDATE_PROPERTY
            })
            .then(response => {
                console.log(response);
                this.$emit('success', response.data.createProperty);
            })
            .catch(e => {
                
                this.$emit('error', e);
            })
            .finally(() => {
                this.loading = true;
            })
        }
    },

    watch: {
        property: {
            immediate: true,
            handler(property){
                if(property){
                    this.mode = 'edit';
                    this.form = {
                        id: property.id,
                        name: property.name, 
                        email: property.email, 
                        street: property.address.street, 
                        city: property.address.city, 
                        state: property.address.state, 
                        country: property.address.country, 
                        postal_code: property.address.postal_code,
                        rules: property.rules,
                        terms: property.terms,
                    }
                    this.phone = {
                        country_code: property.phone_meta.country_code,
                        international: property.phone,
                        significant: property.phone_meta.phone_number,
                    }
                }else{
                    this.form = {
                        name: null, 
                        email: null, 
                        street: null, 
                        city: null, 
                        state: null, 
                        country: null, 
                        postal_code: null,
                        rules: null,
                        terms: null
                    }

                }
            }
        }
    }
}
</script>