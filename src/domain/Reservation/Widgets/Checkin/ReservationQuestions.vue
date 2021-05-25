<template>
    <div>
        <div v-if="responses.length">
            <v-card v-for="(response, i) in responses" :key="i" class="my-1">
                <v-card-text>
                    <p>{{ response.question }} {{ !response.required ? '(optional)' : '' }}</p>
                    <template v-if="response.options && response.options.split(',').length">
                        <v-radio-group 
                        v-model="responses[i].response" 
                        :rules="[(value) => response.required && (value == '' || !value) ? 'Select one of the options' : true]"
                        >
                            <v-radio
                                v-for="(option, o) in response.options.split(',')" :key="o"
                                :label="option"
                                :value="option"
                            ></v-radio>
                        </v-radio-group>
                    </template>
                    <v-text-field 
                    v-else
                    :label="`${response.question} ${!response.required ? '(optional)' : ''}`"
                    :rules="[(value) => response.required && (value == '' || !value) ? 'This field is required' : true]"
                    v-model="responses[i].response"
                    >
                    </v-text-field>
                </v-card-text>
            </v-card>
        </div>
        <div v-else class="grey--text py-5 text-center">
            No question for the reservation
        </div>
    </div>
</template>

<script>
export default {
    name: "ReservationQuestions",
    data(){
        return {
            responses: [],
        }
    },

    props: {
       questions: Array
    },

    watch: {
        responses: {
            immediate: true,
            handler(responses){
                this.$emit('responses', responses)
            }
        },

        questions: {
            immediate: true,
            handler(questions){
                this.responses = questions ? questions.map(q => ({
                    ...q, 
                    response: null
                })) : []
            }
        }
    }
}
</script>