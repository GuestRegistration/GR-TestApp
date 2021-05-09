<template>
    <div>
        <div v-if="phoneProvider">
            <span>{{ phoneProvider.phoneNumber }}</span> 
            <v-btn icon title="Edit phone" @click="connectPhone = !connectPhone"> 
                <v-icon color="primary">mdi-pen</v-icon>
            </v-btn>
            <!-- <v-btn v-if="current_user.auth.providerData.length > 1" icon title="Remove phone" @click="disconnect" :loading="loading"> 
                <v-icon color="error">mdi-close-circle</v-icon>
            </v-btn>   -->
        </div>

         <div v-show="connectPhone">
            <template v-if="!verificationSent">
                <div class="my-2">
                    <v-alert v-if="phoneProvider" text color="warning">
                        <h3 class="headline">Connected Phone number</h3>
                        Your current phone number <strong>{{ phoneProvider.phoneNumber }}</strong> will be unlinked immediately
                    </v-alert>
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
                        <v-text-field outlined dense v-model="verificationCode" label="Verification code" :rules="[rules.required]" hide-details="auto" ></v-text-field>
                        <v-btn small color="primary" class="my-3" @click="confirmVerificationCode" :loading="loading">Verify</v-btn>
                    </v-form>
                </div>
                <div class="my-3">
                    <a href="#" @click.prevent="resendVerificationCode">Resend verification code</a>
                </div>
            </template>
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

    },
    data(){
        return {
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

        phoneProvider(){
            if(!this.current_user.auth.providerData) return null;
            return this.current_user.auth.providerData.find(provider => provider.providerId == 'phone');
        },

    },
    methods: {
        async sendVerificationCode(){

            if(!this.phone.valid){
                this.$emit('report', {
                    message: 'Invalid phone',
                    type: 'error'
                })
                return;
            }
            this.loading = true;

            if(this.phoneProvider){
                if(this.phoneProvider.phoneNumber == this.phone.international.replace(' ', '')){
                    this.$emit('report', {
                        message: `Phone not updated.`,
                        type: 'info'
                    })
                    return;
                }

                await firebase.auth.currentUser.unlink(this.phoneProvider.providerId);
            }
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
                    this.$emit('notification', {title: "Account update", body: `${this.phone.international} has been linked to your account. You can now sign in with it.`})
                    return Promise.resolve()
                })
                .then(() => firebase.auth.currentUser.reload() )
                .catch( e => {
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
                    this.$emit('update')
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
            firebase.auth.currentUser.unlink(this.phoneProvider.providerId)
            .then(() => firebase.auth.currentUser.reload() )
            .then(() => {

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
                this.$emit('update')
            })
        }
    },

    watch: {
        phoneProvider: {
            immediate: true,
            handler(provider){
                this.connectPhone = provider == null ? true : false
            }
        },
    }
    
}
</script>