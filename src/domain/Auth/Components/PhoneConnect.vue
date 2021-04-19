<template>
    <div>
        <div v-if="!connected">
            <v-btn small color="primary" @click="connectPhone = !connectPhone">Add Phone</v-btn>
            <div v-show="connectPhone">
                <template v-if="!verificationSent">
                    <div class="my-2">
                        <phone-number v-model="phone" />
                        <div id="recaptcha-container" class="mt-2"></div>
                    </div>
                    <v-btn small color="primary" class="my-3" @click="sendVerificationCode" :loading="loading" >Link</v-btn>
                </template>
                <template v-else>
                    <div>
                        <p>We sent a one time validation code to {{ phone.international }}. Enter the 6 digit code below before it expires</p>
                        <a href="#" @click.prevent="verificationSent = false">Use another phone number</a>
                    </div>
                    <div class="my-5">
                        <v-form ref="confirmVerification" >
                            <v-text-field outlined v-model="verificationCode" label="Verification code" :rules="[rules.required]" hide-details="auto" ></v-text-field>
                            <v-btn small color="primary" class="my-3" @click="confirmVerificationCode" :loading="loading">Verify</v-btn>
                        </v-form>
                    </div>
                    <div class="my-3">
                        <a href="#" @click.prevent="resendVerificationCode">Resend verification code</a>
                    </div>
                </template>
            </div>
        </div>
        <div v-else>
            <div> Connected as {{ connected.phoneNumber }}</div>
            <v-btn v-if="current_user.auth.providerData.length > 1" small class="red accent--4" dark @click="disconnect" :loading="loading">Remove</v-btn>
        </div>

    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '@/firebase';
import validation from '@/helper/formValidation';
import PhoneNumber from '@/components/Utilities/PhoneNumber';

export default {
    name: "PhoneConnect",
    components: {
        PhoneNumber
    },
    props: {
        provider: Object,
    },
    data(){
        return {
            connected: null,
            loading: false,
            rules: validation.rules,
            connectPhone: false,
            phone: {},
            verificationSent: false,
            verificationCode: '',
            canDisconnect: false,
        }
    },

    computed:{
        ...mapGetters([
            'current_user',
        ]),
    },
    methods: {
        sendVerificationCode(){

            if(!this.phone.valid){
                this.$emit('report', {
                    message: 'Invalid phone',
                    type: 'error'
                })
                return;
            }
            this.loading = true;
            window.recaptchaVerifier = new firebase.firebase.auth.RecaptchaVerifier('recaptcha-container');
            let appVerifier = window.recaptchaVerifier;
            firebase.auth.currentUser.linkWithPhoneNumber(this.phone.international, appVerifier)
            .then(confirmationResult => {
                window.confirmationResult = confirmationResult;
                this.verificationSent = true;
                this.$emit('report', {
                    message: 'Verification code sent',
                    type: 'success'
                })
            })
            .catch(e => {
                this.$emit('report', {
                    message: `Could not sent verification code. ${e.message}`,
                    type: 'error'
                })
            })
            .finally(() => {
                this.loading = false;
            })
        },

        resendVerificationCode(){
            window.confirmationResult = null;
            this.verificationSent = false;
        },

        confirmVerificationCode(){
            if(this.$refs.confirmVerification.validate()){
                this.loading = true;
                window.confirmationResult.confirm(this.verificationCode)
                .then(result => {
                    this.$emit('report', {
                        message: 'Phone number linked successfully',
                        type: 'success'
                    })
                    this.$emit('auth-updated', {
                        phone: this.phone.international,
                        phone_country_code: this.phone.dialCode,
                        phone_number: this.phone.significant
                    })
                    this.$emit('notification', {title: "Account update", body: `${this.phone.international} has been added to your account. You can now sign in with it.`})
                }).catch( e => {
                    if(e.code == 'auth/credential-already-in-use'){
                        this.$emit('report', {
                            message: 'Phone number already in use by another user',
                            type: 'error'
                        })
                    }else{
                        this.$emit('report', {
                            message: e.message,
                            type: 'error'
                        })
                    }
                })
                .finally(() => {
                    this.loading = false;
                })

            }else{
                this.$emit('report', {
                    message: 'Invalid form',
                    type: 'error'
                })
            }
        },

        disconnect(){
            this.loading = true;
            firebase.auth.currentUser.unlink(this.connected.providerId)
            .then(() => {
                this.connected = null;
                this.$emit('report', {
                    message: `Phone successfully removed. You will no longer be able to sign in with it`,
                    type: 'success'
                });
                this.$emit('auth-updated', {
                    phone: null,
                    phone_country_code: null,
                    phone_number: null
                })
            })
            .catch(e => {
                this.$emit('report', {
                    message: `Could not remove phone. ${e.message}`,
                    type: 'error'
                })
            })
            .finally(() => {
                this.loading = false;
            })
        }
    },
    watch: {
        provider: {
            immediate: true,
            handler(provider){
                this.connected = provider;
            }
        },
       
    }
}
</script>