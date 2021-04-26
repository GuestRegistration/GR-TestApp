<template>
    <div>
        <slot name="heading" />
        <v-form ref="form" @submit.prevent>
            <v-card flat>
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
                        <v-col cols="12">
                            <p v-if="mode == 'edit'" class="text--gray mt-2">{{ form.full_address }}</p>
                            <component 
                                :is="`${useGoogleLocation ? 'location' : 'v-text-field'}`"
                                flat
                                hide-no-data
                                hide-details
                                :label="`${mode == 'edit' ? 'Update location' : 'Location'}`"
                                outlined
                                clearable
                                cache-items
                                class="mb-5"
                                v-model="form.full_address"
                                ></component>
                        
                            
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
                        :rules="[rules.required, rules.url]"
                        type="text"
                        v-model="form.terms"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn type="button" @click.prevent="submit" color="primary" :loading="loading">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import formValidation from '@/helper/formValidation';
import PhoneNumber from '@/components/Utilities/PhoneNumber.vue';
import Location from '@/components/Utilities/GooglePlaces.vue';

import CREATE_PROPERTY from '../Mutations/createProperty';
import UPDATE_PROPERTY from '../Mutations/updateProperty';

export default {
    name: "PropertyForm",
    components: {
        PhoneNumber, Location
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
            },
            useGoogleLocation: false,
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
            'TOAST_ERROR',
            'SET_ACTIVE_PROPERTY'
        ]),

        submit(){
            if(!this.phone.valid){
                this.TOAST_ERROR({
                    show: true,
                    message: 'Invalid phone number, check again',
                });
                return;
            }

            if(!this.form.full_address){
                this.TOAST_ERROR({
                    show: true,
                    message: 'Please enter the location',
                });
                return;
            }
            
            this.form.phone = this.phone.international,
            this.form.phone_country_code = this.phone.dialCode;
            this.form.phone_number = this.phone.significant;

            if(this.$refs.form.validate()){
                if(this.mode == 'edit') this.updateProperty();
                else this.createProperty();
            }else{
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: "Some fields are incorrectly filled",
                    color: "red"
                })
            }
        },

        createProperty(){
            this.loading = true;
            this.mutate({
                variables: this.form,
                mutation: CREATE_PROPERTY
            })
            .then(response => {
                const newProperty = response.data.createProperty;
                this.$emit('property-created', newProperty);
                this.SET_ACTIVE_PROPERTY({
                    id: newProperty.id,
                    name: newProperty.name,
                    image: newProperty.image,
                    address: newProperty.full_address
                })
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
                this.$emit('property-updated', response.data.updateProperty);
            })
            .catch(e => {
                this.$emit('error', e);
            })
            .finally(() => {
                this.loading = false;
            })
        }
    },

    mounted(){
       
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
                        phone: property.phone, 
                        phone_country_code: property.phone_meta ? property.phone_meta.country_code: null,
                        phone_number: property.phone_meta ? property.phone_meta.phone_number : null,
                        full_address: property.full_address,
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
                        valid: true,
                    }
                }else{
                    this.form = {
                        name: null, 
                        email: null, 
                        full_address: null,
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