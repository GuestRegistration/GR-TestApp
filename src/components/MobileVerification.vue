<template>
    <div>
         <div class="my-5">
            <h2 class="text-center">Let's Get Started</h2>
        </div>
        <v-card 
        :loading="sending_verification"
        >
            <v-card-text>
                <div class="text-center">
                    <p>Give us your mobile number so we can identify you </p>
                </div>
                <div class="my-5">
                    <v-form ref="mobile_verification" >
                        <v-text-field v-model="mobile_number" label="Mobile Number" :rules="[rules.required]" hide-details="auto"></v-text-field>
                    </v-form>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    text
                    dark color="accent-4"
                    class="primary"
                    block
                    @click="sendPhoneVerification"
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
    import firebase from './../firebase'
    export default {
        
        data(){
            return {
                sending_verification: false,
                mobile_number: '',
                rules: {
                    required: value => !!value || 'Required.'
                }
            }
        },
        props: [],
        methods: {
            sendPhoneVerification(){
                if(this.$refs.mobile_verification.validate()){
                        this.sending_verification = true
                        window.recaptchaVerifier = new firebase.firebase.auth.RecaptchaVerifier('sign-in-button', {
                        'size': 'invisible',
                        'callback': function(response) {
                            console.log(response)
                            console.log('Recapcha solved')
                        }
                        });
                        const appVerifier = window.recaptchaVerifier
                        firebase.auth.signInWithPhoneNumber(this.mobile_number, appVerifier)
                        .then( (confirmationResult) => {
                            this.sending_verification = false
                            // SMS sent. Prompt user to type the code from the message, then sign the
                            // user in with confirmationResult.confirm(code).
                            window.confirmationResult = confirmationResult;
                            alert(`A verification code has been sent to ${this.mobile_number}`)
                            this.$emit('done', this.mobile_number)
                        }).catch( (error) => {
                            this.sending_verification = false
                            alert("Could not send SMS "+error.message)
                        })
                }
            },
        }
    }
</script>

<style scoped>

</style>

