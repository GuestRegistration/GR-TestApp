<template>
    <v-select 
        dense
        :loading="loading"
        :items="items"
        item-text="question"
        item-value="question"
        v-on="$listeners"
        v-bind="$attrs"
        :no-data-text="`${loading ? 'Please wait...': `No question created for ${property.name} yet. Create some under property settings first`}`"
    >
    </v-select>
</template>

<script>

import GET_PROPERTY_CHECKIN_QUESTIONS from '../Queries/getPropertyCheckinQuestions';

export default {
    name: "PropertyCheckinQuestionSelect",

    props: {
        property: Object,
        questions: Array,
    },

    data(){
        return {
            loading: false,
            items: [],
        }
    },

    methods: {
        getPropertyQuestions(){
            if(this.questions){
                this.items = this.questions;
                return;
            }
            this.loading = true;
            this.$store.dispatch('query', {
                query: GET_PROPERTY_CHECKIN_QUESTIONS,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.items = response.data.getPropertyCheckinQuestions ? response.data.getPropertyCheckinQuestions  : []
            })
            .finally(() => {
                this.loading = false;
            })
        }
    },

    watch: {        
        property: {
            immediate: true,
            handler(property){
                if(property) this.getPropertyQuestions();
            }
        }
    }

}
</script>