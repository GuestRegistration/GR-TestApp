<template>
    <div>
        <slot name="heading" />
        <property-subscription-alert  v-if="property" :property="property" >
            Activate subscription for {{ property.name }} to manage reservation checkin agreements
        </property-subscription-alert>

        <data-container v-if="property && property.active" :loading="loading">
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
                <v-btn color="primary" :loading="saving" @click="updateAgreements">Save</v-btn>
                <v-btn color="primary"  icon title="New agreement" @click="addNewAgreement"><v-icon dark> mdi-plus</v-icon> </v-btn>
            </div>

            <div  v-if="agreements.length">
                <v-card v-for="(agreement, i) in agreements" :key="i" class="my-1"> 
                    <v-card-text>
                        <div class="d-flex justify-space-between">
                            <div class="flex-grow-1">
                                <v-text-field
                                    outlined
                                    label="Agreement"
                                    :rules="[rules.required]"
                                    type="text"
                                    v-model="agreements[i].agreement"
                                ></v-text-field>
                                <a v-if="agreements[i].link == null" href="#" @click.prevent="agreements[i].link = ``">Add link</a>  
                                <div v-else>
                                    <v-text-field
                                        label="URL to agreement"
                                        type="url"
                                        :rules="[rules.required, rules.url]"
                                        v-model="agreements[i].link"
                                        placeholder="https://exmaple.com/agreements"
                                        clearable
                                    >
                                    </v-text-field>
                                    <a href="#" @click.prevent="agreements[i].link = null">Remove link</a>  
                                </div>                          
                            </div>
                            <div>
                                <v-btn color="error" icon @click="agreements.splice(i, 1)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
            <div  v-else class="py-5 text-center">
                <p class="grey--text">No agreement yet</p>
            </div>
        </data-container>
    </div>

</template>
<script>
import DataContainer from '../../../components/DataContainer.vue';
import PropertySubscriptionAlert from '../Components/PropertySubscriptionAlert'

import GET_PROPERTY_CHECKIN_AGREEMENTS from '../Queries/getPropertyCheckinAgreements';
import UPDATE_PROPERTY_CHECKIN_AGREEMENTS from '../Mutations/updatePropertyCheckinAgreements';
import formValidation from '@/helper/formValidation';

export default {
    name: "PropertyCheckinAgreements",
    components: {
        DataContainer, PropertySubscriptionAlert
    },

    props: {
        property: Object
    },

    data(){
        return {
            loading: false,
            saving: false,
            rules: formValidation.rules,
            agreements: [],
        }
    },  

    methods: {
        getAgreements(){
            this.loading = true;
             this.$store.dispatch('query', {
                query: GET_PROPERTY_CHECKIN_AGREEMENTS,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.agreements  = response.data.getPropertyCheckinAgreements;
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => this.getAgreements(),
                    message: 'Could not get property checkin agreements ',
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },

        updateAgreements(){
            this.saving = true;
           
             this.$store.dispatch('mutate', {
                mutation: UPDATE_PROPERTY_CHECKIN_AGREEMENTS,
                variables: {
                    property_id: this.property.id,
                    agreements: this.agreements
                }
            })
            .then(response => {
                this.agreements  = response.data.updatePropertyCheckinAgreements;
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "Checkin agreements updated",
                    color: "success"
                })
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => this.updateAgreements(),
                    message: 'Could not update property checkin agreements ',
                    exception: e
                })
            })
            .finally(() => {
                this.saving = false;
            })
        },

        addNewAgreement(){
            this.agreements.unshift({
                agreement: null,
                link: null,
            });
        }

    },

    watch: {
        property: {
            immediate: true,
            handler(property){
               if(property && property.active) this.getAgreements()
                else this.loading = false;
            }
        }
    }
}
</script>