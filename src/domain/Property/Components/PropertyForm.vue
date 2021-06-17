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

                    <phone-number class="mb-3" v-model="phone" />

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
                                :rules="[rules.required]"
                                hint="Property address"
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
                        hint="URL to property terms and condition"
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
        }
    },
    props: {
        property: Object
    },
    computed: {
        useGoogleLocation(){
            return process.env.VUE_APP_GOOGLE_API_KEY && process.env.VUE_APP_GOOGLE_API_KEY !== '' ? true : false;
        }
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
                variables: {
                    data: this.form
                },
                mutation: CREATE_PROPERTY
            })
            .then(response => {
                const newProperty = response.data.createProperty;
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: `${newProperty.name} created successfully`,
                    color: "success"
                })
                this.$store.commit('ADD_USER_PROPERTY', newProperty)
                this.SET_ACTIVE_PROPERTY({
                    id: newProperty.id,
                    name: newProperty.name,
                    image: newProperty.image,
                    address: newProperty.full_address,
                    active: newProperty.active
                })
                this.$emit('property-created', newProperty);
            })
            .catch(e => {
                this.TOAST_ERROR({
                    show: true,
                    retry: () => this.createProperty(),
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
                variables: {
                    id: this.property.id,
                    data: this.form
                },
                mutation: UPDATE_PROPERTY
            })
            .then(response => {
                const updatedProperty = response.data.updateProperty
                this.$store.commit('UPDATE_USER_PROPERTY', updatedProperty);
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: `${updatedProperty.name} updated successfully`,
                    color: "success"
                })

                this.$emit('property-updated', updatedProperty);
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