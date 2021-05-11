<template>
    <app-layer ref="app">
        <v-row justify="center mt-5">
            <v-col cols="12" md="4">
                <v-card outlined
                :loading="loading"
                v-if="requestEmail"
                >
                    <v-card-title>
                        <h1 class="headline">Confirm your new email</h1>
                    </v-card-title>
                    <v-card-text>
                        <div class="my-5">
                            <v-form ref="emailVerification" >
                                <v-text-field outlined v-model="email" label="Email" :rules="[rules.required, rules.email]" hide-details="auto"></v-text-field>
                            </v-form>
                        </div>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn
                            text
                            dark color="accent-4"
                            class="primary"
                            block
                            @click="verify"
                            :loading="loading"
                        >
                            Verify
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </app-layer>
</template>

<script>
    import validation from '@/helper/formValidation';
    import firebase from '@/firebase';
    import AppLayer from '@/AppLayer';

    import profile from '../../User/Mixins/profile';
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: "EmailVerification",
        mixins: [profile],

        data(){
            return {
                rules: validation.rules,
                email: '',
                loading: false,
                requestEmail: false,
            }
        },
        components: {
            AppLayer
        },
        computed:{

            ...mapGetters([
                'current_user'
            ]),

            googleProvider(){
                if(!this.current_user.auth.providerData) return null;
                return this.current_user.auth.providerData.find(provider => provider.providerId == 'google.com');
            },

            emailProvider(){
                if(!this.current_user.auth.providerData) return null;
                return this.current_user.auth.providerData.find(provider => provider.providerId == 'password');
            },

            returnPath(){
                return this.$router.resolve({name: this.$route.name, query: this.$route.query }).route.fullPath
            }
        },
        methods: {
            ...mapActions([
                'query',
                'mutate'
            ]),

            verify(){
                

                if(!this.current_user.profile || this.current_user.profile.email_confirmation != this.email)
                {
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: `Email address does not match pending confirmation email`,
                        color: 'error'
                    })

                    this.requestEmail = true;

                    return;
                }

                this.loading = true;
               Promise.all([this.unlinkOldEmail(), this.unlinkGoogle()])
                .then(() => {
                    const credential = firebase.firebase.auth.EmailAuthProvider.credentialWithLink(this.email, window.location.href);
                    return firebase.auth.currentUser.linkWithCredential(credential)
                })
                .then(() =>  firebase.auth.currentUser.reload() )
                .then(() => {
                    window.localStorage.removeItem('emailForConnect')
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: `Email address connected successfully`,
                        color: 'success'
                    })
                    this.syncAuthWithProfile({ email: this.email });
                    this.$router.push({
                        name: 'account',
                        params: {
                            tab: 'authentication'
                        }
                    })
                })
                .catch(e => {
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: `Failed: ${e.message}`,
                        color: 'error'
                    })
                })
                .finally(() => {
                    this.loading = false;
                })
            },

            unlinkOldEmail(){
                if(this.emailProvider) return firebase.auth.currentUser.unlink(this.emailProvider.providerId);
                else return Promise.resolve();
            }, 

            unlinkGoogle(){
                if(this.googleProvider) return  firebase.auth.currentUser.unlink(this.googleProvider.providerId)
                else return Promise.resolve();
            },
           
            verifyEmail(){
                if(this.$refs.EmailVerification.validate()){
                    this.verify();
                }
            },

        },

        watch: {
            app_ready: {
                immediate: true,
                handler(ready){
                    if(!ready) return;

                    if(!firebase.auth.currentUser)
                    {

                        this.$router.push({
                            name: 'signin',
                            query: {
                                redirect: this.returnPath
                            },
                            params: {
                                alert: {
                                    type: 'info',
                                    text: 'You need to signin first with your old credentials to continue your Email verification'
                                }
                            }
                        })
                        return;
                    }

                    if(firebase.auth.isSignInWithEmailLink(window.location.href)) {
                        this.email = window.localStorage.getItem('emailForConnect');
                        if (!this.email) {
                            this.requestEmail = true;
                        }else{
                            this.verify();
                        }
                    }else{
                        this.$router.push({
                            name: 'account',
                            params: {
                                tab: 'authentication'
                            }
                        })
                    }
                }
            }
        }
    }
</script>


