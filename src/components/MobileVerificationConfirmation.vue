<template>
    <div>
        <v-card outlined
        :loading="confirming_verification_code"
        >
            <v-card-text>
                <div class="text-center">
                    <p>We sent a one time validation code to your phone number <strong>{{phone_number}}</strong>. Enter the 6 digit code below before it expires in 2 minutes</p>
                </div>
                <div class="my-5">
                    <v-form ref="confirm_verification" >
                        <v-text-field v-model="verification_code" label="Verification code" :rules="[rules.required]" hide-details="auto"></v-text-field>
                    </v-form>
                </div>
                <div class="my-3">
                    <a href="#" @click.prevent="$emit('resend')">Resend verification code</a>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn
                    text
                    dark color="accent-4"
                    class="primary"
                    block
                    @click="_confirmVerificationCode"
                    id="sign-in-button"
                    :loading="confirming_verification_code"
                >
                    Continue
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import {mapActions} from 'vuex'

    export default {
        data(){
            return {
                verification_code: '',
                confirming_verification_code: false,
                rules: {
                    required: value => !!value || 'Required.'
                }
            }
        },
        props: ['phone_number'],
        methods: {
            ...mapActions([
                'confirmVerificationCode'
            ]),
            _confirmVerificationCode(){
                if(this.$refs.confirm_verification.validate()){
                    this.confirming_verification_code = true
                    this.confirmVerificationCode(this.verification_code)
                    .then( (result) => {
                            // User signed in successfully.
                            this.confirming_verification_code = false
                            this.$emit('verified', result.user)
                        }).catch( (error) => {
                            // User couldn't sign in (bad verification code?)
                            this.confirming_verification_code = false
                            this.$emit("error", "Could not sign in with the verification code "+ error.message)
                        })
                }
            },
        }
    }
</script>

<style scoped>

</style>

