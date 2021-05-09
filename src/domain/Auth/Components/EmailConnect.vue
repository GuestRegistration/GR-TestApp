<template>
    <div>
        <template v-if="googleProvider">
           <span class="mr-3"> {{ googleProvider.email }}</span>
            <v-btn icon @click="editConnectedGoogleEmail = !editConnectedGoogleEmail"> 
                <v-icon color="primary">mdi-pen</v-icon>
            </v-btn>
            <template v-if="editConnectedGoogleEmail">
                <v-alert text color="warning">
                    <h3 class="headline">Connected Account</h3>
                    Your account is connected to a Google account. Changing the email address here will disconnect your account from the Google account
                </v-alert>
                <v-form ref="emailConnect" >
                    <v-text-field outlined dense type="email" v-model="email" label="Email" :rules="[rules.required, rules.email]" hide-details="auto"  ></v-text-field>
                    <v-btn small color="primary" class="my-3" @click="updateAuthEmail" :loading="loading">Verify</v-btn>
                </v-form>
            </template>
        </template>

        <template v-else>
            <div v-if="emailProvider">
                <span class="mr-3">{{ emailProvider.email }}</span> 
                <v-btn icon title="Edit email" @click="connectEmail = !connectEmail"> 
                    <v-icon color="primary">mdi-pen</v-icon>
                </v-btn> 
                <!-- <v-btn icon title="Remove email" v-if="current_user.auth.providerData.length > 1" @click="disconnect" :loading="loading"> 
                    <v-icon color="error">mdi-delete</v-icon>
                </v-btn>  -->
            </div>

            <div v-show="connectEmail" class="mt-2">
                <v-alert text color="warning">
                    <h3 class="headline">Email</h3>
                    Ensure you have access to the email address. You will need to verify it.
                </v-alert>
                <v-form ref="emailConnect" >
                    <v-text-field outlined dense type="email" v-model="email" label="Email" :rules="[rules.required, rules.email]" hide-details="auto"  ></v-text-field>
                    <v-btn small color="primary" class="my-3" @click="updateAuthEmail" :loading="loading">Verify</v-btn>
                </v-form>
            </div>
            
        </template>

    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import firebase from '@/firebase';
import validation from '@/helper/formValidation';

export default {
    name: "EmailConnect",
    props: {
    },
    data(){
        return {
           email: '',
           rules: validation.rules,
           loading: false,
           connectEmail: false,
           canDisconnect: false,
           editConnectedGoogleEmail: false
        }
    },

    computed:{
        ...mapGetters([
            'current_user',
        ]),

        googleProvider(){
            if(!this.current_user.auth.providerData) return null;
            return this.current_user.auth.providerData.find(provider => provider.providerId == 'google.com');
        },

        emailProvider(){
            if(!this.current_user.auth.providerData) return null;
            return this.current_user.auth.providerData.find(provider => provider.providerId == 'password');
        },

        verificationRoute(){
            return this.url(this.$router.resolve({ name: 'email.verification'}).route.fullPath)
        }
    },
    
    methods: {
        async updateAuthEmail(){
            if(!this.$refs.emailConnect.validate()){
                this.$emit('report', {
                    message: 'Invalid email',
                    type: 'error'
                })
                return;
            }

            if(this.googleProvider && this.googleProvider.email == this.email) {
                this.$emit('report', {
                    message: `Email not updated. Same with your Google email`,
                    type: 'info'
                })
                return;
            }

            // First disconnect the current email before linking the new one
            if(this.emailProvider){
                if(this.emailProvider.email == this.email){
                    this.$emit('report', {
                        message: `Email not updated.`,
                        type: 'info'
                    })
                    return;
                }

                await firebase.auth.currentUser.unlink(this.emailProvider.providerId);

            }

            let actionCodeSettings = {
                url: this.verificationRoute,
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
                this.$emit('update')
            });
        },

        // disconnect(){
        //     this.loading = true;
        //     firebase.auth.currentUser.unlink(this.emailProvider.providerId)
        //     .then(() => {
        //         this.$emit('report', {
        //             message: `Email successfully removed. You will no longer be able to sign in with the email`,
        //             type: 'success'
        //         });
        //         this.$emit('auth-updated', {
        //             email: null,
        //         })
        //     })
        //     .catch(e => {
        //         this.$emit('report', {
        //             message: `Could not remove email. ${e.message}`,
        //             type: 'error'
        //         })
        //     })
        //     .finally(() => {
        //         this.loading = false;
        //         this.$emit('update');
        //     })
        // }
    },

    watch: {
        emailProvider: {
            immediate: true,
            handler(provider){
                this.connectEmail = provider == null ? true : false
            }
        },
    }
}
</script>