<template>
    <div>
        <v-card outlined
        :loading="sending_verification"
        >
            <v-card-text>
                <div class="text-center">
                    <p>Give us your phone number so we can identify you </p>
                </div>
                <div class="my-5">
                    <v-form ref="phone_verification" >
                        <vue-tel-input 
                            :valid-characters-only="true"
                            @input="onInput"
                        ></vue-tel-input>
                        <div class="mt-2 text-center">
                            <strong :class="`${phone.valid ? 'success--text' : 'red--text'}`">{{ phone.number }}</strong>
                        </div>
                        <!-- <v-text-field v-model="phone_number" label="Phone Number" :rules="[rules.required]" hide-details="auto"></v-text-field> -->
                    </v-form>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    text
                    dark color="accent-4"
                    class="primary"
                    block
                    @click="_sendPhoneVerification"
                    id="sign-in-button"
                    :loading="sending_verification"
                >
                    Continue
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import { VueTelInput } from 'vue-tel-input'
    import {mapActions, mapMutations} from 'vuex'

    export default {
        components:{
            VueTelInput
        },
        data(){
            return {
                phone: {
                    number: '',
                    valid: false,
                    country: undefined,
                },
                sending_verification: false,
                phone_number: '',
                rules: {
                    required: value => !!value || 'Required.'
                }
            }
        },
        computed:{

        },
        props: [],
        methods: {
            ...mapActions([
                'sendPhoneVerification'
            ]),
            ...mapMutations([
                
            ]),
            onInput(formattedNumber, { number, valid, country }) {
                this.phone.number = number.international;
                this.phone.valid = valid;
                this.phone.country = country && country.name;
            },
            _sendPhoneVerification(){
                if(this.phone.valid){
                        this.sending_verification = true
                        this.sendPhoneVerification(this.phone.number)
                        .then(() => {
                            this.sending_verification = false
                            // SMS sent. Prompt user to type the code from the message, then sign the
                            // user in with confirmationResult.confirm(code).
                            this.$emit('sent', this.phone.number)

                        }).catch( (error) => {
                            this.sending_verification = false
                            this.$emit('error',  `Could not send SMS ${error.message}`)
                        })
                }
            },
        }
    }
</script>

<style scoped>

</style>

