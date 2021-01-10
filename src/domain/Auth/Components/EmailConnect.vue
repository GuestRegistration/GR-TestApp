<template>
    <div>
        <div v-if="!connected">
            <v-btn small color="primary" @click="connectEmail = !connectEmail">Add Email</v-btn>
            <div v-show="connectEmail" class="mt-2">
                <v-form ref="emailConnect" >
                    <v-text-field outlined type="email" v-model="email" label="Email" :rules="[rules.required, rules.email]" hide-details="auto"  ></v-text-field>
                    <v-btn small color="primary" class="my-3" @click="sendMagicLink" :loading="loading">Verify</v-btn>
                </v-form>
            </div>
        </div>
        <div v-else>
            <p>Connected as {{ connected.email }}</p>
            <v-btn v-if="current_user.auth.providerData.length > 1" small class="red accent--4" dark @click="disconnect" :loading="loading">Remove</v-btn>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '@/firebase';
import validation from '@/helper/formValidation';

export default {
    name: "EmailConnect",

    props: {
        provider: Object,
    },
    data(){
        return {
           connected: null,
           email: '',
           rules: validation.rules,
           loading: false,
           connectEmail: false,
           canDisconnect: false,
        }
    },

    computed:{
        ...mapGetters([
            'current_user',
        ]),
    },
    
    methods: {
        sendMagicLink(){
            if(this.$refs.emailConnect.validate()){
                const verificationRoute = this.$router.resolve({ name: 'email.verification'});
                let actionCodeSettings = {
                    url: `${window.location.origin}${verificationRoute.href}`,
                    // This must be true.
                    handleCodeInApp: true,
                    
                };
                this.loading = true;
                firebase.auth.sendSignInLinkToEmail(this.email, actionCodeSettings)
                .then(() => {
                    this.$emit('report', {
                        message: `A link has been sent to ${this.email}. Follow the link in the mail for verification`,
                        type: 'success'
                    })
                    window.localStorage.setItem('emailForConnect', this.email);
                })
                .catch(e => {
                    this.$emit('report', {
                        message: `Failed: ${e.message}`,
                        type: 'error'
                    })
                })
                .finally(() => {
                    this.loading = false;
                });
            }else{
                this.$emit('report', {
                    message: 'Invalid email',
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
                    message: `Email successfully removed. You will no longer be able to sign in with the email`,
                    type: 'success'
                });
                this.$emit('auth-updated', {
                    email: null,
                })
            })
            .catch(e => {
                this.$emit('report', {
                    message: `Could not remove email. ${e.message}`,
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