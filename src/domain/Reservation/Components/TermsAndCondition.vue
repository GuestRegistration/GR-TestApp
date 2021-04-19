<template>
    <div>
        <div class="my-5">
            <h2 class="text-center">Terms and Condition</h2>
        </div>
        <div class="my-5 text-center">
            <div v-if="property.terms">
                <p>Please read carefully the terms and condition for {{ property.name }} <a :href="property.terms" target="_blank">here</a></p>
                <div class="my-5">
                    <v-checkbox v-model="accepted" label="I have read and accepted the terms and condition`"></v-checkbox>
                </div>
                <div class="my-5">
                    <v-btn
                        text
                        dark color="accent-4"
                        class="primary"
                        block
                        @click="AcceptTnC"
                        id="sign-in-button"
                    >
                        Continue
                    </v-btn>
                </div>
            </div>

            <div v-else>
                <p>There are no terms and conditions for {{ property.name }} yet</p>
                <div class="my-5">
                    <v-btn
                        text
                        dark color="accent-4"
                        class="primary"
                        block
                        @click="$emit('done', true)"
                        id="sign-in-button"
                    >
                        Continue
                    </v-btn>
                </div>
            </div>        
        </div>

    </div>
</template>

<script>
    export default {
        data(){
            return {
                accepted: false
            }
        },
        props: {
            property: Object
        },
        methods:{
            AcceptTnC(){
                this.$emit('done', this.accepted)
            }
        }

    }
</script>

<style scoped>

</style>

