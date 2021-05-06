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
                <v-btn color="primary" :loading="saving" @click="updateQuestions">Save</v-btn>
                <v-btn color="primary"  icon title="New question" @click="addNewQuestion"><v-icon dark> mdi-plus</v-icon> </v-btn>
            </div>

            <div  v-if="questions.length">
                <v-card v-for="(question, i) in questions" :key="i" class="my-1"> 
                    <v-card-text>
                        <div class="d-flex justify-space-between">
                            <div class="flex-grow-1">
                                <v-text-field
                                    outlined
                                    label="Question"
                                    :rules="[rules.required]"
                                    type="text"
                                    v-model="questions[i].question"
                                ></v-text-field>
                                <v-switch v-model="questions[i].required" label="Make compulsory" color="primary"></v-switch>
                                
                                <a v-if="questions[i].question != null && questions[i].question != '' && questions[i].options == null" href="#" @click.prevent="questions[i].options = ''">Add options</a>  
                                <div v-else-if="questions[i].options != null">
                                    <v-text-field
                                        :label="`Options to ${questions[i].question}`"
                                        type="url"
                                        :rules="[rules.required]"
                                        v-model="questions[i].options"
                                        placeholder="option 1, option 2, option 3"
                                        clearable
                                        hint="Separate options by , e.g. Yes, No, Maybe"
                                    >
                                    </v-text-field>
                                    <a href="#" @click.prevent="questions[i].options = null">Remove options</a>  
                                </div>                          
                            </div>
                            <div>
                                <v-btn color="error" icon @click="questions.splice(i, 1)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
            <div  v-else class="py-5 text-center">
                <p class="grey--text">No question yet</p>
            </div>
        </data-container>
    </div>

</template>
<script>
import DataContainer from '../../../components/DataContainer.vue';

import GET_PROPERTY_CHECKIN_QUESTIONS from '../Queries/getPropertyCheckinQuestions';
import UPDATE_PROPERTY_CHECKIN_QUESTIONS from '../Mutations/updatePropertyCheckinQuestions';
import formValidation from '@/helper/formValidation';

export default {
    name: "PropertyCheckinQuestions",
    components: {
        DataContainer,
    },

    props: {
        property: Object
    },

    data(){
        return {
            loading: false,
            saving: false,
            rules: formValidation.rules,
            questions: [],
        }
    },  

    methods: {
        getQuestions(){
            this.loading = true;
             this.$store.dispatch('query', {
                query: GET_PROPERTY_CHECKIN_QUESTIONS,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.questions  = response.data.getPropertyCheckinQuestions;
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => this.getQuestions(),
                    message: 'Could not get property checkin questions ',
                    exception: e
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },

        updateQuestions(){
            this.saving = true;
           
             this.$store.dispatch('mutate', {
                mutation: UPDATE_PROPERTY_CHECKIN_QUESTIONS,
                variables: {
                    property_id: this.property.id,
                    questions: this.questions
                }
            })
            .then(response => {
                this.questions  = response.data.updatePropertyCheckinQuestions;
                this.$store.commit("SNACKBAR", {
                    status: true,
                    text: "Checkin questions updated",
                    color: "success"
                })
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    retry: () => this.updateQuestions(),
                    message: 'Could not update property checkin questions ',
                    exception: e
                })
            })
            .finally(() => {
                this.saving = false;
            })
        },

        addNewQuestion(){
            this.questions.unshift({
                question: null,
                options: null,
                required: false,
            });
        }

    },

    watch: {
        property: {
            immediate: true,
            handler(property){
                if(property) this.getQuestions()
                else this.loading = true;
            }
        }
    }
}
</script>